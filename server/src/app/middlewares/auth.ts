import type { Request, Response, NextFunction } from "express";
import tokenService from "#app/utils/TokenService.js";
import userService from "#app/services/usersService.js";
import CustomError from "#app/utils/CustomError.js";
import { asyncErrorHandler } from "#app/utils/asyncErrorHandler.js";
import { UserWithRoles } from "#app/types/UserTypes.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserWithRoles;
    }
  }
}

export const protect = asyncErrorHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new CustomError("Authentication required", 401);
    }

    const [, token] = authHeader.split(" ");
    if (!token) {
      throw new CustomError("Authentication required", 401);
    }

    let decoded: { id: string; roles: Array<string> };
    try {
      decoded = tokenService.verifyAccessToken(token);
    } catch {
      throw new CustomError("Invalid or expired token", 401);
    }

    const userRow = await userService.getUserById(decoded.id);

    if (!userRow) throw new CustomError("User no longer exists", 401);

    req.user = userRow;
    next();
  },
);

export const restrictTo =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new CustomError("Authentication required", 401);
    }
    
    const hasRole = req.user.roles?.some((role) =>
      roles.includes(role)
    );
    if (!hasRole) {
      throw new CustomError("You do not have permission", 403);
    }
    next();
  };
