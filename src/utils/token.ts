import jwt, { JwtPayload } from "jsonwebtoken";

const blackListedTokens: string[] = [];

export type TTokenPayload = {
  id: string,
  name: string,
  role: string
  iat?: number,
  exp?: number
}

/**
 * Sign a unique token to user
 * @param payload JwtPayload
 * @param secret secret string
 * @param expiresIn expires time
 * @returns token
 */
const sign = (payload: JwtPayload, secret: string, expiresIn: string): string => {
  const token = jwt.sign(payload, secret, { expiresIn })
  return token
};

/**
 * Verify user token
 * @param token token string
 * @param secret token sign secret
 * @returns Boolean
 */
const verify = (token: string, secret: string): string | jwt.JwtPayload | TTokenPayload => {
  const verify = jwt.verify(token, secret)
  return verify;
}

/**
 * Decode JwtPayload from token
 * @param token token string
 * @returns JwtPayload
 */
const decode = (token: string): string | jwt.JwtPayload | null | TTokenPayload => {
  const decode = jwt.decode(token);
  return decode;
}

/**
 * Blacklist token
 * @param token need to blacklist
 */
const blacklist = (token: string): void => {
  blackListedTokens.push(token);
  // console.log('blackListedTokens', blackListedTokens);
};

/**
 * Check token blacklisted or not 
 * @param token check token
 * @returns Boolean
 */
const isTokenBlacklisted = (token: string): boolean => {
  const isMatch = blackListedTokens.find(t => t === token);
  if (isMatch) return false;
  return true;
};

export const Token = { sign, verify, decode, blacklist, isTokenBlacklisted };