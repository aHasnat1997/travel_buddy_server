import { Request, Response } from "express";
import handelAsyncReq from "../../utils/handelAsyncReq";
import successResponse from "../../utils/successResponse";
import { HTTPStatusCode } from "../../utils/httpCode";
import { BookingService } from "./booking.service";

/**
 * book single trip
 */
const tripBookings = handelAsyncReq(async (req: Request, res: Response) => {
  const token = req.headers.authorization || '';
  const tripId = req.params.tripId;
  const bookingInfo = req.body;
  const result = await BookingService.bookTrip(token, tripId, bookingInfo);
  successResponse(res, {
    message: 'Travel buddy booking request successfully',
    data: result
  }, HTTPStatusCode.Created)
});

/**
 * validate trip booking
 */
const bookingsValidate = handelAsyncReq(async (req: Request, res: Response) => {
  const result = await BookingService.verifyPayment(req.query);
  successResponse(res, {
    message: 'Travel buddy payment validation',
    data: result
  }, HTTPStatusCode.Created)
});

/**
 * all request for single trip
 */
const tripRequests = handelAsyncReq(async (req: Request, res: Response) => {
  const tripId = req.params.tripId;
  const result = await BookingService.getSingleTripBooking(tripId);
  successResponse(res, {
    message: 'Potential travel buddies retrieved successfully',
    data: result
  }, HTTPStatusCode.Ok)
});

const updateReqStatus = handelAsyncReq(async (req: Request, res: Response) => {
  const result = await BookingService.updateBookingStatus(req.params.requestId, req.body.status);
  successResponse(res, {
    message: 'Travel buddy request responded successfully',
    data: result
  }, HTTPStatusCode.Ok)
});

export const BookingController = {
  tripBookings,
  bookingsValidate,
  tripRequests,
  updateReqStatus
}