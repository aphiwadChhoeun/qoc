import type { CSSProperties } from "react";

const LAYOUTS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

interface DieProps {
  value: number;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  tone?: "paper" | "gold" | "ghost";
  style?: CSSProperties;
  label?: string;
}

export function Die({
  value,
  selected = false,
  onClick,
  size = "md",
  tone = "paper",
  style,
  label,
}: DieProps) {
  const pips = LAYOUTS[value] ?? [];
  const className = [
    "die",
    `die--${size}`,
    `die--${tone}`,
    selected ? "is-selected" : "",
    onClick ? "is-clickable" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <span className="die__face">
      {Array.from({ length: 9 }, (_, i) => (
        <span
          key={i}
          className={`die__cell ${pips.includes(i) ? "has-pip" : ""}`}
        />
      ))}
    </span>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={className}
        style={style}
        onClick={onClick}
        aria-pressed={selected}
        aria-label={
          label ??
          `Die showing ${value}${selected ? ", selected for reroll" : ""}`
        }
      >
        {content}
      </button>
    );
  }

  return (
    <span
      className={className}
      style={style}
      role="img"
      aria-label={label ?? `Die showing ${value}`}
    >
      {content}
    </span>
  );
}
