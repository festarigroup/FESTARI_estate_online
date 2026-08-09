import { Router } from "express";
import { protect, restrictTo } from "#app/middlewares/auth.js";
import { validateSchema } from "#app/middlewares/validate.js";
import {
  createArtisanInquirySchema,
  createPropertyInquirySchema,
} from "#app/validators/inquiryValidators.js";
import {
  createPropertyInquiry,
  listPropertyInquiries,
  getPropertyInquiry,
  markPropertyInquiryRead,
  deletePropertyInquiry,
  createArtisanInquiry,
  listArtisanInquiries,
  getArtisanInquiry,
  markArtisanInquiryRead,
  deleteArtisanInquiry,
} from "#app/controllers/inquiriesController.js";

const router = Router();

router.post("/property-inquiries", validateSchema(createPropertyInquirySchema), createPropertyInquiry);
router.get("/property-inquiries", protect, listPropertyInquiries);
router.get("/property-inquiries/:id", protect, getPropertyInquiry);
router.put("/property-inquiries/:id/mark-read", protect, markPropertyInquiryRead);
router.delete("/property-inquiries/:id", protect, restrictTo("admin"), deletePropertyInquiry);

router.post("/artisan-inquiries", validateSchema(createArtisanInquirySchema), createArtisanInquiry);
router.get("/artisan-inquiries", protect, listArtisanInquiries);
router.get("/artisan-inquiries/:id", protect, getArtisanInquiry);
router.put("/artisan-inquiries/:id/mark-read", protect, markArtisanInquiryRead);
router.delete("/artisan-inquiries/:id", protect, restrictTo("admin"), deleteArtisanInquiry);

export default router;
