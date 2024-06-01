import { TripBookingstatus } from "@prisma/client";
import prisma from "../../db";

/**
 * get single trip all request
 * @param token user access token
 * @param tripId trip id
 * @returns trip all request
 */
const getSingleTripReq = async (tripId: string) => {
  const result = await prisma.tripBookings.findMany({
    where: {
      tripId
    },
    include: {
      trip: true,
      user: {
        include: {
          users: {
            select: {
              name: true,
              email: true,
            }
          }
        }
      }
    }
  });
  return result;
};

/**
 * update request trip status
 * @param requestId RequestModels id
 * @param status "PENDING" | "APPROVED" | "REJECTED"
 * @returns update data
 */
const updateRequestStatus = async (requestId: string, status: TripBookingstatus) => {
  const result = await prisma.tripBookings.update({
    where: { id: requestId },
    data: { status }
  });
  return result;
};

export const RequestModelsService = {
  getSingleTripReq,
  updateRequestStatus
};