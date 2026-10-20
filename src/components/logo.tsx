// Para usar um arquivo próprio, substitua /public/logo.svg e troque USE_LOGO_FILE para true.
const USE_LOGO_FILE = false;

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="mc-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366F1" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#mc-grad)" />
      <path
        d="M10 28V12.5l10 9.5 10-9.5V28"
        fill="none"
        stroke="#fff"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="12.5" r="2.2" fill="#22D3EE" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  if (USE_LOGO_FILE) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src="/logo.svg" alt="MayaCorp" className={`h-8 w-auto ${className}`} width={168} height={40} />;
  }
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="font-display text-lg font-bold tracking-tight text-ink">
        Maya<span className="text-gradient">Corp</span>
      </span>
    </span>
  );
}
