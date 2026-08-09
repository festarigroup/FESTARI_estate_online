import { Request, Response } from "express";
import socialService from "#app/services/socialService.js";
import notificationsService from "#app/services/notificationsService.js";
import { asyncErrorHandler } from "#app/utils/asyncErrorHandler.js";
import CustomError from "#app/utils/CustomError.js";
import { requiredRouteParam } from "#app/utils/routeParams.js";

export const getSuggestions = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const limit = Number(req.query.limit) || 5;
  const suggestions = await socialService.suggestions(req.user.id, limit);
  return res.status(200).json({ success: true, data: suggestions });
});

export const followUser = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const userId = requiredRouteParam(req.params.userId, "userId");

  try {
    await socialService.follow(req.user.id, userId);
  } catch (error) {
    throw new CustomError((error as Error).message, 400);
  }

  notificationsService
    .notify({
      recipientId: userId,
      actorId: req.user.id,
      verb: "follow",
      targetType: "user",
      targetId: req.user.id,
      title: "New follower",
      body: "Someone started following you.",
    })
    .catch(() => {});

  return res.status(200).json({ success: true, message: "Followed" });
});

export const unfollowUser = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const userId = requiredRouteParam(req.params.userId, "userId");

  await socialService.unfollow(req.user.id, userId);
  return res.status(200).json({ success: true, message: "Unfollowed" });
});

export const getFollowing = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const following = await socialService.listFollowing(req.user.id);
  return res.status(200).json({ success: true, data: following });
});

export const getFollowers = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const followers = await socialService.listFollowers(req.user.id);
  return res.status(200).json({ success: true, data: followers });
});
