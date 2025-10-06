import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Student {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  college_id?: string;
  game_preferences: string[];
  is_admin?: boolean;
  created_at: string;
  updated_at: string;
}
