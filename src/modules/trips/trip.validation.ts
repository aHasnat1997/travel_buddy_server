import { z } from 'zod';

const TripSchema = z.object({
  tripTitle: z.string(),
  tripImage: z.array(z.string()),
  tripDetails: z.string(),
  startingPoint: z.string(),
  destination: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number(),
  activities: z.array(z.string()),
  totalSlots: z.number(),
});


export const TripValidation = { TripSchema };