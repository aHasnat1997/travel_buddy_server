import { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * handle all async function
 * @param fn Async Function
 * @returns Promise resolve or reject
 */
const handelAsyncReq = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next))
    .catch(error => next(error))
};

export default handelAsyncReq; 