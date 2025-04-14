import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// replace with your actual values from Supabase
const supabaseUrl = SUPABASE_URL!;
const supabaseAnonKey = SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
