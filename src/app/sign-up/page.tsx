"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Eyebrow } from "@/components/eyebrow";
import { PrimaryButton } from "@/components/primary-button";
import { SecondaryButton } from "@/components/secondary-button";
import { signInWithMagicLink, signUpWithPassword } from "@/lib/auth-actions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INPUT_CLASSES =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_RE.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const result = await signUpWithPassword(cleanEmail, password);
    setLoading(false);

    if (result.error) setError(result.error);
    else if (result.success)
      setSuccess("Check your email to confirm your account.");
  }

  async function handleMagicLink() {
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_RE.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setMagicLoading(true);
    const result = await signInWithMagicLink(cleanEmail);
    setMagicLoading(false);

    if (result.error) setError(result.error);
    else if (result.success) setSuccess(result.message);
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12 md:py-20">
      <div className="pb-10 text-center">
        <Eyebrow>Create account</Eyebrow>
        <h1
          className="
            mt-5 font-geist text-3xl font-semibold tracking-tight md:text-4xl
            pb-2
            bg-[linear-gradient(to_right,var(--grad-1),var(--grad-2),var(--grad-3),var(--grad-4),var(--grad-5))]
            bg-[length:200%_auto] bg-clip-text text-transparent
            animate-gradient-sweep
          "
        >
          Sign up for slowstack
        </h1>
      </div>

      {success ? (
        <SuccessCard message={success} />
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-foreground/80"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading || magicLoading}
                required
                className={INPUT_CLASSES}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-foreground/80"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="at least 6 characters"
                disabled={loading || magicLoading}
                required
                className={INPUT_CLASSES}
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-500">
                {error}
              </p>
            )}

            <PrimaryButton
              type="submit"
              loading={loading}
              disabled={magicLoading}
              className="w-full"
            >
              Sign up
            </PrimaryButton>

            <Divider />

            <SecondaryButton
              type="button"
              onClick={handleMagicLink}
              loading={magicLoading}
              disabled={loading}
              className="w-full"
            >
              Send magic link instead
            </SecondaryButton>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </>
      )}
    </main>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 text-xs text-muted">
      <div className="h-px flex-1 bg-foreground/10" />
      <span>or</span>
      <div className="h-px flex-1 bg-foreground/10" />
    </div>
  );
}

function SuccessCard({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-lg border border-border bg-foreground/[0.04] px-6 py-8 text-center"
    >
      <CheckIcon />
      <p className="mt-3 text-sm text-foreground">{message}</p>
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
