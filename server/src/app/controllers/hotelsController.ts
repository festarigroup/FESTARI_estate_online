import { Request, Response } from "express";
import hotelsService from "#app/services/hotelsService.js";
import subscriptionLimitService from "#app/services/subscriptionLimitService.js";
import mediaStorageService from "#app/services/mediaStorageService.js";
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

export const listHotels = asyncErrorHandler(async (req: Request, res: Response) => {
  const { limit, current_page, offset } = parsePaginationParams(req.query);
  const { items, total } = await hotelsService.list(req.query.location as string, limit, offset);
  const { current_page: validatedPage } = validatePaginationParams(current_page, limit, total);

  return res.status(200).json({
    success: true,
    data: { items, metadata: { total, pages: Math.ceil(total / limit), current_page: validatedPage, limit } },
  });
});

export const getHotel = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = requiredRouteParam(req.params.id, "id");
  const hotel = await hotelsService.getById(id);
  if (!hotel) throw new CustomError("Hotel not found", 404);
  const images = await hotelsService.getImages(id);
  return res.status(200).json({ success: true, data: { ...hotel, images } });
});

export const createHotel = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);

  const currentCount = await hotelsService.countByOwner(req.user.id);
  await subscriptionLimitService.assertWithinLimit(req.user.id, "max_hotels", currentCount);

  const hotel = await hotelsService.create({ ...req.body, owner_id: req.user.id });
  return res.status(201).json({ success: true, data: hotel });
});

export const updateHotel = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const hotel = await hotelsService.getById(id);
  if (!hotel) throw new CustomError("Hotel not found", 404);
  assertOwnerOrAdmin(req.user.id, req.user.roles, hotel.owner_id);

  const updated = await hotelsService.update(id, req.body);
  return res.status(200).json({ success: true, data: updated });
});

export const deleteHotel = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const hotel = await hotelsService.getById(id);
  if (!hotel) throw new CustomError("Hotel not found", 404);
  assertOwnerOrAdmin(req.user.id, req.user.roles, hotel.owner_id);

  await hotelsService.delete(id);
  return res.status(200).json({ success: true, message: "Hotel deleted" });
});

export const approveHotel = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = requiredRouteParam(req.params.id, "id");
  const updated = await hotelsService.setStatus(id, "approved");
  if (!updated) throw new CustomError("Hotel not found", 404);
  return res.status(200).json({ success: true, data: updated });
});

export const rejectHotel = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = requiredRouteParam(req.params.id, "id");
  const updated = await hotelsService.setStatus(id, "rejected");
  if (!updated) throw new CustomError("Hotel not found", 404);
  return res.status(200).json({ success: true, data: updated });
});

export const uploadHotelImage = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const hotel = await hotelsService.getById(id);
  if (!hotel) throw new CustomError("Hotel not found", 404);
  assertOwnerOrAdmin(req.user.id, req.user.roles, hotel.owner_id);

  if (!req.file) throw new CustomError("Image is required", 400);

  const existingImages = await hotelsService.getImages(id);
  await subscriptionLimitService.assertWithinLimit(req.user.id, "max_images", existingImages.length);

  const imageUrl = await mediaStorageService.uploadMedia({
    pathPrefix: `hotels/${id}`,
    fileBuffer: req.file.buffer,
    contentType: req.file.mimetype,
  });

  const image = await hotelsService.addImage({
    hotel_id: id,
    image_url: imageUrl,
    position: Number(req.body.position) || existingImages.length,
  });

  return res.status(201).json({ success: true, data: image });
});

export const deleteHotelImage = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");
  const imageId = requiredRouteParam(req.params.imageId, "imageId");

  const hotel = await hotelsService.getById(id);
  if (!hotel) throw new CustomError("Hotel not found", 404);
  assertOwnerOrAdmin(req.user.id, req.user.roles, hotel.owner_id);

  const image = await hotelsService.getImageById(imageId);
  if (!image || image.hotel_id !== id) throw new CustomError("Image not found", 404);

  await mediaStorageService.deleteMedia(image.image_url).catch(() => {});
  await hotelsService.deleteImage(imageId);

  return res.status(200).json({ success: true, message: "Image deleted" });
});

export const listHotelBookings = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const hotelId = requiredRouteParam(req.params.hotelId, "hotelId");

  const hotel = await hotelsService.getById(hotelId);
  if (!hotel) throw new CustomError("Hotel not found", 404);
  assertOwnerOrAdmin(req.user.id, req.user.roles, hotel.owner_id);

  const bookings = await hotelsService.listBookingsForHotel(hotelId);
  return res.status(200).json({ success: true, data: bookings });
});

export const createHotelBooking = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const hotelId = requiredRouteParam(req.params.hotelId, "hotelId");

  const hotel = await hotelsService.getById(hotelId);
  if (!hotel) throw new CustomError("Hotel not found", 404);

  const checkIn = new Date(req.body.check_in);
  const checkOut = new Date(req.body.check_out);
  const nights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
  const totalPrice = (Number(hotel.price_per_night) * nights).toFixed(2);

  const booking = await hotelsService.createBooking({
    hotel_id: hotelId,
    user_id: req.user.id,
    check_in: req.body.check_in,
    check_out: req.body.check_out,
    guests: req.body.guests ?? 1,
    total_price: totalPrice,
  });

  notificationsService
    .notify({
      recipientId: hotel.owner_id,
      actorId: req.user.id,
      verb: "booking",
      targetType: "hotel_booking",
      targetId: booking.id,
      title: "New booking request",
      body: `You have a new booking request for ${hotel.name}.`,
    })
    .catch(() => {});

  return res.status(201).json({ success: true, data: booking });
});

export const getMyBookings = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const bookings = await hotelsService.listBookingsForUser(req.user.id);
  return res.status(200).json({ success: true, data: bookings });
});

export const getBooking = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");
  const booking = await hotelsService.getBookingById(id);
  if (!booking) throw new CustomError("Booking not found", 404);

  const hotel = await hotelsService.getById(booking.hotel_id);
  const isHotelOwner = hotel?.owner_id === req.user.id;
  if (booking.user_id !== req.user.id && !isHotelOwner && !req.user.roles.includes("admin")) {
    throw new CustomError("Forbidden", 403);
  }

  return res.status(200).json({ success: true, data: booking });
});

export const updateBooking = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const booking = await hotelsService.getBookingById(id);
  if (!booking) throw new CustomError("Booking not found", 404);

  const hotel = await hotelsService.getById(booking.hotel_id);
  assertOwnerOrAdmin(req.user.id, req.user.roles, hotel?.owner_id ?? "");

  const updated = await hotelsService.updateBooking(id, { status: req.body.status });
  return res.status(200).json({ success: true, data: updated });
});

export const cancelBooking = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const booking = await hotelsService.getBookingById(id);
  if (!booking) throw new CustomError("Booking not found", 404);
  if (booking.user_id !== req.user.id && !req.user.roles.includes("admin")) {
    throw new CustomError("Forbidden", 403);
  }

  const updated = await hotelsService.cancelBooking(id);
  return res.status(200).json({ success: true, data: updated });
});
