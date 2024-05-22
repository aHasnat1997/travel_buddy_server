import { NextFunction, Request, Response } from "express";
import { HTTPStatusCode } from "../utils/httpCode";

/**
 * handle all errors
 * @param error Error obj
 * @param req Request obj
 * @param res Response obj
 * @param next NextFunction 
 * @returns error response json
 */
export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(HTTPStatusCode.BadRequest).json({
    success: false,
    message: error.message || 'Error...',
    error: error
  })
};