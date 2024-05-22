import { RequestModelStatus } from "@prisma/client";
import prisma from "../../db";

/**
 * get single trip all request
 * @param token user access token
 * @param tripId trip id
 * @returns trip all request
 */
const getSingleTripReq = async (tripId: string) => {
  const result = await prisma.requestModels.findMany({
    where: {
      tripId
    },
    select: {
      id: true,
      tripId: true,
      userId: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      trip: true,
      user: true
    }
  });
  return result;
};

/**
 * update request trip status
 * @param buddyId RequestModels id
 * @param status "PENDING" | "APPROVED" | "REJECTED"
 * @returns update data
 */
const updateRequestStatus = async (buddyId: string, status: RequestModelStatus) => {
  const result = await prisma.requestModels.update({
    where: { id: buddyId },
    data: { status }
  });
  return result;
};

export const RequestModelsService = {
  getSingleTripReq,
  updateRequestStatus
};