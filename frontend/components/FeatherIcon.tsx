interface FeatherIconProps {
  size?: number;
}

export default function FeatherIcon({ size = 64 }: FeatherIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-md"
    >
      <path
        d="M54 4 C54 4 20 18 12 44 L20 40 C20 40 18 52 16 58 C16 58 26 46 30 38 C30 38 38 36 44 28 C50 20 54 4 54 4Z"
        fill="#581c87"
        stroke="#1c1917"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M54 4 C40 12 28 28 16 58"
        stroke="#fbbf24"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 58 L18 48 M18 48 L14 50"
        stroke="#1c1917"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
