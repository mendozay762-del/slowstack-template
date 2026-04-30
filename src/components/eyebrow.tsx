/**
 * Small label flanked by gradient-fade horizontal rules.
 * Shared across hero / benefits / future sections.
 */

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        inline-flex items-center gap-3
        before:content-[''] before:h-px before:w-8
        before:bg-gradient-to-r before:from-transparent before:to-rule
        after:content-[''] after:h-px after:w-8
        after:bg-gradient-to-l after:from-transparent after:to-rule
      "
    >
      <span
        className="
          text-xs font-medium uppercase tracking-[0.18em]
          bg-gradient-to-r from-accent to-accent/60
          bg-clip-text text-transparent
        "
      >
        {children}
      </span>
    </div>
  );
}
