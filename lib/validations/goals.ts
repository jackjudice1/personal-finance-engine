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
  targetAmount: z.number().min(1, "Set a target amount"),
  currentAmount: z.number().min(0),
  targetDate: z.string().nullable(),
  monthlyContribution: z.number().min(0),
  priority: z.number().min(1).max(5),
});

export type GoalFormInput = z.infer<typeof goalFormSchema>;
