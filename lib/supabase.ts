import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

// Supabase and its Vercel integration have used several names for the same two
// settings. Each is written out in full so Next.js can inline the NEXT_PUBLIC_ ones.
const URLS = { NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL, SUPABASE_URL: process.env.SUPABASE_URL };
const KEYS = {
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
};
const first = (vars: Record<string, string | undefined>) => Object.values(vars).find((v) => v?.trim())?.trim();

export function supabaseSettings() {
  return { url: first(URLS), anonKey: first(KEYS) };
}

/** Which setting names are present (never their values), for the setup check. */
export function supabaseSettingNames(): string[] {
  return Object.entries({ ...URLS, ...KEYS })
    .filter(([, v]) => v?.trim())
    .map(([k]) => k);
}

// Created on first use rather than at import time, so `next build` doesn't
// need the Supabase environment variables to be set.
export function getSupabase(): SupabaseClient {
  if (!client) {
    const { url, anonKey } = supabaseSettings();
    if (!url || !anonKey) {
      throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    }
    client = createClient(url, anonKey);
  }
  return client;
}
