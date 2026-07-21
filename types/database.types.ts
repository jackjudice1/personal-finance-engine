/**
 * Hand-written placeholder matching database/migrations/*.sql.
 *
 * Once a Supabase project exists and the migrations have been run against
 * it, regenerate this file for real:
 *
 *   npx supabase gen types typescript --project-id <ref> > types/database.types.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type IncomeFrequency = "weekly" | "biweekly" | "monthly" | "annually";
export type ExpenseCategory =
  | "housing"
  | "transportation"
  | "food"
  | "subscriptions"
  | "insurance"
  | "healthcare"
  | "entertainment"
  | "other";
export type AssetType = "savings" | "checking" | "investment" | "retirement" | "real_estate" | "other";
export type LiabilityType = "credit_card" | "student_loan" | "auto_loan" | "mortgage" | "personal_loan" | "other";
export type GoalType =
  | "debt_freedom"
  | "emergency_fund"
  | "home_purchase"
  | "car_purchase"
  | "vacation"
  | "retirement"
  | "invest_more"
  | "business"
  | "custom";
export type GoalStatus = "active" | "completed" | "paused";
export type RecommendationCategory = "debt" | "savings" | "investing" | "cash_flow" | "goal" | "general";
export type RecommendationSeverity = "info" | "suggested" | "urgent";
export type SimulationType = "can_i_afford_this" | "debt_vs_investing" | "what_if";
export type SubscriptionTier = "free" | "premium";
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "incomplete" | "none";
export type FinancialPersonality = "coach" | "analyst" | "minimal";
export type ThemePreference = "dark" | "light";
export type UserLevel = "beginner" | "saver" | "investor" | "wealth_builder" | "financial_master";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          onboarding_completed: boolean;
          onboarding_step: string;
          financial_personality: FinancialPersonality;
          theme: ThemePreference;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      income_sources: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          amount: number;
          frequency: IncomeFrequency;
          is_primary: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["income_sources"]["Row"]> & {
          user_id: string;
          label: string;
          amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["income_sources"]["Row"]>;
        Relationships: [];
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          category: ExpenseCategory;
          label: string | null;
          amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["expenses"]["Row"]> & {
          user_id: string;
          category: ExpenseCategory;
          amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["expenses"]["Row"]>;
        Relationships: [];
      };
      assets: {
        Row: {
          id: string;
          user_id: string;
          type: AssetType;
          label: string;
          balance: number;
          interest_rate: number | null;
          is_emergency_fund: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["assets"]["Row"]> & {
          user_id: string;
          type: AssetType;
          label: string;
        };
        Update: Partial<Database["public"]["Tables"]["assets"]["Row"]>;
        Relationships: [];
      };
      liabilities: {
        Row: {
          id: string;
          user_id: string;
          type: LiabilityType;
          label: string;
          balance: number;
          interest_rate: number;
          minimum_payment: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["liabilities"]["Row"]> & {
          user_id: string;
          type: LiabilityType;
          label: string;
        };
        Update: Partial<Database["public"]["Tables"]["liabilities"]["Row"]>;
        Relationships: [];
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          type: GoalType;
          title: string;
          target_amount: number;
          current_amount: number;
          target_date: string | null;
          monthly_contribution: number | null;
          priority: number;
          status: GoalStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["goals"]["Row"]> & {
          user_id: string;
          type: GoalType;
          title: string;
          target_amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["goals"]["Row"]>;
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          occurred_at: string;
          description: string | null;
          amount: number;
          category: ExpenseCategory | null;
          source: "manual" | "plaid";
          plaid_transaction_id: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["transactions"]["Row"]> & {
          user_id: string;
          amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["transactions"]["Row"]>;
        Relationships: [];
      };
      recommendations: {
        Row: {
          id: string;
          user_id: string;
          rule_id: string;
          category: RecommendationCategory;
          severity: RecommendationSeverity;
          title: string;
          description: string;
          impact_amount: number | null;
          related_goal_id: string | null;
          is_dismissed: boolean;
          generated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["recommendations"]["Row"]> & {
          user_id: string;
          rule_id: string;
          category: RecommendationCategory;
          title: string;
          description: string;
        };
        Update: Partial<Database["public"]["Tables"]["recommendations"]["Row"]>;
        Relationships: [];
      };
      simulations: {
        Row: {
          id: string;
          user_id: string;
          type: SimulationType;
          inputs: Json;
          outputs: Json;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["simulations"]["Row"]> & {
          user_id: string;
          type: SimulationType;
          inputs: Json;
          outputs: Json;
        };
        Update: Partial<Database["public"]["Tables"]["simulations"]["Row"]>;
        Relationships: [];
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_key: string;
          unlocked_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["achievements"]["Row"]> & {
          user_id: string;
          achievement_key: string;
        };
        Update: Partial<Database["public"]["Tables"]["achievements"]["Row"]>;
        Relationships: [];
      };
      user_levels: {
        Row: {
          user_id: string;
          current_level: UserLevel;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["user_levels"]["Row"]> & { user_id: string };
        Update: Partial<Database["public"]["Tables"]["user_levels"]["Row"]>;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          user_id: string;
          tier: SubscriptionTier;
          status: SubscriptionStatus;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          stripe_price_id: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]> & { user_id: string };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]>;
        Relationships: [];
      };
      net_worth_snapshots: {
        Row: {
          id: string;
          user_id: string;
          snapshot_date: string;
          total_assets: number;
          total_liabilities: number;
          net_worth: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["net_worth_snapshots"]["Row"]> & {
          user_id: string;
          total_assets: number;
          total_liabilities: number;
          net_worth: number;
        };
        Update: Partial<Database["public"]["Tables"]["net_worth_snapshots"]["Row"]>;
        Relationships: [];
      };
      health_score_snapshots: {
        Row: {
          id: string;
          user_id: string;
          snapshot_date: string;
          overall_score: number;
          cash_flow_score: number;
          debt_score: number;
          savings_score: number;
          investment_score: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["health_score_snapshots"]["Row"]> & {
          user_id: string;
          overall_score: number;
          cash_flow_score: number;
          debt_score: number;
          savings_score: number;
          investment_score: number;
        };
        Update: Partial<Database["public"]["Tables"]["health_score_snapshots"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_financial_profile: {
        Args: { p_user_id: string };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
