"use client";

/**
 * Theme toggle — cycles light → dark → system.
 *
 * Hydration: next-themes can't read localStorage on the server, so the saved
 * theme is unknown on the first render. To avoid SSR/client mismatches on
 * theme-dependent attributes (aria-label, title, icon), we render a neutral
 * placeholder until `mounted` flips true on the client.
 */

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type ThemeName = "light" | "dark" | "system";

const NEXT_THEME: Record<ThemeName, ThemeName> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const BUTTON_CLASSES = `
  inline-flex h-9 w-9 items-center justify-center rounded-lg
  text-foreground/70 hover:text-foreground
  hover:bg-foreground/5
  transition-colors
  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
`;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // The mounted-flag hydration pattern is the canonical next-themes workaround
  // for SSR/client mismatches; the lint rule's "no setState in effect" doesn't
  // apply here — we *want* exactly one render after hydration.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Pre-mount: neutral placeholder, identical on server and first client pass.
  // Same dimensions as the real button so layout doesn't shift after hydration.
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        title="Toggle theme"
        className={BUTTON_CLASSES}
      >
        <span className="block h-5 w-5" aria-hidden="true" />
      </button>
    );
  }

  const current = (theme ?? "system") as ThemeName;
  const label = `Theme: ${current}. Click to switch.`;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(NEXT_THEME[current])}
      className={BUTTON_CLASSES}
    >
      {current === "light" ? (
        <SunIcon />
      ) : current === "dark" ? (
        <MoonIcon />
      ) : (
        <MonitorIcon />
      )}
    </button>
  );
}

/* Inline icons. 20×20, currentColor stroke. */

function SunIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}
