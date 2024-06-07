import { z } from 'zod';

const TripSchema = z.object({
  tripTitle: z.string(),
  // tripImage: z.array(z.string()),
  tripDetails: z.string(),
  startingPoint: z.string(),
  destination: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number(),
  activities: z.array(z.string()),
  totalSlots: z.number(),
});

const UpdateSchema = z.object({
  tripTitle: z.string().optional(),
  tripImage: z.array(z.string()).optional(),
  tripDetails: z.string().optional(),
  startingPoint: z.string().optional(),
  destination: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().optional(),
  activities: z.array(z.string()).optional(),
  totalSlots: z.number().optional(),
});


export const TripValidation = { TripSchema, UpdateSchema };