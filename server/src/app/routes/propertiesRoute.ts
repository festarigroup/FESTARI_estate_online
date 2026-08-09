import { Router } from "express";
import { protect, restrictTo } from "#app/middlewares/auth.js";
import { validateSchema } from "#app/middlewares/validate.js";
import { createUploadMiddleware } from "#app/middlewares/uploadMedia.js";
import { createPropertySchema, updatePropertySchema } from "#app/validators/propertyValidators.js";
import {
  listProperties,
  getCategories,
  getTrending,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  approveProperty,
  rejectProperty,
  uploadPropertyImage,
  deletePropertyImage,
} from "#app/controllers/propertiesController.js";

const router = Router();
const uploadPropertyImageMiddleware = createUploadMiddleware({ fieldName: "image" });

router.get("/categories", getCategories);
router.get("/trending", getTrending);
router.get("/wishlist", protect, getWishlist);
router.get("/", listProperties);
router.get("/:id", getProperty);

router.use(protect);

router.post("/", validateSchema(createPropertySchema), createProperty);
router.put("/:id", validateSchema(updatePropertySchema), updateProperty);
router.delete("/:id", deleteProperty);
router.put("/:id/approve", restrictTo("admin"), approveProperty);
router.put("/:id/reject", restrictTo("admin"), rejectProperty);
router.post("/:id/images", uploadPropertyImageMiddleware, uploadPropertyImage);
router.delete("/:id/images/:imageId", deletePropertyImage);
router.post("/:id/wishlist", addToWishlist);
router.delete("/:id/wishlist", removeFromWishlist);

export default router;
