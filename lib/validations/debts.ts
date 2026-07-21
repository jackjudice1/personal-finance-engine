import { z } from "zod";

export const debtFormSchema = z.object({
  type: z.enum(["credit_card", "student_loan", "auto_loan", "mortgage", "personal_loan", "other"]),
  label: z.string().min(1, "Give this debt a name"),
  balance: z.number().min(0, "Balance can't be negative"),
  interestRate: z.number().min(0).max(100),
  minimumPayment: z.number().min(0),
});

export type DebtFormInput = z.infer<typeof debtFormSchema>;
