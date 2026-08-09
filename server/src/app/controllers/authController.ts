import notificationService from "#app/services/notificationService.js";
import otpService from "#app/services/otpService.js";
import userService from "#app/services/usersService.js";
import rolesService from "#app/services/rolesService.js";
import sessionService from "#app/services/sessionService.js";
import { asyncErrorHandler } from "#app/utils/asyncErrorHandler.js";
import CustomError from "#app/utils/CustomError.js";
import { toUserGetDto } from "#app/utils/mappers/UserMappers.js";
import { otpGenerator } from "#app/utils/otpGenerator.js";
import tokenService from "#app/utils/TokenService.js";
import type { Request, Response } from "express";
import { db } from "#app/db/db.js";
import { comparePassword, hashPassword } from "#app/utils/crypto.js";
import { UserRow, UserWithRoles } from "#app/types/UserTypes.js";
import { OAuth2Client } from "google-auth-library";

const MAX_OTP_ATTEMPTS = 5;
const OTP_TTL_MS = 10 * 60 * 1000;

function sendRefreshTokenCookie(res: Response, token: string) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

async function issueSession(
  user: { id: string; roles: string[] },
  req: Request,
  res: Response,
) {
  const { accessToken, refreshToken } = tokenService.generateTokens({
    id: user.id,
    roles: user.roles,
  });

  const session = await sessionService.createSession(user.id, refreshToken, {
    deviceName: req.body.deviceName,
    platform: req.body.platform,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });

  sendRefreshTokenCookie(res, refreshToken);

  return { accessToken, refreshToken, sessionId: session?.id };
}

async function issueOtp(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  userId: string,
  purpose: "email_verification" | "password_reset",
) {
  const otpRaw = otpGenerator().toString();
  const otpHashed = await hashPassword(otpRaw);

  await otpService.createOtpTx(tx, {
    user_id: userId,
    otp_hash: otpHashed,
    purpose,
    expires_at: new Date(Date.now() + OTP_TTL_MS),
  });

  return otpRaw;
}

const googleClient = new OAuth2Client();
const GOOGLE_AUDIENCES = [process.env.GOOGLE_WEB_CLIENT_ID, process.env.GOOGLE_CLIENT_ID].filter(
  (id): id is string => Boolean(id),
);

export const googleLogin = asyncErrorHandler(async (req: Request, res: Response) => {
  const { idToken, role } = req.body;

  if (GOOGLE_AUDIENCES.length === 0) {
    throw new CustomError("Google Sign-In is not configured on the server", 500);
  }

  const ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_AUDIENCES });
  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw new CustomError("Invalid Google token", 401);
  }
  if (!payload.email_verified) {
    throw new CustomError("Google account email is not verified", 400);
  }

  const email = payload.email.toLowerCase();
  const googleId = payload.sub;

  let user: UserRow | UserWithRoles | null = null;
  let roles: string[] = [];
  let isNewUser = false;

  await db.transaction(async (tx) => {
    const existingByGoogle = await userService.getUserByGoogleId(googleId);

    if (existingByGoogle) {
      user = existingByGoogle;
      roles = existingByGoogle.roles;
    } else {
      const existingByEmail = await userService.getUserByEmail(email);

      if (existingByEmail) {
        await userService.updateUserTx(tx, existingByEmail.id, { googleId });
        user = existingByEmail;
        roles = existingByEmail.roles;
      } else {
        user = await userService.createUserTx(tx, {
          email,
          phone: null,
          googleId,
          firstname: payload.given_name ?? null,
          lastname: payload.family_name ?? null,
          verified: true,
          is_active: true,
        });
        isNewUser = true;
      }
    }

    if (!roles.includes(role)) {
      await rolesService.createRoleTx(tx, { user_id: user!.id, role });
      roles = [...roles, role];
    }
  });

  const tokens = await issueSession({ id: user!.id, roles }, req, res);

  return res.status(isNewUser ? 201 : 200).json({
    success: true,
    data: { ...tokens, user: { ...toUserGetDto(user!), roles } },
  });
});

export const registerUser = asyncErrorHandler(async (req: Request, res: Response) => {
  const { firstname, lastname, roles } = req.body;
  const email = String(req.body.email).toLowerCase().trim();
  const password = String(req.body.password);

  const existing = await userService.getUserByEmail(email);
  if (existing) {
    throw new CustomError("An account with this email already exists", 409);
  }

  const passwordHash = await hashPassword(password);
  let user: UserRow | null = null;
  let otpRaw = "";

  await db.transaction(async (tx) => {
    user = await userService.createUserTx(tx, {
      email,
      firstname,
      lastname,
      password_hash: passwordHash,
      is_active: true,
      verified: false,
    });

    for (const role of roles as string[]) {
      await rolesService.createRoleTx(tx, { user_id: user!.id, role });
    }

    otpRaw = await issueOtp(tx, user!.id, "email_verification");
  });

  if (user!.email) {
    await notificationService.sendEmail([user!.email], otpRaw, user!.firstname ?? "");
  }

  return res.status(201).json({
    success: true,
    message: "Account created. Check your email for a verification code.",
    data: { user: toUserGetDto(user!) },
  });
});

export const loginUser = asyncErrorHandler(async (req: Request, res: Response) => {
  const email = String(req.body.email).toLowerCase().trim();
  const { password } = req.body;

  const user = await userService.getUserByEmail(email);
  if (!user || !user.password_hash) {
    throw new CustomError("Invalid email or password", 401);
  }

  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) {
    throw new CustomError("Invalid email or password", 401);
  }

  if (!user.verified) {
    throw new CustomError("Please verify your email before logging in", 403);
  }

  const tokens = await issueSession(user, req, res);

  return res.status(200).json({
    success: true,
    data: { ...tokens, user: toUserGetDto(user) },
  });
});

