import { Router } from "express";
import { protect, restrictTo } from "#app/middlewares/auth.js";
import { validateSchema } from "#app/middlewares/validate.js";
import { createUploadMiddleware } from "#app/middlewares/uploadMedia.js";
import { createBookingSchema, createHotelSchema, updateHotelSchema } from "#app/validators/hotelValidators.js";
import {
  listHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  approveHotel,
  rejectHotel,
  uploadHotelImage,
  deleteHotelImage,
  listHotelBookings,
  createHotelBooking,
  getMyBookings,
  getBooking,
  updateBooking,
  cancelBooking,
} from "#app/controllers/hotelsController.js";

const router = Router();
const uploadHotelImageMiddleware = createUploadMiddleware({ fieldName: "image" });

router.get("/", listHotels);
router.get("/bookings/me", protect, getMyBookings);
router.get("/bookings/:id", protect, getBooking);
router.get("/:id", getHotel);

router.use(protect);

router.post("/", validateSchema(createHotelSchema), createHotel);
router.put("/:id", validateSchema(updateHotelSchema), updateHotel);
router.delete("/:id", deleteHotel);
router.put("/:id/approve", restrictTo("admin"), approveHotel);
router.put("/:id/reject", restrictTo("admin"), rejectHotel);
router.post("/:id/images", uploadHotelImageMiddleware, uploadHotelImage);
router.delete("/:id/images/:imageId", deleteHotelImage);

router.get("/:hotelId/bookings", listHotelBookings);
router.post("/:hotelId/bookings", validateSchema(createBookingSchema), createHotelBooking);
router.put("/bookings/:id", updateBooking);
router.delete("/bookings/:id", cancelBooking);

export default router;
