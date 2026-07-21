import { z } from "zod";

export const stockHoldingFormSchema = z.object({
  ticker: z
    .string()
    .min(1, "Enter a ticker symbol")
    .max(10)
    .transform((v) => v.toUpperCase()),
  companyName: z.string().nullable(),
  shares: z.number().positive("Enter how many shares"),
  costBasisPerShare: z.number().min(0, "Enter what you paid per share"),
});

export type StockHoldingFormInput = z.infer<typeof stockHoldingFormSchema>;
