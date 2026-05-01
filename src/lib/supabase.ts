/**
 * Supabase browser client — lazily constructed.
 *
 * Uses createBrowserClient from @supabase/ssr (cookie-aware) so auth state
 * stays consistent with the server-side client in supabase-server.ts.
 * Module is import-side-effect free; the client is built on first call.
 */

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

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

  client = createBrowserClient(url, anonKey);
  return client;
}
