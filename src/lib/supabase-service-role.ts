/**
 * Server-only Supabase client using the SERVICE ROLE key.
 *
 * ⚠️  SECURITY: this client BYPASSES Row-Level Security entirely. It must
 * NEVER be imported from a Client Component, a "use client" file, or any
 * code that could end up in the browser bundle. Use only inside route
 * handlers, server actions, or server components — and only when you
 * specifically need cross-user access (webhooks, admin tasks).
 *
 * For ordinary user-scoped reads/writes, use the cookie-bound client in
 * src/lib/supabase-server.ts so RLS gates everything.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL_RAW = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY_RAW = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Module-load env check — fail loudly at startup, not in some downstream
// request that hits a missing-key error halfway through.
if (!URL_RAW || !KEY_RAW) {
  throw new Error(
    "supabase-service-role: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
  );
}

// Re-bind to typed `string` locals — TypeScript loses control-flow narrowing
// across closure boundaries (the function below), even though the throw
// above proves both are non-null at runtime.
const url: string = URL_RAW;
const serviceKey: string = KEY_RAW;

/**
 * Returns a fresh service-role client. Intentionally NOT memoized — Next.js
 * can run server modules across request contexts, and reusing one client
 * has caused subtle request-bleed bugs (auth state, refetch caches).
 */
export function getServiceRoleClient(): SupabaseClient {
  return createClient(url, serviceKey, {
    auth: {
      // Service role has no user session — no refresh, no persistence.
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
