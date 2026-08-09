import { Request, Response } from "express";
import postsService from "#app/services/postsService.js";
import postInteractionsService from "#app/services/postInteractionsService.js";
import mediaStorageService from "#app/services/mediaStorageService.js";
import notificationsService from "#app/services/notificationsService.js";
import { asyncErrorHandler } from "#app/utils/asyncErrorHandler.js";
import CustomError from "#app/utils/CustomError.js";
import { requiredRouteParam } from "#app/utils/routeParams.js";
import { parsePaginationParams, validatePaginationParams } from "#app/utils/pagination.js";

export const listPosts = asyncErrorHandler(async (req: Request, res: Response) => {
  const { limit, current_page, offset } = parsePaginationParams(req.query);
  const { items, total } = await postsService.list(req.query.kind as string, limit, offset, req.user?.id);
  const { current_page: validatedPage } = validatePaginationParams(current_page, limit, total);

  const imagesByPost = await postsService.getImagesForPosts(items.map((item) => item.id));
  const itemsWithImages = items.map((item) => ({ ...item, images: imagesByPost.get(item.id) ?? [] }));

  return res.status(200).json({
    success: true,
    data: { items: itemsWithImages, metadata: { total, pages: Math.ceil(total / limit), current_page: validatedPage, limit } },
  });
});

export const getPost = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = requiredRouteParam(req.params.id, "id");
  const post = await postsService.getById(id, req.user?.id);
  if (!post) throw new CustomError("Post not found", 404);

  const images = await postsService.getImages(id);
  return res.status(200).json({ success: true, data: { ...post, images } });
});

export const createPost = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);

  const post = await postsService.create({ ...req.body, author_id: req.user.id });
  return res.status(201).json({ success: true, data: post });
});

export const updatePost = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const post = await postsService.getRawById(id);
  if (!post) throw new CustomError("Post not found", 404);
  if (post.author_id !== req.user.id) throw new CustomError("Forbidden", 403);

  const updated = await postsService.update(id, req.body);
  return res.status(200).json({ success: true, data: updated });
});

export const deletePost = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const post = await postsService.getRawById(id);
  if (!post) throw new CustomError("Post not found", 404);
  if (post.author_id !== req.user.id && !req.user.roles.includes("admin")) {
    throw new CustomError("Forbidden", 403);
  }

  await postsService.delete(id);
  return res.status(200).json({ success: true, message: "Post deleted" });
});

export const uploadPostImage = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const post = await postsService.getRawById(id);
  if (!post) throw new CustomError("Post not found", 404);
  if (post.author_id !== req.user.id) throw new CustomError("Forbidden", 403);

  if (!req.file) throw new CustomError("Image is required", 400);

  const existingImages = await postsService.getImages(id);
  const imageUrl = await mediaStorageService.uploadMedia({
    pathPrefix: `posts/${id}`,
    fileBuffer: req.file.buffer,
    contentType: req.file.mimetype,
  });

  const image = await postsService.addImage({
    post_id: id,
    image_url: imageUrl,
    position: Number(req.body.position) || existingImages.length,
  });

  return res.status(201).json({ success: true, data: image });
});

export const likePost = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");
  await postInteractionsService.like(id, req.user.id);

  const post = await postsService.getRawById(id);
  if (post && post.author_id !== req.user.id) {
    notificationsService
      .notify({
        recipientId: post.author_id,
        actorId: req.user.id,
        verb: "like",
        targetType: "post",
        targetId: id,
        title: "New like",
        body: "Someone liked your post.",
      })
      .catch(() => {});
  }

  return res.status(200).json({ success: true, message: "Post liked" });
});

export const unlikePost = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");
  await postInteractionsService.unlike(id, req.user.id);
  return res.status(200).json({ success: true, message: "Post unliked" });
});

export const listComments = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = requiredRouteParam(req.params.id, "id");
  const { limit, offset } = parsePaginationParams(req.query);
  const { items, total } = await postInteractionsService.listComments(id, limit, offset);
  return res.status(200).json({ success: true, data: { items, total } });
});

export const addComment = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const comment = await postInteractionsService.addComment({
    post_id: id,
    author_id: req.user.id,
    body: req.body.body,
  });

  const post = await postsService.getRawById(id);
  if (post && post.author_id !== req.user.id) {
    notificationsService
      .notify({
        recipientId: post.author_id,
        actorId: req.user.id,
        verb: "comment",
        targetType: "post",
        targetId: id,
        title: "New comment",
        body: "Someone commented on your post.",
      })
      .catch(() => {});
  }

  return res.status(201).json({ success: true, data: comment });
});

export const deleteComment = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const comment = await postInteractionsService.getCommentById(id);
  if (!comment) throw new CustomError("Comment not found", 404);
  if (comment.author_id !== req.user.id && !req.user.roles.includes("admin")) {
    throw new CustomError("Forbidden", 403);
  }

  await postInteractionsService.deleteComment(id);
  return res.status(200).json({ success: true, message: "Comment deleted" });
});

export const sharePost = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");
  const share = await postInteractionsService.recordShare(id, req.user.id);
  return res.status(201).json({ success: true, data: share });
});

export const savePost = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");
  await postInteractionsService.save(id, req.user.id);
  return res.status(200).json({ success: true, message: "Post saved" });
});

export const unsavePost = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");
  await postInteractionsService.unsave(id, req.user.id);
  return res.status(200).json({ success: true, message: "Post unsaved" });
});

export const listSavedPosts = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const items = await postInteractionsService.listSaved(req.user.id);
  return res.status(200).json({ success: true, data: items });
});
