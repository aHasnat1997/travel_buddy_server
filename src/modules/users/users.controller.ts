import { Request, Response } from "express";
import handelAsyncReq from "../../utils/handelAsyncReq";
import { UserService } from "./users.service";
import successResponse from "../../utils/successResponse";
import { HTTPStatusCode } from "../../utils/httpCode";
import { pick } from "../../utils/pickObjFromArray";

/**
 * user registration
 */
const userRegistration = handelAsyncReq(async (req: Request, res: Response) => {
  const userData = {
    role: 'USER',
    ...req.body,
  };

  const result = await UserService.registration(userData);
  successResponse(res, {
    message: 'User registered successfully',
    data: result
  }, HTTPStatusCode.Created)
});

/**
 * admin registration
 */
const adminRegistration = handelAsyncReq(async (req: Request, res: Response) => {
  const userData = {
    role: 'ADMIN',
    ...req.body,
  };
  const result = await UserService.registration(userData);
  successResponse(res, {
    message: 'Admin registered successfully',
    data: result
  }, HTTPStatusCode.Created)
});

/**
 * get all users
 */
const getAll = handelAsyncReq(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['name', 'email', 'role']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await UserService.getAllUser(filters, options);
  successResponse(res, {
    message: 'Users retrieved successfully',
    mete: result.meta,
    data: result.data
  }, HTTPStatusCode.Ok)
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
  getAll,
  login,
  logout,
  getUserProfile,
  updateProfile
};