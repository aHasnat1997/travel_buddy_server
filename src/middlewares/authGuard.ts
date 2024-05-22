// import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { TTokenPayload, Token } from "../utils/token";
import config from "../config";

/**
 * Guard api route using user role
 * @param accessTo user role array
 * @returns void
 */
export const authGuard = (...accessTo: string[]) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization;
    if (!token) throw new Error('No token found...');

    const userTokenDecode = Token.verify(token, config.TOKEN.ACCESS_TOKEN_SECRET) as TTokenPayload;

    const isRoleMatched = accessTo.find(r => r === userTokenDecode.role);
    if (!isRoleMatched) throw new Error('Unauthorized...');

    req.user = userTokenDecode;

    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};