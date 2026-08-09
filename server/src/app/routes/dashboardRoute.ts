import { Router } from "express";
import { protect, restrictTo } from "#app/middlewares/auth.js";
import { getStats, getRecentActivity, getPendingApprovals } from "#app/controllers/dashboardController.js";

const router = Router();

router.use(protect, restrictTo("admin"));

router.get("/stats", getStats);
router.get("/recent-activity", getRecentActivity);
router.get("/pending-approvals", getPendingApprovals);

export default router;
