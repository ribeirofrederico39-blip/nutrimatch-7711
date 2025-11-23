import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: string;
  activity_level: string;
  goal: string;
  budget: string;
  restrictions: string;
  is_premium: boolean;
  plans_generated_this_month: number;
  ai_consultations_this_month: number;
  created_at: string;
  updated_at: string;
};

export type MealPlan = {
  id: string;
  profile_id: string;
  calories: number;
  total_cost: number;
  budget_type: string;
  meals: any;
  created_at: string;
};

export type WeeklyRoutine = {
  id: string;
  profile_id: string;
  week_start: string;
  routine: any;
  created_at: string;
};

export type ShoppingList = {
  id: string;
  profile_id: string;
  items: any;
  total_cost: number;
  created_at: string;
};

export type Reminder = {
  id: string;
  profile_id: string;
  type: string;
  message: string;
  time: string;
  days_of_week: string[];
  is_active: boolean;
  created_at: string;
};
