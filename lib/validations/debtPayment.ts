import { z } from "zod";

export const logPaymentSchema = z.object({
  amount: z.number().positive("Enter a payment amount"),
  paidAt: z.string().min(1),
});

export type LogPaymentInput = z.infer<typeof logPaymentSchema>;
