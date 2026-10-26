import { useState } from "react";
import { ITEMS } from "../game/data";
import type { ItemId } from "../game/types";
import { ItemCard } from "./ItemCard";
import {
  IconArrow,
  IconBag,
  IconClover,
  IconCoin,
  IconDice,
  IconHeart,
} from "./Icons";

interface DraftScreenProps {
  options: ItemId[];
  onKeep: (item: ItemId) => void;
}

export function DraftScreen({ options, onKeep }: DraftScreenProps) {
  const [selected, setSelected] = useState<ItemId | null>(null);

  return (
    <div className="draft-screen">
      <header className="draft-head">
        <p className="eyebrow">Before you set off</p>
        <h1>Two things tumble out of the item deck.</h1>
        <p>Draw two, keep one. The other goes to the bottom of the deck.</p>
      </header>

      <div className="draft-layout">
        <div className="draft-options">
          {options.map((item, index) => (
            <div
              key={item}
              className={`draft-option ${selected === item ? "is-selected" : ""}`}
              style={{ "--delay": `${index * 90}ms` } as React.CSSProperties}
            >
              <ItemCard
                itemId={item}
                variant="draft"
                selected={selected === item}
                onClick={() => setSelected(item)}
                showFlavour
              />
              <button
                type="button"
                className={`btn ${selected === item ? "btn--primary" : "btn--paper"} btn--block`}
                onClick={() => setSelected(item)}
              >
                {selected === item ? (
                  <>Chosen: {ITEMS[item].name}</>
                ) : (
                  "Keep this one"
                )}
              </button>
            </div>
          ))}
        </div>

        <aside className="draft-side paper-panel">
          <p className="eyebrow">Your starting kit</p>
          <h2>Small stats. Big plans.</h2>
          <div className="draft-stats">
            <div className="draft-stat draft-stat--health">
              <IconHeart />
              <strong>3</strong>
              <span>Health</span>
            </div>
            <div className="draft-stat draft-stat--luck">
              <IconClover />
              <strong>1</strong>
              <span>Luck</span>
            </div>
            <div className="draft-stat draft-stat--money">
              <IconCoin />
              <strong>2</strong>
              <span>Money</span>
            </div>
            <div className="draft-stat draft-stat--dice">
              <IconDice />
              <strong>3d6</strong>
              <span>Base roll</span>
            </div>
          </div>
          <ul className="draft-notes">
            <li>
              <IconDice /> Spend 1 Luck to reroll any number of dice.
            </li>
            <li>
              <IconCoin /> Pay your quest&apos;s stars in Money for an extra
              die.
            </li>
            <li>
              <IconBag /> Hold up to 3 items. Use them mid-quest.
            </li>
          </ul>
          <p className="draft-note">
            Ten quests await. Five now, a shop break, then five more. Try not to
            end up at zero Health.
          </p>
          <button
            type="button"
            className="btn btn--primary btn--block"
            disabled={!selected}
            onClick={() => selected && onKeep(selected)}
          >
            {selected ? "Set off with this item" : "Choose an item"}{" "}
            <IconArrow />
          </button>
        </aside>
      </div>
    </div>
  );
}
