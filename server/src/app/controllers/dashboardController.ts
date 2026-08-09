import { Request, Response } from "express";
import dashboardService from "#app/services/dashboardService.js";
import { asyncErrorHandler } from "#app/utils/asyncErrorHandler.js";

export const getStats = asyncErrorHandler(async (_req: Request, res: Response) => {
  const stats = await dashboardService.getStats();
  return res.status(200).json({ success: true, data: stats });
});

export const getRecentActivity = asyncErrorHandler(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 20;
  const activity = await dashboardService.getRecentActivity(limit);
  return res.status(200).json({ success: true, data: activity });
});

export const getPendingApprovals = asyncErrorHandler(async (_req: Request, res: Response) => {
  const pending = await dashboardService.getPendingApprovals();
  return res.status(200).json({ success: true, data: pending });
});
