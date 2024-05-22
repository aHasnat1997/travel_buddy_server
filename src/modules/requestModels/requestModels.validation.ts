import { z } from "zod";

const StatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"])
});

export const RequestModelsValidation = {
  StatusSchema
}