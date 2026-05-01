"use server";
// runs on server — these actions read/write Supabase auth cookies via
// getSupabaseServerClient(). Importable from client components; Next.js
// turns calls into POST RPCs.

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function signUpWithPassword(email: string, password: string) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) return { error: error.message };
  return { success: true as const };
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) return { error: error.message };
  // redirect() throws NEXT_REDIRECT — client never reaches code after the
  // await on the success path; framework intercepts and navigates.
  redirect("/dashboard");
}

export async function signInWithMagicLink(email: string) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
  });
  if (error) return { error: error.message };
  return { success: true as const, message: "Check your email" };
}

export async function signOut() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
