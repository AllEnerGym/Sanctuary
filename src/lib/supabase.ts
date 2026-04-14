import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Database Types ──────────────────────────────────────────────────────────

export interface DbProfile {
  id: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
}

export interface DbUserSettings {
  id: string;
  user_id: string;
  language: 'zh' | 'en';
  water_goal: number;
  stand_up_goal: number;
  work_start: string;
  work_end: string;
  sound_enabled: boolean;
  notifications_enabled: boolean;
  sedentary_reminder: boolean;
  water_reminder: boolean;
  updated_at: string;
}

export interface DbWaterLog {
  id: string;
  user_id: string;
  volume: number;
  label: string;
  subtitle: string;
  logged_at: string;
}

export interface DbStandUpLog {
  id: string;
  user_id: string;
  title: string;
  type: string;
  logged_at: string;
}
