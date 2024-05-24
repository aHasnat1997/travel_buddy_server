import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import { RequestModelsController } from "./requestModels.controller";
import validateRequest from "../../middlewares/validateRequest";
import { RequestModelsValidation } from "./requestModels.validation";

const RequestModelsRoute = Router();

RequestModelsRoute.get(
  '/:tripId',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  RequestModelsController.tripRequests
)

RequestModelsRoute.put(
  '/:requestId/respond',
  validateRequest(RequestModelsValidation.StatusSchema),
  authGuard('ADMIN', 'SUPER_ADMIN'),
  RequestModelsController.updateReqStatus
)

export default RequestModelsRoute;