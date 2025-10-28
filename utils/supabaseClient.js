import { createClient } from "@supabase/supabase-js";

// Load keys from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Safety check
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables.");
}

// Initialize client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
