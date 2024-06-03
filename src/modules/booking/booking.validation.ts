import { z } from "zod";

const BookingSchema = z.object({
  slotsForBook: z.number(),
  totalAmount: z.number()
})

const StatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"])
});

export const BookingValidation = {
  BookingSchema,
  StatusSchema
};