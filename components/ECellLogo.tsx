interface ECellLogoProps {
  className?: string;
}

/**
 * Shiv Nadar University E-Cell logo.
 *
 * Renders the brand asset from /public/ecell-logo.png (a 256px-optimized copy
 * of the official logo). To swap it, replace that file or update LOGO_SRC.
 */
const LOGO_SRC = "/ecell-logo.png";

export function ECellLogo({ className }: ECellLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt="Shiv Nadar University E-Cell"
      className={`object-contain ${className ?? ""}`}
    />
  );
}
