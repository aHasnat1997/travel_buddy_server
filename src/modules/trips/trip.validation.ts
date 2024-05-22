import { z } from 'zod';

const TripSchema = z.object({
  tripDetails: z.string(),
  startingPoint: z.string(),
  destination: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number(),
  activities: z.array(z.string()),
  capacity: z.number()
});

const RequestTripSchema = z.object({
  userId: z.string()
})

export const TripValidation = {
  TripSchema,
  RequestTripSchema
}