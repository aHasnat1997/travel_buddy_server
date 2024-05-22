import { Router } from "express";
import UserRoute from "../modules/users/users.route";

/**
 * creating router using express router
 */
export const AllRoutes = Router();

/**
 * type of all module routes
 */
type TModulesRouters = {
  path: string,
  router: Router
}

/**
 * all module routes array 
 */
const moduleRoutes: TModulesRouters[] = [
  {
    path: '/auth',
    router: UserRoute
  }
];


moduleRoutes.forEach(r => AllRoutes.use(r.path, r.router));