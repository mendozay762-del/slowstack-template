import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

/* ---------------------------------------------------------------------------
 * Fonts
 *
 * next/font self-hosts Google Fonts (no runtime request to Google). Each call
 * declares a `variable` — a CSS custom property the font-family will be
 * written to on the <html> element. We use a `-loaded` suffix here so
 * globals.css can re-expose them under cleaner names (--font-inter,
 * --font-geist) without a recursive `var(--font-inter): var(--font-inter)`.
 *
 * Geist     — display / headline font (geometric, modern)
 * Inter     — body / prose font (highly legible at small sizes)
 * ------------------------------------------------------------------------- */
const geist = Geist({
  variable: "--font-geist-loaded",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter-loaded",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Slowstack — Ship small. Validate fast.",
  description:
    "A studio building small validated products in 30-day cycles. Real users, real revenue, no unicorn promises.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /*
     * suppressHydrationWarning is required when using next-themes with
     * `attribute="class"`: the library mutates the <html> class attribute
     * before React hydrates (so the user doesn't see a flash of the wrong
     * theme), which otherwise trips React's "server HTML doesn't match
     * client HTML" warning. Scoped to <html> it only silences this one
     * expected mismatch — descendants are still hydration-checked.
     */
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-inter">
        <ThemeProvider>
          {/* Floating theme toggle — fixed top-right, above all content.
              `z-50` keeps it above future modals / overlays. */}
          <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
            <ThemeToggle />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
