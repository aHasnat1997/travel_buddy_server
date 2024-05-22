import { Router } from "express";
import { TripController } from "./trip.controller";
import validateRequest from "../../middlewares/validateRequest";
import { TripValidation } from "./trip.validation";
import { authGuard } from "../../middlewares/authGuard";

const TripRouter = Router();

TripRouter.get('/', TripController.getAll);

TripRouter.post(
  '/',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  validateRequest(TripValidation.TripSchema),
  TripController.create
);

TripRouter.post(
  '/:tripId/request',
  authGuard('USER'),
  validateRequest(TripValidation.RequestTripSchema),
  TripController.tripRequest
);

export default TripRouter;
