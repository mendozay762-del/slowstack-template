"use client";

/**
 * Client boundary around next-themes' ThemeProvider.
 *
 * Why a separate file: the root layout is a Server Component and cannot
 * directly render a client-only context provider. By marking this file
 * "use client" and importing it from the layout, Next.js inserts the boundary
 * for us — everything inside (provider state, the rest of the tree) is
 * hydrated on the client.
 *
 * Configuration:
 *   attribute="class"   → adds class="dark" or class="light" to <html>
 *                         (matches our @custom-variant in globals.css)
 *   defaultTheme="system"→ first visit follows the OS setting
 *   enableSystem         → "system" stays a valid choice; theme tracks OS live
 *   disableTransitionOnChange → suppresses Tailwind transition utilities
 *                         during the class swap so colors flip instantly
 *                         instead of awkwardly animating mid-toggle
 */

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
