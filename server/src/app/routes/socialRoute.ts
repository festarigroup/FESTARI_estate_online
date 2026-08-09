import { Router } from "express";
import { protect } from "#app/middlewares/auth.js";
import {
  getSuggestions,
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
} from "#app/controllers/socialController.js";

const router = Router();

router.use(protect);

router.get("/suggestions", getSuggestions);
router.post("/follow/:userId", followUser);
router.delete("/follow/:userId", unfollowUser);
router.get("/following", getFollowing);
router.get("/followers", getFollowers);

export default router;
