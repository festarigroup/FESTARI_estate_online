import type { Request, Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";

const devErrors = (res: Response, error: any) => {
  res.status(error.statusCode).json({
    success: false,
    error: {
      code: error.code ?? error.status?.toString().toUpperCase() ?? "ERROR",
      message: error.message,
      stackTrace: error.stack,
    },
  });
};

const prodErrors = (res: Response, error: any) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code ?? error.status?.toString().toUpperCase() ?? "ERROR",
        message: error.message,
      },
    });
  } else {
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong, please try again later.",
      },
    });
  }
};

const uniqueViolationError = (error: any) => {
  let msg = error.detail;
  const matches = [...msg.matchAll(/\((.*?)\)/g)].map((m) => m[1]);
  msg = `${matches[0]} with value ${matches[1]} already exists`;
  return new CustomError(msg, 409);
};

const tokenExpiredError = () => {
  const msg = "Please login to continue";
  return new CustomError(msg, 401);
};

export const routeNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server`,
    404,
    "NOT_FOUND"
  );
  next(err);
};

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (error.code == 23505) error = uniqueViolationError(error);
  if (error.name == "TokenExpiredError") error = tokenExpiredError();

  if (process.env.NODE_ENV == "production") {
    prodErrors(res, error);
  } else{
    console.log(error)
    devErrors(res, error);
  }
};
9;
export default globalErrorHandler;