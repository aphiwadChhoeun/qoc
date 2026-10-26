import { ITEMS } from "../game/data";
import type { ItemId } from "../game/types";
import { IconCheck, IconStar } from "./Icons";

interface ItemCardProps {
  itemId: ItemId;
  variant?: "hand" | "draft" | "shop" | "reward" | "tile";
  selected?: boolean;
  onClick?: () => void;
  onUse?: () => void;
  disabled?: boolean;
  actionLabel?: string;
  showFlavour?: boolean;
}

export function ItemCard({
  itemId,
  variant = "hand",
  selected = false,
  onClick,
  onUse,
  disabled = false,
  actionLabel,
  showFlavour = false,
}: ItemCardProps) {
  const item = ITEMS[itemId];
  const interactive = Boolean(onClick);
  const className = [
    "item-card",
    `item-card--${variant}`,
    selected ? "is-selected" : "",
    interactive ? "is-clickable" : "",
    disabled ? "is-disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const body = (
    <>
      <span className="item-card__art">
        <img src={item.art} alt="" loading="lazy" />
        <span className="item-card__number">{item.number}</span>
      </span>
      <span className="item-card__content">
        <span className="item-card__name">{item.name}</span>
        <span className="item-card__effect">{item.effectText}</span>
        {showFlavour && (
          <span className="item-card__flavour">“{item.flavour}”</span>
        )}
      </span>
      {selected && (
        <span className="item-card__check" aria-hidden>
          <IconCheck />
        </span>
      )}
    </>
  );

  if (interactive) {
    return (
      <button
        type="button"
        className={className}
        onClick={onClick}
        disabled={disabled}
        aria-pressed={variant === "draft" ? selected : undefined}
      >
        {body}
      </button>
    );
  }

  return (
    <article className={className}>
      {body}
      {onUse && (
        <button
          type="button"
          className="item-card__use"
          onClick={onUse}
          disabled={disabled}
          aria-label={`Use ${item.name}`}
        >
          {actionLabel ?? "Use item"}
          <IconStar />
        </button>
      )}
    </article>
  );
}

export function EmptyItemSlot({ label = "Empty" }: { label?: string }) {
  return (
    <div className="item-card item-card--hand item-card--empty">
      <span className="item-card__empty-icon">+</span>
      <span className="item-card__empty-label">{label}</span>
    </div>
  );
}
