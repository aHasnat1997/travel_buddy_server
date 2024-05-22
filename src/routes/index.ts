import { Router } from "express";
import UserRoute from "../modules/users/users.route";
import TripRouter from "../modules/trips/trip.route";

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
  },
  {
    path: '/trips',
    router: TripRouter
  }
];


moduleRoutes.forEach(r => AllRoutes.use(r.path, r.router));