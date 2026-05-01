"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/primary-button";
import { signOut } from "@/lib/auth-actions";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    // signOut() ends in redirect("/") — control never returns on success
    // (NEXT_REDIRECT throw, intercepted by framework). The setLoading(false)
    // line below only fires if the action throws before redirecting.
    await signOut();
    setLoading(false);
  }

  return (
    <PrimaryButton type="button" onClick={handleClick} loading={loading}>
      Sign out
    </PrimaryButton>
  );
}
