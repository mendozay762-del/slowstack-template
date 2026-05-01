/**
 * Supabase browser client — lazily constructed.
 *
 * Importing this module is side-effect free. The actual client is created
 * on first call to `getSupabaseClient()`, which keeps `createClient` out of
 * the static prerender path (where env vars aren't reliably available).
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  client = createClient(url, anonKey);
  return client;
}
