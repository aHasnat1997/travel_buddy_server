import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import { BookingController } from "./booking.controller";
import validateRequest from "../../middlewares/validateRequest";
import { BookingValidation } from "./booking.validation";

const RequestModelsRoute = Router();

RequestModelsRoute.post(
  '/:tripId/request',
  authGuard('USER'),
  validateRequest(BookingValidation.BookingSchema),
  BookingController.tripBookings
);

RequestModelsRoute.get(
  '/ipn',
  BookingController.bookingsValidate
);

RequestModelsRoute.get(
  '/:tripId',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  BookingController.tripRequests
);

RequestModelsRoute.put(
  '/:requestId/respond',
  validateRequest(BookingValidation.StatusSchema),
  authGuard('ADMIN', 'SUPER_ADMIN'),
  BookingController.updateReqStatus
);

export default RequestModelsRoute;