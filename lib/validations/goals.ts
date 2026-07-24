import { z } from "zod";

export const goalFormSchema = z.object({
  type: z.enum([
    "debt_freedom",
    "emergency_fund",
    "home_purchase",
    "car_purchase",
    "vacation",
    "retirement",
    "invest_more",
    "business",
    "custom",
  ]),
  title: z.string().min(1, "Give this goal a name"),
  targetAmount: z.number().min(1, "Set a target amount").max(999_999_999.99, "Target amount is too large"),
  currentAmount: z.number().min(0, "Current amount can't be negative").max(999_999_999.99, "Current amount is too large"),
  targetDate: z.string().nullable(),
  monthlyContribution: z
    .number()
    .min(0, "Monthly contribution can't be negative")
    .max(9_999_999.99, "Monthly contribution is too large"),
  priority: z.number().min(1).max(5),
});

export type GoalFormInput = z.infer<typeof goalFormSchema>;
