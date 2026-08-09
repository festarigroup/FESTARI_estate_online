import { Request, Response } from "express";
import propertiesService from "#app/services/propertiesService.js";
import wishlistService from "#app/services/wishlistService.js";
import subscriptionLimitService from "#app/services/subscriptionLimitService.js";
import mediaStorageService from "#app/services/mediaStorageService.js";
import { asyncErrorHandler } from "#app/utils/asyncErrorHandler.js";
import CustomError from "#app/utils/CustomError.js";
import { requiredRouteParam } from "#app/utils/routeParams.js";
import { parsePaginationParams, validatePaginationParams } from "#app/utils/pagination.js";

function assertOwnerOrAdmin(userId: string, roles: string[], ownerId: string) {
  if (ownerId !== userId && !roles.includes("admin")) {
    throw new CustomError("Forbidden", 403);
  }
}

export const listProperties = asyncErrorHandler(async (req: Request, res: Response) => {
  const { limit, current_page, offset } = parsePaginationParams(req.query);
  const { location, property_type, listing_type, min_price, max_price, bedrooms, ordering } = req.query;

  const { items, total } = await propertiesService.list(
    {
      location: location as string,
      property_type: property_type as string,
      listing_type: listing_type as string,
      min_price: min_price ? Number(min_price) : undefined,
      max_price: max_price ? Number(max_price) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      ordering: ordering as string,
    },
    limit,
    offset,
  );
  const { current_page: validatedPage } = validatePaginationParams(current_page, limit, total);

  return res.status(200).json({
    success: true,
    data: { items, metadata: { total, pages: Math.ceil(total / limit), current_page: validatedPage, limit } },
  });
});

export const getCategories = asyncErrorHandler(async (_req: Request, res: Response) => {
  const counts = await propertiesService.getCategoryCounts();
  return res.status(200).json({ success: true, data: counts });
});

export const getTrending = asyncErrorHandler(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 2;
  const items = await propertiesService.getTrending(limit);
  return res.status(200).json({ success: true, data: items });
});

export const getWishlist = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const items = await wishlistService.listForUser(req.user.id);
  return res.status(200).json({ success: true, data: items });
});

export const addToWishlist = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");
  const property = await propertiesService.getById(id);
  if (!property) throw new CustomError("Property not found", 404);
  await wishlistService.add(req.user.id, id);
  return res.status(200).json({ success: true, message: "Added to wishlist" });
});

export const removeFromWishlist = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");
  await wishlistService.remove(req.user.id, id);
  return res.status(200).json({ success: true, message: "Removed from wishlist" });
});

export const getProperty = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = requiredRouteParam(req.params.id, "id");
  const property = await propertiesService.getById(id);
  if (!property) throw new CustomError("Property not found", 404);

  const images = await propertiesService.getImages(id);
  await propertiesService.incrementViews(id);

  return res.status(200).json({ success: true, data: { ...property, images } });
});

export const createProperty = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);

  const currentCount = await propertiesService.countByOwner(req.user.id);
  await subscriptionLimitService.assertWithinLimit(req.user.id, "max_properties", currentCount);

  const property = await propertiesService.create({ ...req.body, owner_id: req.user.id });
  return res.status(201).json({ success: true, data: property });
});

export const updateProperty = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const property = await propertiesService.getById(id);
  if (!property) throw new CustomError("Property not found", 404);
  assertOwnerOrAdmin(req.user.id, req.user.roles, property.owner_id);

  const updated = await propertiesService.update(id, req.body);
  return res.status(200).json({ success: true, data: updated });
});

export const deleteProperty = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const property = await propertiesService.getById(id);
  if (!property) throw new CustomError("Property not found", 404);
  assertOwnerOrAdmin(req.user.id, req.user.roles, property.owner_id);

  await propertiesService.delete(id);
  return res.status(200).json({ success: true, message: "Property deleted" });
});

export const approveProperty = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = requiredRouteParam(req.params.id, "id");
  const updated = await propertiesService.setStatus(id, "approved");
  if (!updated) throw new CustomError("Property not found", 404);
  return res.status(200).json({ success: true, data: updated });
});

export const rejectProperty = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = requiredRouteParam(req.params.id, "id");
  const updated = await propertiesService.setStatus(id, "rejected");
  if (!updated) throw new CustomError("Property not found", 404);
  return res.status(200).json({ success: true, data: updated });
});

export const uploadPropertyImage = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const property = await propertiesService.getById(id);
  if (!property) throw new CustomError("Property not found", 404);
  assertOwnerOrAdmin(req.user.id, req.user.roles, property.owner_id);

  if (!req.file) throw new CustomError("Image is required", 400);

  const existingImages = await propertiesService.getImages(id);
  await subscriptionLimitService.assertWithinLimit(req.user.id, "max_images", existingImages.length);

  const imageUrl = await mediaStorageService.uploadMedia({
    pathPrefix: `properties/${id}`,
    fileBuffer: req.file.buffer,
    contentType: req.file.mimetype,
  });

  const image = await propertiesService.addImage({
    property_id: id,
    image_url: imageUrl,
    position: Number(req.body.position) || existingImages.length,
  });

  return res.status(201).json({ success: true, data: image });
});

export const deletePropertyImage = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");
  const imageId = requiredRouteParam(req.params.imageId, "imageId");

  const property = await propertiesService.getById(id);
  if (!property) throw new CustomError("Property not found", 404);
  assertOwnerOrAdmin(req.user.id, req.user.roles, property.owner_id);

  const image = await propertiesService.getImageById(imageId);
  if (!image || image.property_id !== id) throw new CustomError("Image not found", 404);

  await mediaStorageService.deleteMedia(image.image_url).catch(() => {});
  await propertiesService.deleteImage(imageId);

  return res.status(200).json({ success: true, message: "Image deleted" });
});
