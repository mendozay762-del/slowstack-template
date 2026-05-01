/**
 * Primary CTA button — indigo gradient fill, polymorphic.
 *
 * Pass `href` to render an <a>; pass `type`/`onClick` to render a <button>.
 * The form submit case uses `loading` to swap the chevron for a spinner
 * and auto-disable the button.
 */

type CommonProps = {
  children: React.ReactNode;
  className?: string;
};

type AnchorProps = CommonProps & {
  href: string;
};

type ButtonProps = CommonProps & {
  // No `href` field — its absence is the discriminant for the union below.
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
};

const BASE = `
  group inline-flex items-center justify-center gap-1.5
  rounded-lg px-5 py-2.5
  text-sm font-medium text-white whitespace-nowrap
  bg-gradient-to-t from-indigo-600 to-indigo-500
  shadow-[inset_0_1px_0_0_rgb(255_255_255/0.16)]
  transition-[background,transform] hover:from-indigo-700 hover:to-indigo-500
  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
  disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:from-indigo-600
`;

export function PrimaryButton(props: AnchorProps | ButtonProps) {
  // Indicator: spinner if loading, chevron otherwise.
  const indicator =
    "loading" in props && props.loading ? (
      <Spinner />
    ) : (
      <span
        aria-hidden="true"
        className="text-white/60 transition-transform group-hover:translate-x-0.5"
      >
        →
      </span>
    );

  const content = (
    <>
      {props.children}
      {indicator}
    </>
  );

  const className = `${BASE} ${props.className ?? ""}`;

  // After this guard, TS narrows `props` to ButtonProps.
  if ("href" in props) {
    return (
      <a href={props.href} className={className}>
        {content}
      </a>
    );
  }

  const { type = "button", disabled, loading, onClick } = props;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={className}
    >
      {content}
    </button>
  );
}

// Two-tone spinner: faint full ring + bright partial arc that rotates.
function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
