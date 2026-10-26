import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function IconStar({
  filled = true,
  ...props
}: IconProps & { filled?: boolean }) {
  return (
    <svg {...base} {...props} fill={filled ? "currentColor" : "none"}>
      <path d="M12 2.8l2.7 5.7 6.1.85-4.45 4.35 1.08 6.1L12 16.9l-5.43 2.9 1.08-6.1L3.2 9.35l6.1-.85L12 2.8z" />
    </svg>
  );
}

export function IconHeart({
  filled = true,
  ...props
}: IconProps & { filled?: boolean }) {
  return (
    <svg {...base} {...props} fill={filled ? "currentColor" : "none"}>
      <path d="M12 20.2s-7.4-4.4-8.8-9.1C2.1 7.2 4.5 4.4 7.5 4.4c2 0 3.5 1.1 4.5 2.6 1-1.5 2.5-2.6 4.5-2.6 3 0 5.4 2.8 4.3 6.7-1.4 4.7-8.8 9.1-8.8 9.1z" />
    </svg>
  );
}

export function IconClover({
  filled = true,
  ...props
}: IconProps & { filled?: boolean }) {
  return (
    <svg {...base} {...props} fill={filled ? "currentColor" : "none"}>
      <path d="M12 12c-3.2.4-5.2-1.4-5.2-3.5C6.8 6.6 8.3 5.2 10 5.2c1.8 0 2.9 1.4 3.2 3.1.3-1.7 1.4-3.1 3.2-3.1 1.7 0 3.2 1.4 3.2 3.3 0 2.1-2 3.9-5.2 3.5 3.2-.4 5.2 1.4 5.2 3.5 0 1.9-1.5 3.3-3.2 3.3-1.8 0-2.9-1.4-3.2-3.1-.3 1.7-1.4 3.1-3.2 3.1-1.7 0-3.2-1.4-3.2-3.3 0-2.1 2-3.9 5.2-3.5z" />
      <path d="M12 12c0 2.4-.3 5-2 7.5" stroke="currentColor" fill="none" />
    </svg>
  );
}

export function IconCoin({ ...props }: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle
        cx="12"
        cy="12"
        r="8.7"
        fill="currentColor"
        stroke="none"
        opacity="0.18"
      />
      <circle cx="12" cy="12" r="8.2" />
      <path
        d="M12 7.3l1.35 2.74 3.02.44-2.19 2.13.52 3.01L12 14.2l-2.7 1.42.52-3.01-2.19-2.13 3.02-.44L12 7.3z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function IconCup(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M4.2 10.2h12.4v4.9a5.2 5.2 0 01-5.2 5.2H9.4a5.2 5.2 0 01-5.2-5.2v-4.9z"
        fill="currentColor"
      />
      <path d="M16.6 11.4h1.7a2.6 2.6 0 010 5.2h-2.1" />
      <path d="M7.3 7.1c0-1.3 1.2-1.4 1.2-2.8M10.9 7.1c0-1.3 1.2-1.4 1.2-2.8M14.1 3.6l2.1 2.1M16.9 2.8l-1 1" />
    </svg>
  );
}

export function IconDice({ ...props }: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="4.2" />
      <circle cx="8.4" cy="8.4" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="15.6" cy="8.4" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="8.4" cy="15.6" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="15.6" cy="15.6" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconBag({ ...props }: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5.4 8.7h13.2l1.1 10.2a1.9 1.9 0 01-1.9 2.1H6.2a1.9 1.9 0 01-1.9-2.1L5.4 8.7z" />
      <path d="M8.6 9V7.2a3.4 3.4 0 016.8 0V9" />
      <path d="M9.2 13.2h5.6" />
    </svg>
  );
}

export function IconSoundOn(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.2 9.2h3l4-3.3v12.2l-4-3.3h-3z" fill="currentColor" />
      <path d="M15 8.7c1.8 1.6 1.8 4.9 0 6.6M17.8 5.8c3.2 3 3.2 9.4 0 12.4" />
    </svg>
  );
}

export function IconSoundOff(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.2 9.2h3l4-3.3v12.2l-4-3.3h-3z" fill="currentColor" />
      <path d="M15.5 9.5l5 5M20.5 9.5l-5 5" />
    </svg>
  );
}

export function IconHelp(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.2a2.6 2.6 0 114.2 2.1c-.95.7-1.7 1.2-1.7 2.5" />
      <circle cx="12" cy="17.4" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconRestart(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.4 10.2A8 8 0 1112 20" />
      <path d="M4.2 4.8v5.4h5.4" />
    </svg>
  );
}

export function IconArrow(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12h14.8M13.5 5.9l6.1 6.1-6.1 6.1" />
    </svg>
  );
}

export function IconX(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12.6l4.6 4.6L19.7 6.6" />
    </svg>
  );
}

export function IconSkull(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5.2 11.2a6.8 6.8 0 1113.6 0c0 2.3-1 3.3-2 4.1-.5.4-.8.9-.8 1.5v1.5c0 1-.8 1.7-1.7 1.7H9.7c-1 0-1.7-.8-1.7-1.7v-1.5c0-.6-.3-1.1-.8-1.5-1-.8-2-1.8-2-4.1z" />
      <circle cx="9.2" cy="11.3" r="1.35" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="11.3" r="1.35" fill="currentColor" stroke="none" />
      <path d="M10.5 15.2h3" />
    </svg>
  );
}

export function IconScroll(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 4.2h10.5v15.3H7z" />
      <path d="M4.5 19.5h3.7c.7 0 1.2-.5 1.2-1.2V5.4c0-.7-.5-1.2-1.2-1.2H5.7c-.7 0-1.2.5-1.2 1.2v14.1zM8.5 8h6M8.5 11.5h6M8.5 15h4" />
    </svg>
  );
}

export function IconShop(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9.5h16v10.2H4z" />
      <path d="M3.2 9.5l1.5-5.2h14.6l1.5 5.2a2.7 2.7 0 01-5.1.8 2.7 2.7 0 01-5 0 2.7 2.7 0 01-5-.8z" />
      <path d="M9.5 19.7v-5.2h5v5.2" />
    </svg>
  );
}

export function IconSparkle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M12 3.2l1.4 5.4 5.4 1.4-5.4 1.4L12 16.8l-1.4-5.4-5.4-1.4 5.4-1.4L12 3.2z"
        fill="currentColor"
      />
      <path
        d="M18.7 15.2l.7 2.5 2.5.7-2.5.7-.7 2.5-.7-2.5-2.5-.7 2.5-.7.7-2.5z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconPause(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8.5 5v14M15.5 5v14" strokeWidth="3.2" />
    </svg>
  );
}

export function IconSwordCup(props: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path
        d="M12 21h31v13a15 15 0 01-15 15h-1a15 15 0 01-15-15V21z"
        fill="currentColor"
        stroke="#241a14"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <path
        d="M43 24h5.5a6.5 6.5 0 010 13H43"
        stroke="#241a14"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M20 15c0-3 2.4-3 2.4-6M27.5 15c0-3 2.4-3 2.4-6M35 15c0-3 2.4-3 2.4-6"
        stroke="#241a14"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M40 8l10-5 4 4-5 10-4 1-1-4-4-1V8z"
        fill="#f7f0e3"
        stroke="#241a14"
        strokeWidth="2.6"
        strokeLinejoin="round"
        transform="translate(6 2) rotate(10 44 8)"
      />
    </svg>
  );
}
