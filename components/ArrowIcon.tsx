interface ArrowIconProps {
  className?: string;
}

/**
 * The arrow geometry extracted from the E-Cell logo, as a standalone icon.
 *
 * Points LEFT by default — use as-is for "Back" buttons. Add `rotate-180`
 * (e.g. `className="h-4 w-4 rotate-180"`) to point right for "Read full story"
 * links. Uses `currentColor`, so it inherits the text color of its parent.
 */
export function ArrowIcon({ className }: ArrowIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Solid arrow head */}
      <path d="M3 12 L11.5 6 L11.5 18 Z" fill="currentColor" />
      {/* Shaft */}
      <path
        d="M10 12 H21"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
