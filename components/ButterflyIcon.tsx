export default function ButterflyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="10"
        cy="11"
        rx="8"
        ry="6"
        transform="rotate(-20 10 11)"
        fill="currentColor"
      />
      <ellipse
        cx="22"
        cy="11"
        rx="8"
        ry="6"
        transform="rotate(20 22 11)"
        fill="currentColor"
      />
      <ellipse
        cx="11"
        cy="21"
        rx="6"
        ry="4.5"
        transform="rotate(-15 11 21)"
        fill="currentColor"
        fillOpacity="0.85"
      />
      <ellipse
        cx="21"
        cy="21"
        rx="6"
        ry="4.5"
        transform="rotate(15 21 21)"
        fill="currentColor"
        fillOpacity="0.85"
      />
      <rect x="15" y="8" width="2" height="16" rx="1" fill="#3D3350" />
      <path
        d="M15 8 Q13 5 11 4"
        stroke="#3D3350"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M17 8 Q19 5 21 4"
        stroke="#3D3350"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
