import { Request, Response } from "express";
import artisansService from "#app/services/artisansService.js";
import notificationsService from "#app/services/notificationsService.js";
import { asyncErrorHandler } from "#app/utils/asyncErrorHandler.js";
import CustomError from "#app/utils/CustomError.js";
import { requiredRouteParam } from "#app/utils/routeParams.js";
import { parsePaginationParams, validatePaginationParams } from "#app/utils/pagination.js";

function assertOwnerOrAdmin(userId: string, roles: string[], ownerId: string) {
  if (ownerId !== userId && !roles.includes("admin")) {
    throw new CustomError("Forbidden", 403);
  }
}

export const listArtisans = asyncErrorHandler(async (req: Request, res: Response) => {
  const { limit, current_page, offset } = parsePaginationParams(req.query);
  const { items, total } = await artisansService.list(req.query.service_type as string, limit, offset);
  const { current_page: validatedPage } = validatePaginationParams(current_page, limit, total);

  return res.status(200).json({
    success: true,
    data: { items, metadata: { total, pages: Math.ceil(total / limit), current_page: validatedPage, limit } },
  });
});

export const getTopArtisans = asyncErrorHandler(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 4;
  const items = await artisansService.getTop(limit);
  return res.status(200).json({ success: true, data: items });
});

export const getArtisan = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = requiredRouteParam(req.params.id, "id");
  const profile = await artisansService.getById(id);
  if (!profile) throw new CustomError("Artisan not found", 404);

  const [rating, reviews] = await Promise.all([
    artisansService.getRatingSummary(id),
    artisansService.listReviews(id),
  ]);

  return res.status(200).json({ success: true, data: { ...profile, ...rating, reviews } });
});

export const createArtisanProfile = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);

  const existing = await artisansService.getById(req.user.id);
  if (existing) throw new CustomError("Artisan profile already exists for this account", 409);

  const profile = await artisansService.create({ ...req.body, id: req.user.id });
  return res.status(201).json({ success: true, data: profile });
});

export const updateArtisanProfile = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const profile = await artisansService.getById(id);
  if (!profile) throw new CustomError("Artisan not found", 404);
  assertOwnerOrAdmin(req.user.id, req.user.roles, profile.id);

  const updated = await artisansService.update(id, req.body);
  return res.status(200).json({ success: true, data: updated });
});

export const deleteArtisanProfile = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const profile = await artisansService.getById(id);
  if (!profile) throw new CustomError("Artisan not found", 404);
  assertOwnerOrAdmin(req.user.id, req.user.roles, profile.id);

  await artisansService.delete(id);
  return res.status(200).json({ success: true, message: "Artisan profile deleted" });
});

export const approveArtisan = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = requiredRouteParam(req.params.id, "id");
  const updated = await artisansService.setStatus(id, "approved");
  if (!updated) throw new CustomError("Artisan not found", 404);
  return res.status(200).json({ success: true, data: updated });
});

export const rejectArtisan = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = requiredRouteParam(req.params.id, "id");
  const updated = await artisansService.setStatus(id, "rejected");
  if (!updated) throw new CustomError("Artisan not found", 404);
  return res.status(200).json({ success: true, data: updated });
});

export const hireArtisan = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const artisanId = requiredRouteParam(req.params.id, "id");

  const artisan = await artisansService.getById(artisanId);
  if (!artisan) throw new CustomError("Artisan not found", 404);

  const hire = await artisansService.createHireRequest({
    artisan_id: artisanId,
    requester_id: req.user.id,
    message: req.body.message,
  });

  notificationsService
    .notify({
      recipientId: artisan.id,
      actorId: req.user.id,
      verb: "hire_request",
      targetType: "artisan_hire_request",
      targetId: hire.id,
      title: "New hire request",
      body: "You have a new hire request.",
    })
    .catch(() => {});

  return res.status(201).json({ success: true, data: hire });
});

export const getMyHireRequests = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const requests = await artisansService.listHireRequestsForRequester(req.user.id);
  return res.status(200).json({ success: true, data: requests });
});

export const getArtisanHireRequests = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const artisanId = requiredRouteParam(req.params.id, "id");

  const artisan = await artisansService.getById(artisanId);
  if (!artisan) throw new CustomError("Artisan not found", 404);
  assertOwnerOrAdmin(req.user.id, req.user.roles, artisan.id);

  const requests = await artisansService.listHireRequestsForArtisan(artisanId);
  return res.status(200).json({ success: true, data: requests });
});

export const updateHireRequestStatus = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const hire = await artisansService.getHireRequestById(id);
  if (!hire) throw new CustomError("Hire request not found", 404);
  assertOwnerOrAdmin(req.user.id, req.user.roles, hire.artisan_id);

  const updated = await artisansService.updateHireRequestStatus(id, req.body.status);
  return res.status(200).json({ success: true, data: updated });
});

export const createReview = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const artisanId = requiredRouteParam(req.params.id, "id");

  const artisan = await artisansService.getById(artisanId);
  if (!artisan) throw new CustomError("Artisan not found", 404);

  const review = await artisansService.createReview({
    artisan_id: artisanId,
    reviewer_id: req.user.id,
    rating: req.body.rating,
    comment: req.body.comment,
  });

  return res.status(201).json({ success: true, data: review });
});
