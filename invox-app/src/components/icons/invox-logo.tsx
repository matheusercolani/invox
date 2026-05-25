export function InvoxLogo({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="invox-logo-grad" x1="4" y1="28" x2="30" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1a56ff" />
          <stop offset="1" stopColor="#00c8ff" />
        </linearGradient>
      </defs>
      {/* Circuit path: start node → right → up → right → arrowhead */}
      <path
        d="M6 26 L14 26 L14 16 L24 16 L24 10"
        stroke="url(#invox-logo-grad)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrowhead pointing up */}
      <path
        d="M20 6 L24 10 L28 6"
        stroke="url(#invox-logo-grad)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Circuit nodes at junctions */}
      <circle cx="6" cy="26" r="2.4" fill="url(#invox-logo-grad)" />
      <circle cx="14" cy="16" r="1.8" fill="url(#invox-logo-grad)" />
      <circle cx="24" cy="16" r="1.8" fill="url(#invox-logo-grad)" />
      <circle cx="24" cy="10" r="2.4" fill="url(#invox-logo-grad)" />
    </svg>
  );
}
