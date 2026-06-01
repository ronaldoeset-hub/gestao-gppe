"use client";

import { createBrowserClient } from "@supabase/ssr";
import { assertSupabaseConfig, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

export function createClient() {
  assertSupabaseConfig();

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
