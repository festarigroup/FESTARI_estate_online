import { Request, Response } from "express";
import inquiriesService from "#app/services/inquiriesService.js";
import propertiesService from "#app/services/propertiesService.js";
import artisansService from "#app/services/artisansService.js";
import notificationsService from "#app/services/notificationsService.js";
import { asyncErrorHandler } from "#app/utils/asyncErrorHandler.js";
import CustomError from "#app/utils/CustomError.js";
import { requiredRouteParam } from "#app/utils/routeParams.js";

function assertOwnerOrAdmin(userId: string, roles: string[], ownerId: string) {
  if (ownerId !== userId && !roles.includes("admin")) {
    throw new CustomError("Forbidden", 403);
  }
}

export const createPropertyInquiry = asyncErrorHandler(async (req: Request, res: Response) => {
  const propertyId = requiredRouteParam(req.body.property_id, "property_id");
  const property = await propertiesService.getById(propertyId);
  if (!property) throw new CustomError("Property not found", 404);

  const inquiry = await inquiriesService.createPropertyInquiry({
    property_id: propertyId,
    user_id: req.user?.id ?? null,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message,
  });

  notificationsService
    .notify({
      recipientId: property.owner_id,
      actorId: req.user?.id,
      verb: "inquiry",
      targetType: "property",
      targetId: propertyId,
      title: "New property inquiry",
      body: `${req.body.name} sent an inquiry about ${property.title}.`,
    })
    .catch(() => {});

  return res.status(201).json({ success: true, data: inquiry });
});

export const listPropertyInquiries = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const propertyId = requiredRouteParam(req.query.property_id as string, "property_id");

  const property = await propertiesService.getById(propertyId);
  if (!property) throw new CustomError("Property not found", 404);
  assertOwnerOrAdmin(req.user.id, req.user.roles, property.owner_id);

  const inquiries = await inquiriesService.listPropertyInquiries(propertyId);
  return res.status(200).json({ success: true, data: inquiries });
});

export const getPropertyInquiry = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const inquiry = await inquiriesService.getPropertyInquiryById(id);
  if (!inquiry) throw new CustomError("Inquiry not found", 404);

  const property = await propertiesService.getById(inquiry.property_id);
  assertOwnerOrAdmin(req.user.id, req.user.roles, property?.owner_id ?? "");

  return res.status(200).json({ success: true, data: inquiry });
});

export const markPropertyInquiryRead = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const inquiry = await inquiriesService.getPropertyInquiryById(id);
  if (!inquiry) throw new CustomError("Inquiry not found", 404);

  const property = await propertiesService.getById(inquiry.property_id);
  assertOwnerOrAdmin(req.user.id, req.user.roles, property?.owner_id ?? "");

  const updated = await inquiriesService.markPropertyInquiryRead(id);
  return res.status(200).json({ success: true, data: updated });
});

export const deletePropertyInquiry = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = requiredRouteParam(req.params.id, "id");
  await inquiriesService.deletePropertyInquiry(id);
  return res.status(200).json({ success: true, message: "Inquiry deleted" });
});

export const createArtisanInquiry = asyncErrorHandler(async (req: Request, res: Response) => {
  const artisanId = requiredRouteParam(req.body.artisan_id, "artisan_id");
  const artisan = await artisansService.getById(artisanId);
  if (!artisan) throw new CustomError("Artisan not found", 404);

  const inquiry = await inquiriesService.createArtisanInquiry({
    artisan_id: artisanId,
    user_id: req.user?.id ?? null,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message,
  });

  notificationsService
    .notify({
      recipientId: artisan.id,
      actorId: req.user?.id,
      verb: "inquiry",
      targetType: "artisan",
      targetId: artisanId,
      title: "New service inquiry",
      body: `${req.body.name} sent an inquiry about your services.`,
    })
    .catch(() => {});

  return res.status(201).json({ success: true, data: inquiry });
});

export const listArtisanInquiries = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const artisanId = requiredRouteParam(req.query.artisan_id as string, "artisan_id");

  const artisan = await artisansService.getById(artisanId);
  if (!artisan) throw new CustomError("Artisan not found", 404);
  assertOwnerOrAdmin(req.user.id, req.user.roles, artisan.id);

  const inquiries = await inquiriesService.listArtisanInquiries(artisanId);
  return res.status(200).json({ success: true, data: inquiries });
});

export const getArtisanInquiry = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const inquiry = await inquiriesService.getArtisanInquiryById(id);
  if (!inquiry) throw new CustomError("Inquiry not found", 404);

  assertOwnerOrAdmin(req.user.id, req.user.roles, inquiry.artisan_id);

  return res.status(200).json({ success: true, data: inquiry });
});

export const markArtisanInquiryRead = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const inquiry = await inquiriesService.getArtisanInquiryById(id);
  if (!inquiry) throw new CustomError("Inquiry not found", 404);
  assertOwnerOrAdmin(req.user.id, req.user.roles, inquiry.artisan_id);

  const updated = await inquiriesService.markArtisanInquiryRead(id);
  return res.status(200).json({ success: true, data: updated });
});

export const deleteArtisanInquiry = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = requiredRouteParam(req.params.id, "id");
  await inquiriesService.deleteArtisanInquiry(id);
  return res.status(200).json({ success: true, message: "Inquiry deleted" });
});
