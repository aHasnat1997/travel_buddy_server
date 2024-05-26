import { Request, Response } from "express";
import handelAsyncReq from "../../utils/handelAsyncReq";
import { TripService } from "./trip.service";
import successResponse from "../../utils/successResponse";
import { HTTPStatusCode } from "../../utils/httpCode";
import { pick } from "../../utils/pickObjFromArray";

/**
 * create a trip
 */
const create = handelAsyncReq(async (req: Request, res: Response) => {
  const token = req.headers.authorization || '';
  const result = await TripService.create({ token, data: req.body });
  successResponse(res, {
    message: 'Trip created successfully',
    data: result
  }, HTTPStatusCode.Created)
});

/**
 * get all trips
 */
const getAll = handelAsyncReq(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['destination', 'startDate', 'endDate', 'budget', 'searchTerm']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await TripService.getAll(filters, options);
  successResponse(res, {
    message: 'Trips retrieved successfully',
    mete: result.meta,
    data: result.data
  }, HTTPStatusCode.Ok)
});

/**
 * request single trip
 */
const tripRequest = handelAsyncReq(async (req: Request, res: Response) => {
  const token = req.headers.authorization || '';
  const tripId = req.params.tripId;
  const result = await TripService.requestTrip({ token, tripId });
  successResponse(res, {
    message: 'Travel buddy request sent successfully',
    data: result
  }, HTTPStatusCode.Created)
});

export const TripController = {
  create,
  getAll,
  tripRequest
};