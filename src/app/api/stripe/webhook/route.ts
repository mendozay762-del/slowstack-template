/**
 * Stripe webhook receiver.
 *
 * Verifies the signature against STRIPE_WEBHOOK_SECRET, then upserts
 * subscription rows into Supabase via the service-role client (bypasses
 * RLS by design — webhooks act on behalf of every user).
 *
 * Logs are prefixed [stripe-webhook] so they're easy to grep in Vercel.
 */

import Stripe from "stripe";
import { NextResponse, type NextRequest } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase-service-role";

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

if (!STRIPE_KEY || !WEBHOOK_SECRET) {
  throw new Error(
    "stripe-webhook: missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET",
  );
}

// Re-bind to typed string locals — TypeScript loses control-flow narrowing
// across the closure boundary into POST() below, even though the throw
// above proves both are non-null at runtime.
const stripeKey: string = STRIPE_KEY;
const webhookSecret: string = WEBHOOK_SECRET;

const stripe = new Stripe(stripeKey);

export async function POST(request: NextRequest) {
  // Raw body, NOT JSON — Stripe signs the unparsed bytes and re-parses
  // here would invalidate the signature.
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.log("[stripe-webhook] missing stripe-signature header");
    return NextResponse.json(
      { error: "missing signature" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.log("[stripe-webhook] signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  console.log("[stripe-webhook] event:", event.type, "id:", event.id);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        // Persistence happens on the customer.subscription.* events that
        // follow this one. This branch exists for visibility only.
        console.log(
          "[stripe-webhook] checkout.session.completed customer:",
          session.customer,
        );
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await persistSubscription(event.data.object, event.type);
        break;
      }
      default: {
        console.log("[stripe-webhook] unhandled event type:", event.type);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe-webhook] handler error:", err);
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
}

async function persistSubscription(
  sub: Stripe.Subscription,
  eventType: string,
) {
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  console.log(
    "[stripe-webhook] persistSubscription customer:",
    customerId,
    "subscription:",
    sub.id,
  );

  // Stripe customer → email → Supabase user.
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) {
    console.log("[stripe-webhook] customer is deleted, skipping");
    return;
  }
  const email = customer.email;
  if (!email) {
    console.log("[stripe-webhook] customer has no email, skipping");
    return;
  }

  const supabase = getServiceRoleClient();

  // No first-class email lookup in supabase-js admin — page through users
  // and filter. perPage:1000 covers small/medium projects; revisit if the
  // user count outgrows that.
  const { data: usersData, error: listError } =
    await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (listError) {
    console.error("[stripe-webhook] listUsers failed:", listError);
    throw listError;
  }
  const user = usersData.users.find((u) => u.email === email);
  if (!user) {
    console.log("[stripe-webhook] no Supabase user for email:", email);
    return;
  }
  console.log("[stripe-webhook] matched user:", user.id);

  // 'deleted' events come in with the original status (often 'active') —
  // overwrite to 'canceled' so the dashboard query treats the row as inactive.
  const status =
    eventType === "customer.subscription.deleted" ? "canceled" : sub.status;

  const item = sub.items.data[0];
  const priceId = item?.price?.id ?? null;
  const periodEndSeconds = item?.current_period_end;
  const periodEnd = periodEndSeconds
    ? new Date(periodEndSeconds * 1000).toISOString()
    : null;

  const { error: upsertError } = await supabase.from("subscriptions").upsert(
    {
      user_id: user.id,
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.id,
      status,
      price_id: priceId,
      current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );

  if (upsertError) {
    console.error("[stripe-webhook] upsert failed:", upsertError);
    throw upsertError;
  }

  console.log(
    "[stripe-webhook] upserted subscription:",
    sub.id,
    "user:",
    user.id,
    "status:",
    status,
  );
}
