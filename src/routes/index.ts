import { Router } from "express";
import UserRoute from "../modules/users/users.route";
import TripRouter from "../modules/trips/trip.route";
import RequestModelsRoute from "../modules/requestModels/requestModels.route";

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
  },
  {
    path: '/travel-buddies',
    router: RequestModelsRoute
  }
];


moduleRoutes.forEach(r => AllRoutes.use(r.path, r.router));