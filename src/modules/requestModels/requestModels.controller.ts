import { Request, Response } from "express";
import handelAsyncReq from "../../utils/handelAsyncReq";
import successResponse from "../../utils/successResponse";
import { HTTPStatusCode } from "../../utils/httpCode";
import { RequestModelsService } from "./requestModels.service";

/**
 * all request for single trip
 */
const tripRequests = handelAsyncReq(async (req: Request, res: Response) => {
  const tripId = req.params.tripId;
  const result = await RequestModelsService.getSingleTripReq(tripId);
  successResponse(res, {
    message: 'Potential travel buddies retrieved successfully',
    data: result
  }, HTTPStatusCode.Ok)
});

const updateReqStatus = handelAsyncReq(async (req: Request, res: Response) => {
  const result = await RequestModelsService.updateRequestStatus(req.params.buddyId, req.body.status);
  successResponse(res, {
    message: 'Travel buddy request responded successfully',
    data: result
  }, HTTPStatusCode.Ok)
});

export const RequestModelsController = {
  tripRequests,
  updateReqStatus
}