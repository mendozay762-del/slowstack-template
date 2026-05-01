import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Auth middleware: refreshes Supabase session cookies on every request
 * and gates protected routes.
 *
 * Add a path prefix here to protect it. startsWith match means /dashboard,
 * /dashboard/settings, /dashboard/anything all flow through one entry.
 */
const PROTECTED_PATHS = ["/dashboard"];

export async function proxy(request: NextRequest) {
  // Initial response — re-created inside setAll if cookies get mutated.
  let supabaseResponse = NextResponse.next({ request });

  /*
   * Per-request Supabase client. We build it inline here instead of reusing
   * src/lib/supabase-server.ts because the middleware context needs a cookies
   * adapter that can WRITE to the outgoing response — the next/headers
   * cookies() API used by getSupabaseServerClient is read-only in middleware.
   * Different context, different adapter, same underlying client.
   */
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Sync new cookies to BOTH the request (so any downstream Server
          // Component reads via cookies() see fresh state) AND the response
          // (so the browser stores them for the next request).
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  /*
   * getUser() validates the JWT against Supabase's servers (network round
   * trip). Use this — never getSession() — for auth gates: getSession()
   * trusts whatever the cookie says and can be spoofed by a malicious
   * client. getUser() is the security-grade check.
   *
   * IMPORTANT: don't put logic between createServerClient and getUser() —
   * the call also drives the token-refresh side effect through setAll above.
   */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Run on every request EXCEPT static assets and Next.js internals.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
