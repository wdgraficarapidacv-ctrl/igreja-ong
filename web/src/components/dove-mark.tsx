export function DoveMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="48" fill="#0A0E16" stroke="#232B3E" strokeWidth="1" />
      <path d="M50 58C34 50 20 38 14 24C26 30 38 40 46 52Z" fill="#4FC7E8" />
      <path d="M50 58C62 46 78 38 88 26C80 44 66 56 54 62Z" fill="#4FC7E8" />
      <path d="M50 58C46 66 44 74 46 82C52 76 56 68 54 60Z" fill="#4FC7E8" />
      <circle cx="56" cy="52" r="5.5" fill="#4FC7E8" />
      <path d="M60 51 67 49 61 55Z" fill="#4FC7E8" />
    </svg>
  );
}
