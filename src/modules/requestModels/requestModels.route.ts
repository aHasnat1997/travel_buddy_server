import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import { RequestModelsController } from "./requestModels.controller";
import validateRequest from "../../middlewares/validateRequest";
import { RequestModelsValidation } from "./requestModels.validation";

const RequestModelsRoute = Router();

RequestModelsRoute.get(
  '/:tripId',
  authGuard(),
  RequestModelsController.tripRequests
)

RequestModelsRoute.put(
  '/:buddyId/respond',
  validateRequest(RequestModelsValidation.StatusSchema),
  authGuard(),
  RequestModelsController.updateReqStatus
)

export default RequestModelsRoute;