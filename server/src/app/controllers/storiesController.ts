import { Request, Response } from "express";
import storiesService from "#app/services/storiesService.js";
import mediaStorageService from "#app/services/mediaStorageService.js";
import { asyncErrorHandler } from "#app/utils/asyncErrorHandler.js";
import CustomError from "#app/utils/CustomError.js";
import { requiredRouteParam } from "#app/utils/routeParams.js";

export const listStories = asyncErrorHandler(async (_req: Request, res: Response) => {
  const stories = await storiesService.listActive();
  return res.status(200).json({ success: true, data: stories });
});

export const getStory = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = requiredRouteParam(req.params.id, "id");
  const story = await storiesService.getById(id);
  if (!story) throw new CustomError("Story not found", 404);
  return res.status(200).json({ success: true, data: story });
});

export const createStory = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  if (!req.file) throw new CustomError("Story media is required", 400);

  const mediaUrl = await mediaStorageService.uploadMedia({
    pathPrefix: `stories/${req.user.id}`,
    fileBuffer: req.file.buffer,
    contentType: req.file.mimetype,
    allowVideo: true,
  });

  const story = await storiesService.create({
    author_id: req.user.id,
    media_url: mediaUrl,
    caption: req.body.caption,
  });

  return res.status(201).json({ success: true, data: story });
});

export const deleteStory = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const story = await storiesService.getById(id);
  if (!story) throw new CustomError("Story not found", 404);
  if (story.author_id !== req.user.id && !req.user.roles.includes("admin")) {
    throw new CustomError("Forbidden", 403);
  }

  await mediaStorageService.deleteMedia(story.media_url).catch(() => {});
  await storiesService.delete(id);

  return res.status(200).json({ success: true, message: "Story deleted" });
});

export const viewStory = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const story = await storiesService.getById(id);
  if (!story) throw new CustomError("Story not found", 404);

  await storiesService.recordView(id, req.user.id);
  return res.status(200).json({ success: true, message: "View recorded" });
});
