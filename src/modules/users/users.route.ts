import { Router } from "express";
import { UserController } from "./users.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { authGuard } from "../../middlewares/authGuard";

const UserRoute = Router();

/**
 * get all user route
 */
UserRoute.get(
  '/users',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  UserController.getAll
)

/**
 * user registration route
 */
UserRoute.post(
  '/user/register',
  validateRequest(UserValidation.UserSchema),
  UserController.userRegistration
);

/**
 * user registration route
 */
UserRoute.post(
  '/admin/register',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  validateRequest(UserValidation.UserSchema),
  UserController.adminRegistration
);

/**
 * user login route
 */
UserRoute.post(
  '/login',
  validateRequest(UserValidation.LoginSchema),
  UserController.login
);

/**
 * user logout route
 */
UserRoute.post(
  '/logout',
  UserController.logout
);

/**
 * user profile route
 */
UserRoute.get(
  '/profile',
  authGuard('ADMIN', 'SUPER_ADMIN', 'USER'),
  UserController.getUserProfile
);

/**
 * user profile update route 
 */
UserRoute.put(
  '/profile',
  validateRequest(UserValidation.updateUser),
  authGuard('ADMIN', 'SUPER_ADMIN', 'USER'),
  UserController.updateProfile
);

export default UserRoute;