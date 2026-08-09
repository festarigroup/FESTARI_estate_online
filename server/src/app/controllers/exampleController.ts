import { asyncErrorHandler } from "#app/utils/asyncErrorHandler.js"
import type { Request, Response } from "express"

export const exampleGetController = asyncErrorHandler(
    async (req: Request, res: Response) => {
        return res.status(200).json({status: "success", data: "correct"})
    }
)