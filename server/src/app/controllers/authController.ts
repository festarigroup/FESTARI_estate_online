import notificationService from "#app/services/notificationService.js";
import otpService from "#app/services/otpService.js";
import userService from "#app/services/usersService.js";
import { asyncErrorHandler } from "#app/utils/asyncErrorHandler.js";
import CustomError from "#app/utils/CustomError.js";
import { toUserGetDto } from "#app/utils/mappers/UserMappers.js";
import { otpGenerator } from "#app/utils/otpGenerator.js";
import tokenService from "#app/utils/TokenService.js";
import type { Request, Response } from "express";
import { db } from "#app/db/db.js";
import { comparePassword, hashPassword } from "#app/utils/crypto.js";
import customerService from "#app/services/customersService.js";
import walletService from "#app/services/walletService.js";
import { UserRow, UserWithRoles } from "#app/types/UserTypes.js";
import driverService from "#app/services/driversService.js";
import rolesService from "#app/services/rolesService.js";
import bodyParser from "body-parser";
import { sanitizePhone } from "#app/utils/sanitizePhone.js";
import { verifyGoogleToken } from "#app/services/googleService.js";
import sessionService from "#app/services/sessionService.js";
import { OAuth2Client } from "google-auth-library";

const MAX_OTP_ATTEMPTS = 5;

function sendRefreshTokenCookie(res: Response, token: string) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

const googleClient = new OAuth2Client();
const GOOGLE_AUDIENCES = [
  process.env.GOOGLE_WEB_CLIENT_ID,
  process.env.GOOGLE_CLIENT_ID,
].filter((id): id is string => Boolean(id));

export const googleLogin = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { idToken, role } = req.body;

    if (GOOGLE_AUDIENCES.length === 0) {
      throw new CustomError("Google Sign-In is not configured on the server", 500);
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_AUDIENCES,
    });
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

      const hasRole = roles.includes(role);

      if (!hasRole) {
        if (role === "customer") {
          await customerService.createCustomerTx(tx, {
            id: user.id,
            points: 0,
            bags_recycled: 0,
          });
          await walletService.getOrCreateWalletTx(tx, user.id);
        } else if (role === "driver") {
          await driverService.createDriverTx(tx, { id: user.id });
        }
        await rolesService.createRoleTx(tx, { user_id: user.id, role });
        roles = [...roles, role];
      }
    });

    const { accessToken, refreshToken } = tokenService.generateTokens({
      id: user!.id,
      roles,
    });

    const session = await sessionService.createSession(user!.id, refreshToken, {
      deviceName: req.body.deviceName,
      platform: req.body.platform,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      loginAuthKey: "email",
      loginAuthValue: email,
    });

    sendRefreshTokenCookie(res, refreshToken);

    return res.status(isNewUser ? 201 : 200).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        sessionId: session?.id,
        user: { ...toUserGetDto(user!), roles },
      },
    });
  },
);

export const registerUser = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { authKey, role, find } = req.body;
    let { authValue } = req.body;

    if (authKey === "email") {
      authValue = authValue.toLowerCase().trim();
    } else if (authKey === "phone") {
      authValue = sanitizePhone(authValue.trim());
      if (!authValue) {
        throw new CustomError("Invalid phone number", 400);
      }
    }

    let user: UserRow | null = null;
    let isNewUser = false;
    let addedNewRole = false;

    await db.transaction(async (tx) => {
      if (authKey === "email") {
        user = await userService.getUserByEmail(authValue.toLowerCase());
      } else if (authKey === "phone") {
        user = await userService.getUserByPhone(authValue);
      }

      if (!user) {
        if (find) {
          throw new CustomError(
            "User not found, please ensure your details are correct.",
            404,
          );
        }
        user = await userService.createUserTx(tx, {
          email: authKey === "email" ? authValue.toLowerCase() : null,
          phone: authKey === "phone" ? authValue : null,
        });

        if (!user) {
          throw new CustomError(
            "Failed to create user, please try again later",
            500,
          );
        }
        isNewUser = true;
      }

      const hasRole = await rolesService.hasRoleTx(tx, {
        user_id: user.id,
        role,
      });

      if (!hasRole) {
        if (role === "customer") {
          await customerService.createCustomerTx(tx, {
            id: user.id,
            points: 0,
            bags_recycled: 0,
          });
          await walletService.getOrCreateWalletTx(tx, user.id);
        } else if (role === "driver") {
          await driverService.createDriverTx(tx, {
            id: user.id,
          });
        }

        await rolesService.createRoleTx(tx, {
          user_id: user.id,
          role,
        });
        addedNewRole = true;
      }

      const otpRaw = otpGenerator().toString();
      console.log(otpRaw)
      const otpHashed = await hashPassword(otpRaw);

      await otpService.createOtpTx(tx, {
        user_id: user.id,
        otp_hash: otpHashed,
        purpose: "login",
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
      });

      if (authKey === "phone" && user.phone) {
        await notificationService.sendSms(`Hi, your otp is ${otpRaw}`, [
          user.phone,
        ]);
      } else if (authKey === "email" && user.email) {
        await notificationService.sendEmail(
          [user.email],
          otpRaw,
          user.firstname ?? "",
        );
      }
    });

    return res.status(201).json({
      success: true,
      message: isNewUser
        ? "Account created. OTP sent."
        : addedNewRole
          ? "Access added to your account. OTP sent."
          : "Welcome back. OTP sent.",
      data: {
        user: toUserGetDto(user!),
      },
    });
  },
);