export const verifyOtp = asyncErrorHandler(async (req: Request, res: Response) => {
  const email = String(req.body.email).toLowerCase().trim();
  const { otp, purpose } = req.body;

  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }

  await db.transaction(async (tx) => {
    const otpRecord = await otpService.getLatestOtpTx(tx, user.id, purpose);
    if (!otpRecord) {
      throw new CustomError("OTP not found. Please request a new OTP.", 400);
    }
    if (otpRecord.locked_at) {
      throw new CustomError("Too many attempts. Please request a new OTP.", 400);
    }
    if (otpRecord.expires_at.getTime() < Date.now()) {
      await otpService.deleteOtpTx(tx, otpRecord.id);
      throw new CustomError("OTP has expired. Please request a new OTP.", 400);
    }
    if (otpRecord.attempt_count >= MAX_OTP_ATTEMPTS) {
      await otpService.lockOtpTx(tx, otpRecord.id);
      throw new CustomError("Too many failed attempts. Please request a new OTP.", 429);
    }

    const isValid = await comparePassword(otp, otpRecord.otp_hash);
    if (!isValid) {
      const nextAttempts = otpRecord.attempt_count + 1;
      if (nextAttempts >= MAX_OTP_ATTEMPTS) {
        await otpService.lockOtpTx(tx, otpRecord.id);
        throw new CustomError("Too many failed attempts. Please request a new OTP.", 429);
      }
      await otpService.incrementAttemptsTx(tx, otpRecord.id);
      throw new CustomError(
        `Invalid OTP. ${MAX_OTP_ATTEMPTS - nextAttempts} attempt(s) remaining.`,
        400,
      );
    }

    await otpService.deleteOtpTx(tx, otpRecord.id);

    if (purpose === "email_verification") {
      await userService.updateUserTx(tx, user.id, { verified: true });
    }
  });

  const freshUser = await userService.getUserById(user.id);

  return res.status(200).json({
    success: true,
    data: { user: toUserGetDto(freshUser ?? user) },
  });
});

export const resendOtp = asyncErrorHandler(async (req: Request, res: Response) => {
  const email = String(req.body.email).toLowerCase().trim();
  const { purpose } = req.body;

  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }

  let otpRaw = "";
  await db.transaction(async (tx) => {
    otpRaw = await issueOtp(tx, user.id, purpose);
  });

  if (user.email) {
    await notificationService.sendEmail([user.email], otpRaw, user.firstname ?? "");
  }

  return res.status(200).json({ success: true, message: "OTP sent successfully" });
});

export const forgotPassword = asyncErrorHandler(async (req: Request, res: Response) => {
  const email = String(req.body.email).toLowerCase().trim();

  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }

  let otpRaw = "";
  await db.transaction(async (tx) => {
    otpRaw = await issueOtp(tx, user.id, "password_reset");
  });

  if (user.email) {
    await notificationService.sendEmail([user.email], otpRaw, user.firstname ?? "");
  }

  return res.status(200).json({ success: true, message: "Password reset code sent" });
});

export const resetPassword = asyncErrorHandler(async (req: Request, res: Response) => {
  const email = String(req.body.email).toLowerCase().trim();
  const { otp, newPassword } = req.body;

  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }

  await db.transaction(async (tx) => {
    const otpRecord = await otpService.getLatestOtpTx(tx, user.id, "password_reset");
    if (!otpRecord) {
      throw new CustomError("OTP not found. Please request a new OTP.", 400);
    }
    if (otpRecord.locked_at) {
      throw new CustomError("Too many attempts. Please request a new OTP.", 400);
    }
    if (otpRecord.expires_at.getTime() < Date.now()) {
      await otpService.deleteOtpTx(tx, otpRecord.id);
      throw new CustomError("OTP has expired. Please request a new OTP.", 400);
    }

    const isValid = await comparePassword(otp, otpRecord.otp_hash);
    if (!isValid) {
      const nextAttempts = otpRecord.attempt_count + 1;
      if (nextAttempts >= MAX_OTP_ATTEMPTS) {
        await otpService.lockOtpTx(tx, otpRecord.id);
        throw new CustomError("Too many failed attempts. Please request a new OTP.", 429);
      }
      await otpService.incrementAttemptsTx(tx, otpRecord.id);
      throw new CustomError(
        `Invalid OTP. ${MAX_OTP_ATTEMPTS - nextAttempts} attempt(s) remaining.`,
        400,
      );
    }

    await otpService.deleteOtpTx(tx, otpRecord.id);
    const passwordHash = await hashPassword(newPassword);
    await userService.updateUserTx(tx, user.id, { password_hash: passwordHash });
  });

  await sessionService.revokeAllSessions(user.id);

  return res.status(200).json({ success: true, message: "Password reset successfully" });
});

export const logoutUser = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);

  const { sessionId } = req.body;
  if (sessionId) {
    await sessionService.revokeSession(req.user.id, sessionId);
  } else {
    await sessionService.revokeAllSessions(req.user.id);
  }

  res.clearCookie("refreshToken");
  return res.status(200).json({ success: true, message: "Logged out" });
});

export const refreshToken = asyncErrorHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const accessToken = tokenService.refreshAccessToken(refreshToken);
  return res.status(200).json({ success: true, data: { accessToken } });
});
