import { Router } from "express";
import { protect, restrictTo } from "#app/middlewares/auth.js";
import { validateSchema } from "#app/middlewares/validate.js";
import {
  createArtisanProfileSchema,
  createReviewSchema,
  hireArtisanSchema,
  updateArtisanProfileSchema,
  updateHireRequestStatusSchema,
} from "#app/validators/artisanValidators.js";
import {
  listArtisans,
  getTopArtisans,
  getArtisan,
  createArtisanProfile,
  updateArtisanProfile,
  deleteArtisanProfile,
  approveArtisan,
  rejectArtisan,
  hireArtisan,
  getMyHireRequests,
  getArtisanHireRequests,
  updateHireRequestStatus,
  createReview,
} from "#app/controllers/artisansController.js";

const router = Router();

router.get("/top", getTopArtisans);
router.get("/", listArtisans);
router.get("/hire-requests/me", protect, getMyHireRequests);
router.get("/:id", getArtisan);

router.use(protect);

router.post("/", validateSchema(createArtisanProfileSchema), createArtisanProfile);
router.put("/:id", validateSchema(updateArtisanProfileSchema), updateArtisanProfile);
router.delete("/:id", deleteArtisanProfile);
router.put("/:id/approve", restrictTo("admin"), approveArtisan);
router.put("/:id/reject", restrictTo("admin"), rejectArtisan);
router.post("/:id/hire", validateSchema(hireArtisanSchema), hireArtisan);
router.get("/:id/hire-requests", getArtisanHireRequests);
router.put("/hire-requests/:id", validateSchema(updateHireRequestStatusSchema), updateHireRequestStatus);
router.post("/:id/reviews", validateSchema(createReviewSchema), createReview);

export default router;
