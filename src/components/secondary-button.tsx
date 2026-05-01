/**
 * Secondary CTA — gradient-ringed ghost. Polymorphic: `href` → <a>,
 * otherwise <button> with optional loading state.
 *
 * Mirror of PrimaryButton's API surface. The gradient ring is drawn by a
 * masked ::before; children are wrapped in a positioned span so they paint
 * above the ring (otherwise the 1px border can clip text near the edges).
 */

type CommonProps = {
  children: React.ReactNode;
  className?: string;
};

type AnchorProps = CommonProps & {
  href: string;
};

type ButtonProps = CommonProps & {
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
};

const BASE = `
  relative inline-flex items-center justify-center
  rounded-lg px-5 py-2.5
  text-sm font-medium text-foreground whitespace-nowrap
  bg-foreground/[0.04]
  transition-colors hover:bg-foreground/[0.08]
  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
  disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-foreground/[0.04]

  before:content-[''] before:pointer-events-none
  before:absolute before:inset-0 before:rounded-[inherit] before:p-px
  before:[background:linear-gradient(to_right,var(--rule),var(--accent),var(--rule))]
  before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
  before:[mask-composite:exclude]
`;

export function SecondaryButton(props: AnchorProps | ButtonProps) {
  const className = `${BASE} ${props.className ?? ""}`;
  const isLoading = "loading" in props && props.loading;

  const content = (
    <span className="relative inline-flex items-center gap-1.5">
      {isLoading && <Spinner />}
      {props.children}
    </span>
  );

  if ("href" in props) {
    return (
      <a href={props.href} className={className}>
        {content}
      </a>
    );
  }

  const { type = "button", disabled, onClick } = props;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={className}
    >
      {content}
    </button>
  );
}

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
