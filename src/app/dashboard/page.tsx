import { redirect } from "next/navigation";
import { Eyebrow } from "@/components/eyebrow";
import { SignOutButton } from "@/components/sign-out-button";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defensive: src/proxy.ts already gates /dashboard on missing user, but a
  // race (token revoked mid-request, proxy bypassed somehow) would land us
  // here with no user. Cheap insurance — bounce instead of crashing on
  // user.email below.
  if (!user) redirect("/sign-in");

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12 md:py-20">
      <div className="pb-10 text-center">
        <Eyebrow>Dashboard</Eyebrow>
        <h1
          className="
            mt-5 font-geist text-3xl font-semibold tracking-tight md:text-4xl
            pb-2
            bg-[linear-gradient(to_right,var(--grad-1),var(--grad-2),var(--grad-3),var(--grad-4),var(--grad-5))]
            bg-[length:200%_auto] bg-clip-text text-transparent
            animate-gradient-sweep
          "
        >
          Welcome back
        </h1>
      </div>

      <div className="space-y-6">
        <p className="text-center text-sm text-muted">
          Signed in as: {user.email}
        </p>
        <div className="flex justify-center">
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