export const verifyOtp = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { authKey, otp, purpose } = req.body;
    let { authValue } = req.body;

    if (authKey === "email") {
      authValue = authValue.toLowerCase().trim();
    } else if (authKey === "phone") {
      authValue = sanitizePhone(authValue);
      if (!authValue) {
        throw new CustomError("Invalid phone number, plesase try again.", 400);
      }
    }

    let user = null;
    if (authKey === "email") {
      user = await userService.getUserByEmail(authValue.toLowerCase());
    } else if (authKey === "phone") {
      user = await userService.getUserByPhone(authValue);
    } else {
      throw new CustomError(
        "Please use email or phone to login to your account",
        400,
      );
    }

    if (!user) {
      throw new CustomError("Invalid credentials", 400);
    }

    await db.transaction(async (tx) => {
      const otpRecord = await otpService.getLatestOtpTx(tx, user.id, purpose);
      if (!otpRecord) {
        throw new CustomError("OTP not found. Please request a new OTP.", 400);
      }

      // already used / invalidated / locked
      if (otpRecord.locked_at) {
        throw new CustomError(
          "Too many attempts. Please request a new OTP.",
          400,
        );
      }

      // expired
      if (otpRecord.expires_at.getTime() < Date.now()) {
        await otpService.deleteOtpTx(tx, otpRecord.id);
        throw new CustomError(
          "OTP has expired. Please request a new OTP.",
          400,
        );
      }

      // lock the otp
      if (otpRecord.attempt_count >= MAX_OTP_ATTEMPTS) {
        await otpService.lockOtpTx(tx, otpRecord.id);
        throw new CustomError(
          "Too many failed attempts. Please request a new OTP.",
          429,
        );
      }

      const isValid = await comparePassword(otp, otpRecord.otp_hash);
      if (!isValid) {
        const nextAttempts = otpRecord.attempt_count + 1;
        if (nextAttempts >= MAX_OTP_ATTEMPTS) {
          await otpService.lockOtpTx(tx, otpRecord.id);
          throw new CustomError(
            "Too many failed attempts. Please request a new OTP.",
            429,
          );
        }

        await otpService.incrementAttemptsTx(tx, otpRecord.id);
        throw new CustomError(
          `Invalid OTP. ${MAX_OTP_ATTEMPTS - nextAttempts} attempt(s) remaining.`,
          400,
        );
      }

      // after success, delete otp
      await otpService.deleteOtpTx(tx, otpRecord.id);
      await userService.updateUserTx(tx, user.id, {
        verified: true,
      });
    });

    const { accessToken, refreshToken } = tokenService.generateTokens(user);

    const session = await sessionService.createSession(user.id, refreshToken, {
      deviceName: req.body.deviceName,
      platform: req.body.platform,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      loginAuthKey: authKey,
      loginAuthValue: authValue,
    });

    sendRefreshTokenCookie(res, refreshToken);

    const freshUser = await userService.getUserById(user.id);

    return res.status(200).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        sessionId: session?.id,
        user: toUserGetDto(freshUser ?? user),
      },
    });
  },
);

export const getWelcomeContext = asyncErrorHandler(
  async (req: Request, res: Response) => {
    if (!req.user?.id) throw new CustomError("Unauthorized", 401);
    const authKey = String(req.query.authKey ?? "");
    const authValue = String(req.query.authValue ?? "");
    const sessionId = req.query.sessionId ? String(req.query.sessionId) : "";

    if (!authKey || !authValue) {
      throw new CustomError("authKey and authValue are required", 400);
    }
    if (!sessionId) {
      throw new CustomError("sessionId is required", 400);
    }

    const context = await sessionService.getWelcomeContext(
      req.user.id,
      sessionId,
      authKey,
      authValue,
    );

    return res.status(200).json({ success: true, data: context });
  },
);

export const resendOtp = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { authKey, purpose } = req.body;
    let { authValue } = req.body;

    if (authKey === "email") {
      authValue = authValue.toLowerCase().trim();
    } else if (authKey === "phone") {
      authValue = sanitizePhone(authValue);
      if (!authValue) {
        throw new CustomError("Invalid phone number", 400);
      }
    }

    let user = null;

    if (authKey === "email") {
      user = await userService.getUserByEmail(authValue.toLowerCase());
    } else if (authKey === "phone") {
      user = await userService.getUserByPhone(authValue);
    } else {
      throw new CustomError("Please use email or phone", 400);
    }
    if (!user) {
      throw new CustomError("Invalid credentials", 400);
    }

    const otpRaw = otpGenerator().toString();
    console.log(otpRaw)
    const otpHash = await hashPassword(otpRaw);

    await otpService.createOtp({
      user_id: user.id,
      otp_hash: otpHash,
      purpose,
      expires_at: new Date(Date.now() + 10 * 60 * 1000),
    });

    if (authKey == "phone" && user.phone) {
      await notificationService.sendSms(`Hi, your otp is ${otpRaw}`, [
        user.phone,
      ]);
    } else if (authKey == "email" && user.email) {
      await notificationService.sendEmail(
        [user.email],
        otpRaw,
        user.firstname ?? "",
      );
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  },
);

export const refreshToken = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const accessToken = tokenService.refreshAccessToken(refreshToken);
    return res.status(200).json({ success: true, data: { accessToken } });
  },
);
