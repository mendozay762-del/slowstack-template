/**
 * Landing page — hero + benefits, more sections to come.
 *
 * Section skeleton convention reused across the template:
 *   `<section>` → `mx-auto max-w-6xl px-4 sm:px-6` → `py-12 md:py-20`
 */

import { Eyebrow } from "@/components/eyebrow";
import { PrimaryButton } from "@/components/primary-button";
import { Signup } from "@/components/signup";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col">
      <HeroBlobs />

      {/* ===== Hero ===== */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="py-12 md:py-20 text-center">
            <Eyebrow>Slowstack Studio</Eyebrow>

            {/*
             * Animated gradient headline.
             *
             *   font-geist                 → display font (load order: layout.tsx → @theme)
             *   text-4xl md:text-6xl       → responsive type scale
             *   tracking-tight             → -0.025em letter-spacing — denser feel
             *                                 for tight, "tech product" headlines
             *   pb-2                       → tiny bottom padding so descenders
             *                                 (the comma's tail) aren't clipped
             *                                 by bg-clip-text
             *   bg-[linear-gradient(...)]  → 5-stop horizontal gradient using
             *                                 our theme-aware --grad-* CSS vars,
             *                                 so the gradient itself flips with
             *                                 the dark/light toggle
             *   bg-[length:200%_auto]      → background is 2× as wide as the
             *                                 visible area; combined with the
             *                                 keyframe (shifts position 0→200%)
             *                                 this produces the sweep
             *   bg-clip-text text-transparent
             *                              → clips the background to the text
             *                                 glyphs and hides the foreground
             *                                 fill so the gradient shows through
             *   animate-gradient-sweep     → utility registered in globals.css
             */}
            <h1
              className="
                mx-auto max-w-4xl font-geist text-4xl font-semibold tracking-tight
                md:text-6xl pb-2 mt-5
                bg-[linear-gradient(to_right,var(--grad-1),var(--grad-2),var(--grad-3),var(--grad-4),var(--grad-5))]
                bg-[length:200%_auto] bg-clip-text text-transparent
                animate-gradient-sweep
              "
            >
              Ship small. Validate fast. Kill what doesn&rsquo;t work.
            </h1>

            {/* Subhead — `text-muted` reads our theme-aware --muted variable.
                Light mode: slate-800@70%. Dark mode: indigo-200@70%. */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
              A studio building small validated products in 30-day cycles.
              Real users, real revenue, no unicorn promises.
            </p>

            {/* CTA row.
                Mobile: stack with sm gap. Desktop: side-by-side, centered. */}
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <PrimaryButton href="#waitlist">Join the waitlist</PrimaryButton>
              <SecondaryButton href="#framework">Read the framework</SecondaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Benefits ===== */}
      <Benefits />

      {/* ===== Signup ===== */}
      <Signup />

      {/* ===== Footer ===== */}
      <Footer />
    </main>
  );
}

/* ---------------------------------------------------------------------------
 * <Benefits> — 3-up grid of benefit cards (no card chrome — items sit on the
 * page directly, like Cruip's features pattern).
 *
 * Heading reuses the same animated gradient as the hero h1, sized down to h2.
 * Grid: 1 col on mobile, 2 cols on sm, 3 cols on lg.
 * ------------------------------------------------------------------------- */

const BENEFITS = [
  {
    Icon: TargetIcon,
    title: "Validate before you build",
    body: "Pre-commit kill criteria. Real signal beats opinion every time.",
  },
  {
    Icon: CalendarIcon,
    title: "Ship in 30 days",
    body: "Each cycle has one job: get to a paying user or kill the idea.",
  },
  {
    Icon: ForwardIcon,
    title: "Kill without ego",
    body: "Bad ideas die fast. Good patterns carry forward to the next cycle.",
  },
] as const;

function Benefits() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-10 text-center md:pb-16">
            <Eyebrow>Why Slowstack</Eyebrow>
            <h2
              className="
                mt-5 font-geist text-3xl font-semibold tracking-tight md:text-4xl
                pb-2
                bg-[linear-gradient(to_right,var(--grad-1),var(--grad-2),var(--grad-3),var(--grad-4),var(--grad-5))]
                bg-[length:200%_auto] bg-clip-text text-transparent
                animate-gradient-sweep
              "
            >
              A studio system, not a one-shot bet
            </h2>
          </div>

          {/* Grid — 1 / 2 / 3 cols at sm/lg.
              max-w-sm centers single-col mobile layout; sm:max-w-none releases it. */}
          <div className="mx-auto grid max-w-sm gap-10 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {BENEFITS.map(({ Icon, title, body }) => (
              <article key={title}>
                {/* fill-accent → theme-aware indigo (indigo-600 light / indigo-500 dark) */}
                <Icon className="mb-3 fill-accent" />
                <h3 className="mb-1 font-geist text-base font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * Benefit icons — 24×24, two-tone (one path full opacity, one at 0.48).
 * Color comes from the parent's `fill-accent` so they follow the theme.
 * ------------------------------------------------------------------------- */

