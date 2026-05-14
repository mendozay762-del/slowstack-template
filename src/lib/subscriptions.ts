/**
 * Server-only helpers for reading subscription state.
 *
 * Uses the cookie-bound server client (RLS applies) — even though the caller
 * already passes userId, going through RLS prevents accidental cross-user
 * reads if userId is ever forged or leaked.
 */

import { getSupabaseServerClient } from "@/lib/supabase-server";

export type ActiveSubscription = {
  id: string;
  user_id: string;
  status: string;
  price_id: string | null;
  current_period_end: string;
};

/**
 * Returns the user's active subscription or null.
 *
 * "Active" means BOTH:
 *   - status is 'active' or 'trialing' (Stripe says it's billing them)
 *   - current_period_end > now() (the paid window hasn't expired)
 *
 * 'past_due', 'canceled', 'incomplete', and any other status return null
 * here — the dashboard treats them as "not subscribed" and re-shows the
 * Subscribe button.
 */
export async function getActiveSubscription(
  userId: string,
): Promise<ActiveSubscription | null> {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("id, user_id, status, price_id, current_period_end")
    .eq("user_id", userId)
    .in("status", ["active", "trialing"])
    .gt("current_period_end", new Date().toISOString())
    .order("current_period_end", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[subscriptions] getActiveSubscription failed:", error);
    return null;
  }

  return data;
}
