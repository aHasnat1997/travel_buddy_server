import { Prisma } from "@prisma/client";
import config from "../../config";
import prisma from "../../db";
import { TTokenPayload, Token } from "../../utils/token";
import { TTrip } from "../../types/trip.type";

/**
 * create single trip
 * @param payload user token and trip data
 * @returns created trip data
 */
const create = async (payload: { token: string, data: TTrip }) => {
  const { token, data } = payload;

  const isTokenMatch = Token.verify(token, config.TOKEN.ACCESS_TOKEN_SECRET) as TTokenPayload;
  if (!isTokenMatch) throw new Error('id not found');

  const tripData = {
    userId: isTokenMatch.id,
    tripTitle: data.tripTitle,
    tripImage: [],
    tripDetails: data.tripDetails,
    startingPoint: data.startingPoint,
    destination: data.destination,
    startDate: data.startDate,
    endDate: data.endDate,
    budget: data.budget,
    activities: data.activities,
    totalBooked: data.totalBooked,
    totalSlots: data.totalSlots,
  }

  const result = await prisma.trips.create({
    data: tripData
  });

  return result;
};

/**
 * Finding all trip data from DB
 * @param filters object contents with any fields for filtering and searchTerm for 'destination' or 'budget' or 'startDate' or 'endDate' fields  
 * @param options object contents page, limit, sortBy and sortOrder values
 * @returns all trip data
 */
const getAll = async (
  filters: Record<string, unknown>,
  options: {
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: 'desc' | 'asc' | string
  }
) => {
  const conditions: Prisma.TripsWhereInput[] = [];
  const searchTermKeyArray = ['tripTitle', 'destination', 'startDate', 'endDate'];
  const { searchTerm, budget, minBudget, maxBudget, ...restFilters } = filters;

  const pageLimit = Number(options.limit) || 10;
  const pageNumber = Number(options.page) ? (Number(options.page) - 1) * pageLimit : 0;

  if (searchTerm) {
    conditions.push({
      OR: searchTermKeyArray.map(key => ({
        [key]: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      }))
    });
  };
  if (budget) {
    conditions.push({
      budget: {
        equals: Number(budget)
      }
    })
  }
  if (minBudget) {
    conditions.push({
      budget: {
        gte: Number(minBudget)
      }
    })
  }
  if (maxBudget) {
    conditions.push({
      budget: {
        lte: Number(maxBudget)
      }
    })
  }
  if (Object.keys(restFilters).length > 0) {
    conditions.push({
      AND: Object.keys(filters).map(key => ({
        [key]: {
          contains: filters[key],
          mode: 'insensitive'
        }
      }))
    });
  };

  const result = await prisma.trips.findMany({
    take: pageLimit,
    skip: pageNumber,
    orderBy: options.sortBy && options.sortOrder ? {
      [options.sortBy]: options.sortOrder
    } : {
      createdAt: 'desc'
    },
    where: { AND: conditions },
    include: {
      creator: {
        select: {
          id: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      },
      tripBookings: true
    }
  });
  const totalData = await prisma.trips.count({ where: { AND: conditions } })

  return {
    meta: {
      page: options.page ? (pageNumber / pageLimit) + 1 : 1,
      limit: pageLimit,
      total: totalData
    },
    data: result
  };
};

/**
 * find single trip by id
 * @param tripId single trip id
 * @returns trip full details
 */
const singleTrip = async (tripId: string) => {
  const result = await prisma.trips.findUniqueOrThrow({
    where: { id: tripId },
    select: {
      id: true,
      tripTitle: true,
      tripImage: true,
      tripDetails: true,
      startingPoint: true,
      destination: true,
      startDate: true,
      endDate: true,
      budget: true,
      activities: true,
      totalBooked: true,
      totalSlots: true,
      createdAt: true,
      updatedAt: true,
      creator: {
        select: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      },
      tripBookings: true
    }
  });

  return result
}

/**
 * Update singe data
 * @param payload tripId and update data
 * @returns trip updated data
 */
const updateTrip = async (payload: { tripId: string, data: Partial<TTrip> }) => {
  const { tripId, data } = payload;

  const updatedData = await prisma.trips.update({
    where: { id: tripId },
    data
  });

  return updatedData
}

export const TripService = {
  create,
  getAll,
  singleTrip,
  updateTrip
};