type IconProps = { className?: string };

// Bullseye → "Validate before you build"
function TargetIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {/* Outer ring */}
      <path
        fillOpacity=".48"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 17a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"
      />
      {/* Center dot */}
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// Calendar with highlighted day → "Ship in 30 days"
function CalendarIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {/* Calendar frame */}
      <path
        fillOpacity=".48"
        d="M19 4h-2V2h-2v2H9V2H7v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM5 20V10h14v10H5Z"
      />
      {/* Highlighted day */}
      <rect x="10" y="13" width="4" height="4" rx="0.5" />
    </svg>
  );
}

// Stacked chevrons → "Kill without ego" (forward motion, last cycle behind)
function ForwardIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {/* Trailing chevron */}
      <path fillOpacity=".48" d="M5 5v14l8-7-8-7Z" />
      {/* Leading chevron */}
      <path d="M11 5v14l8-7-8-7Z" />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
 * <SecondaryButton> — ghost button with a 1px gradient ring.
 *
 * The gradient ring is the trickiest CSS in this file. `border-image` doesn't
 * play nicely with `border-radius`, so we draw the ring with a pseudo-element
 * + mask-compositing instead:
 *
 *   1. A ::before pseudo absolutely fills the parent (`absolute inset-0`).
 *   2. `p-px` creates a 1px gap between its content-box and padding-box.
 *   3. The gradient is set as `background` and fills the padding-box (default
 *      `background-clip`).
 *   4. The mask declares two layers:
 *        a) linear-gradient(#fff 0 0) content-box  — paints the content-box
 *        b) linear-gradient(#fff 0 0)              — paints the padding-box
 *      With `mask-composite: exclude`, the visible area is everything in (b)
 *      that is NOT in (a) — i.e., the 1px ring between content and padding.
 *   5. `pointer-events-none` so the pseudo doesn't eat clicks.
 *   6. `rounded-[inherit]` so the ring follows the parent's border-radius.
 * ------------------------------------------------------------------------- */
function SecondaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="
        relative inline-flex items-center justify-center
        rounded-lg px-5 py-2.5
        text-sm font-medium text-foreground
        bg-foreground/[0.04]
        transition-colors hover:bg-foreground/[0.08]
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent

        before:content-[''] before:pointer-events-none
        before:absolute before:inset-0 before:rounded-[inherit] before:p-px
        before:[background:linear-gradient(to_right,var(--rule),var(--accent),var(--rule))]
        before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
        before:[mask-composite:exclude]
      "
    >
      {/* Wrapped in a positioned span so it paints AFTER the absolute
          ::before in the parent's stacking context — otherwise the ring
          can clip over text near the edges. */}
      <span className="relative">{children}</span>
    </a>
  );
}

/* ---------------------------------------------------------------------------
 * <HeroBlobs> — two large blurred circles for ambient color behind the hero.
 *
 *   pointer-events-none        → never blocks clicks
 *   absolute inset-0           → fills the parent <main>
 *   overflow-hidden            → blobs can extend beyond the section without
 *                                 spawning a horizontal scrollbar
 *   -z-10                      → stays behind hero content (which is z-auto)
 *   blur-3xl                   → 64px Gaussian blur for the soft glow look
 *   bg-(--blob-a) / bg-(--blob-b)
 *                              → theme-aware tints (lighter in light mode,
 *                                 a bit more saturated in dark mode)
 * ------------------------------------------------------------------------- */
function HeroBlobs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Top-center blob — sits above the headline, indigo tint */}
      <div
        className="
          absolute -top-40 left-1/2 -translate-x-1/2
          h-[520px] w-[520px] rounded-full blur-3xl
          bg-[var(--blob-a)]
        "
      />
      {/* Bottom-right blob — violet tint, anchored off the right edge */}
      <div
        className="
          absolute -bottom-32 -right-24
          h-[420px] w-[420px] rounded-full blur-3xl
          bg-[var(--blob-b)]
        "
      />
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * <Footer> — minimal, visually quiet. Sits below the signup CTA.
 *
 *   border-image gradient fade  → soft top divider that fades at the edges
 *                                  (a hard `border-t` would feel abrupt)
 *   text-muted everywhere       → keeps the footer from competing with the
 *                                  signup CTA above it
 * ------------------------------------------------------------------------- */
function Footer() {
  const links = ["Privacy", "Terms", "Contact"];

  return (
    <footer>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className="
            py-8 md:py-12
            border-t [border-image:linear-gradient(to_right,transparent,var(--rule),transparent)_1]
          "
        >
          {/* Brand + links — stacks on mobile, opposed on sm+ */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-geist text-base font-semibold text-foreground">
                Slowstack
              </div>
              <p className="mt-0.5 text-sm text-muted">
                Ship small. Validate fast.
              </p>
            </div>

            <ul className="flex gap-6 text-sm">
              {links.map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 text-xs text-muted">© 2026 Slowstack Studio</p>
        </div>
      </div>
    </footer>
  );
}
