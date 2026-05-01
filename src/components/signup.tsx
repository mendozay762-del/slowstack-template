"use client";

/**
 * Signup form section — UI only, no backend wiring yet (Phase 3).
 *
 * Submit flow: validate → loading 800ms → success message replaces form.
 */

import { useState, type FormEvent } from "react";
import { Eyebrow } from "@/components/eyebrow";
import { PrimaryButton } from "@/components/primary-button";
import { getSupabaseClient } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Signup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const cleaned = email.trim().toLowerCase();
    if (!EMAIL_RE.test(cleaned)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { error: dbError } = await supabase
        .from("signups")
        .insert({ email: cleaned });

      if (dbError) {
        // 23505 = Postgres unique_violation → email already exists
        if (dbError.code === "23505") {
          setError("You're already on the list.");
        } else {
          setError("Something went wrong. Try again.");
        }
        return;
      }

      setSubmitted(true);
    } catch {
      // Covers missing env vars or unexpected supabase-js throws.
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Header */}
          <div className="mx-auto max-w-3xl pb-10 text-center md:pb-12">
            <Eyebrow>Get notified</Eyebrow>
            <h2
              className="
                mt-5 font-geist text-3xl font-semibold tracking-tight md:text-4xl
                pb-2
                bg-[linear-gradient(to_right,var(--grad-1),var(--grad-2),var(--grad-3),var(--grad-4),var(--grad-5))]
                bg-[length:200%_auto] bg-clip-text text-transparent
                animate-gradient-sweep
              "
            >
              Be first when products launch
            </h2>
            <p className="mt-3 text-base text-muted">
              Real updates from the studio. No fluff, no spam, no unicorn promises.
            </p>
          </div>

          {/* Form / success — same max-width container so the swap doesn't reflow */}
          <div className="mx-auto max-w-[400px]">
            {submitted ? <SuccessMessage /> : null}
            {!submitted ? (
              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="signup-email"
                      className="mb-1.5 block text-sm font-medium text-foreground/80"
                    >
                      Email
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      disabled={loading}
                      required
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "signup-email-error" : undefined}
                      className="
                        block w-full rounded-lg
                        border border-foreground/15 bg-foreground/[0.04]
                        px-3.5 py-2.5
                        text-sm text-foreground placeholder:text-foreground/35
                        transition-colors
                        focus:border-accent focus:outline-none
                        disabled:opacity-60
                      "
                    />
                    {error && (
                      <p
                        id="signup-email-error"
                        role="alert"
                        className="mt-2 text-sm text-red-500"
                      >
                        {error}
                      </p>
                    )}
                  </div>

                  <PrimaryButton type="submit" loading={loading} className="w-full">
                    Notify me
                  </PrimaryButton>

                  <p className="text-center text-xs text-muted">
                    Unsubscribe anytime.
                  </p>
                </div>
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

// Shown in place of the form once the simulated submit resolves.
// `role="status" aria-live="polite"` lets screen readers announce it.
function SuccessMessage() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="
        rounded-lg border border-foreground/10 bg-foreground/[0.04]
        px-6 py-8 text-center
      "
    >
      <CheckIcon />
      <p className="mt-3 text-sm text-foreground">
        You&rsquo;re on the list. Check your inbox.
      </p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mx-auto h-7 w-7 text-accent"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.35" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  );
}
