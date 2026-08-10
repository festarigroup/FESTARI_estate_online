import userService from "#app/services/usersService.js";
import rolesService from "#app/services/rolesService.js";
import avatarStorageService from "#app/services/avatarStorageService.js";
import { asyncErrorHandler } from "#app/utils/asyncErrorHandler.js";
import { requiredRouteParam } from "#app/utils/routeParams.js";
import { parsePaginationParams, validatePaginationParams } from "#app/utils/pagination.js";
import type { Request, Response } from "express";
import CustomError from "#app/utils/CustomError.js";
import { toUserGetDto } from "#app/utils/mappers/UserMappers.js";
import { sanitizePhone } from "#app/utils/sanitizePhone.js";

export const getUsers = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { limit, current_page, offset } = parsePaginationParams(req.query);
    const [users, total] = await Promise.all([userService.getUsers(limit, offset), userService.countUsers()]);
    const sanitized = users.map((user) => toUserGetDto(user));
    const { current_page: validatedPage } = validatePaginationParams(current_page, limit, total);
    
    return res.status(200).json({
      success: true,
      data: {
        items: sanitized,
        metadata: {
          total,
          pages: Math.ceil(total / limit),
          current_page: validatedPage,
          limit,
        },
      },
    });
  }
);

export const getUser = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const id = requiredRouteParam(req.params.id, "id");
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: { user: toUserGetDto(user) } });
  }
);

export const getUserByKey = asyncErrorHandler(async (req: Request, res: Response) => {
  const { authKey, authValue } = req.query;
  let user = null

  if(authKey == "email"){
    user = await userService.getUserByEmail(authValue as string);
  }else if(authKey == "phone"){
    user = await userService.getUserByPhone(authValue as string);
  }else{
    throw new CustomError("Please use email address or phone number to log into your account", 400);
  }
  if (!user) {
    throw new CustomError("User does not exist", 404);
  }

  return res.status(200).json({
    success: true,
    data: {
      user: toUserGetDto(user)
    },
  });
});

export const getCurrentUser = asyncErrorHandler(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new CustomError("Unauthorized", 401);
  }
  return res.status(200).json({
    success: true,
    data: {
      user: toUserGetDto(user)
    },
  });
});

export const acceptTerms = asyncErrorHandler(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new CustomError("Unauthorized", 401);
  }

  const updated = await userService.updateUser(user.id, {
    terms_accepted_at: new Date(),
    is_active: true,
  });

  return res.status(200).json({
    success: true,
    data: { user: toUserGetDto(updated ?? user) },
    message: "Terms accepted successfully",
  });
});

export const uploadProfileAvatar = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
      throw new CustomError("Unauthorized", 401);
    }

    if (!req.file) {
      throw new CustomError("Avatar image is required", 400);
    }

    let uploadedUrl: string | null = null;

    try {
      uploadedUrl = await avatarStorageService.uploadUserAvatar({
        userId: user.id,
        fileBuffer: req.file.buffer,
        contentType: req.file.mimetype,
        previousUrl: user.profile_picture,
      });

      const updated = await userService.updateUser(user.id, {
        profile_picture: uploadedUrl,
      });

      return res.status(200).json({
        success: true,
        data: {
          user: toUserGetDto(updated ?? user),
          profile_picture: uploadedUrl,
        },
        message: "Profile photo updated",
      });
    } catch (error) {
      if (uploadedUrl) {
        await avatarStorageService.deleteUserAvatar(uploadedUrl).catch(() => {});
      }
      throw error;
    }
  },
);

export const setRole = asyncErrorHandler(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new CustomError("Unauthorized", 401);
  }

  const { role } = req.body;
  await rolesService.addRole(user.id, role);

  const updated = await userService.getUserById(user.id);

  return res.status(200).json({
    success: true,
    data: { user: toUserGetDto(updated ?? user) },
    message: "Role saved",
  });
});

export const updateUser = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { email, firstname, lastname, phone, profile_picture } = req.body;
    const id = requiredRouteParam(req.params.id, "id");
    const user = req.user;
    if (!user) {
      throw new CustomError("Unauthorized", 401);
    }
    if (user.id !== id) {
      throw new CustomError("Forbidden", 403);
    }

    const updated = await userService.updateUser(user.id, {
      email: email ? email.toLowerCase() : user.email,
      firstname: firstname ?? user.firstname,
      lastname: lastname ?? user.lastname,
      phone: sanitizePhone(phone) ?? user.phone,
      ...(profile_picture !== undefined ? { profile_picture } : {}),
    });

    return res.status(200).json({
      success: true,
      data: { user: toUserGetDto(updated ?? user) },
      message: "Updated successfully",
    });
  },
);