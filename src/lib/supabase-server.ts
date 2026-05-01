/**
 * Supabase server client — request-scoped, cookie-aware.
 *
 * Constructed per call (not memoized) because each request has its own
 * cookie store. Use this in Server Components, Server Actions, and Route
 * Handlers; for browser code use getSupabaseClient() from ./supabase.
 *
 * The setAll catch handles the Server Component case where cookies can't
 * be written — auth refresh runs in middleware instead.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getSupabaseServerClient(): Promise<SupabaseClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components can't set cookies — middleware handles refresh.
        }
      },
    },
  });
}
