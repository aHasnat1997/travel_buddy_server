import { Request, Response } from "express";
import handelAsyncReq from "../../utils/handelAsyncReq";
import { UserService } from "./users.service";
import successResponse from "../../utils/successResponse";
import { HTTPStatusCode } from "../../utils/httpCode";

/**
 * user registration
 */
const userRegistration = handelAsyncReq(async (req: Request, res: Response) => {
  const result = await UserService.userRegistration(req.body);
  successResponse(res, {
    message: 'User registered successfully',
    data: result
  }, HTTPStatusCode.Created)
});

/**
 * admin registration
 */
const adminRegistration = handelAsyncReq(async (req: Request, res: Response) => {
  const result = await UserService.adminRegistration(req.body);
  successResponse(res, {
    message: 'Admin registered successfully',
    data: result
  }, HTTPStatusCode.Created)
});

/**
 * user login
 */
const login = handelAsyncReq(async (req: Request, res: Response) => {
  const result = await UserService.login(req.body);
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true
  })
  successResponse(res, {
    message: 'User logged in successfully',
    data: result.data
  }, HTTPStatusCode.Ok)
});

/**
 * user logout
 */
const logout = handelAsyncReq(async (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  successResponse(res, {
    message: 'User logged out successfully',
    data: ''
  }, HTTPStatusCode.Ok)
});

/**
 * get user profile
 */
const getUserProfile = handelAsyncReq(async (req: Request, res: Response) => {
  const token = req.headers.authorization || '';
  const result = await UserService.getUserProfile(token);
  successResponse(res, {
    message: 'User profile retrieved successfully',
    data: result
  }, HTTPStatusCode.Ok)
});

/**
 * profile update
 */
const updateProfile = handelAsyncReq(async (req: Request, res: Response) => {
  const token = req.headers.authorization || '';
  const result = await UserService.updateProfile({ token, data: req.body });
  successResponse(res, {
    message: 'User profile updated successfully',
    data: result
  }, HTTPStatusCode.Ok)
});

export const UserController = {
  userRegistration,
  adminRegistration,
  login,
  logout,
  getUserProfile,
  updateProfile
};