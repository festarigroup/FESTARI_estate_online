class CustomError extends Error {
  status: string;
  isOperational: boolean;
  statusCode: number;
  code: string | undefined;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;