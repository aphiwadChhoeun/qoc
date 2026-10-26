import { ART } from "../game/data";
import type { GameState, ItemId } from "../game/types";
import { EmptyItemSlot, ItemCard } from "./ItemCard";
import { Journal } from "./Journal";
import { PlayerCard } from "./PlayerCard";
import { QuestCard } from "./QuestCard";
import { IconArrow, IconCup, IconShop } from "./Icons";

interface BoardScreenProps {
  state: GameState;
  onSelectQuest: (id: GameState["board"][number]) => void;
  onOpenRules: () => void;
}

export function ItemHand({
  items,
  onUse,
  title = "Satchel",
  hint,
  actionLabel = "Use",
}: {
  items: ItemId[];
  onUse?: (index: number) => void;
  title?: string;
  hint?: string;
  actionLabel?: string;
}) {
  return (
    <section className="item-hand paper-panel" aria-label="Item satchel">
      <header className="item-hand__head">
        <h3>
          {title} <span>{items.length}/3</span>
        </h3>
        {hint && <p>{hint}</p>}
      </header>
      <div className="item-hand__list">
        {items.map((item, index) => (
          <ItemCard
            key={`${item}-${index}`}
            itemId={item}
            variant="hand"
            onUse={onUse ? () => onUse(index) : undefined}
            actionLabel={actionLabel}
          />
        ))}
        {Array.from({ length: Math.max(0, 3 - items.length) }, (_, i) => (
          <EmptyItemSlot key={`empty-${i}`} />
        ))}
      </div>
    </section>
  );
}

export function BoardScreen({
  state,
  onSelectQuest,
  onOpenRules,
}: BoardScreenProps) {
  const remainingThisRound = state.board.length;
  const roundLabel = state.round === 1 ? "Round 1" : "Round 2";
  const title =
    state.round === 1
      ? "Five quests. Pick your poison."
      : "A fresh pot, five new problems.";

  return (
    <div className="board-screen">
      <section className="board-main">
        <header className="board-head">
          <div>
            <p className="eyebrow">
              {roundLabel} · The quest board
              <span className="eyebrow__spark">✦</span>
            </p>
            <h1>{title}</h1>
            <p className="board-sub">
              Choose any quest. Roll 3d6, then bend fate with Luck, Money, and
              whatever is rattling around your satchel.
            </p>
          </div>

          <div className="board-deck">
            {state.round === 1 ? (
              <>
                <div className="deck-stack" aria-hidden>
                  <img src={ART.backQuest} alt="" />
                  <img src={ART.backQuest} alt="" />
                  <span className="deck-stack__count">{state.deck.length}</span>
                  <span className="deck-stack__shop">
                    <IconShop />
                  </span>
                </div>
                <div className="board-deck__copy">
                  <strong>On deck</strong>
                  <span>{state.deck.length} more quests after the shop</span>
                </div>
              </>
            ) : (
              <>
                <div className="deck-stack deck-stack--single" aria-hidden>
                  <img src={ART.backItem} alt="" />
                  <span className="deck-stack__count">
                    {state.itemDeck.length}
                  </span>
                </div>
                <div className="board-deck__copy">
                  <strong>Final round</strong>
                  <span>
                    {remainingThisRound} quests between you and the score
                  </span>
                </div>
              </>
            )}
          </div>
        </header>

        <div className="quest-grid">
          {state.board.map((id, index) => (
            <QuestCard
              key={id}
              questId={id}
              index={index}
              onSelect={onSelectQuest}
            />
          ))}
        </div>

        <footer className="board-foot">
          <span>
            <IconCup /> All quests resolve at the end. Success keeps the card;
            failure costs 1 VP.
          </span>
          <button type="button" className="text-link" onClick={onOpenRules}>
            Read the full rules <IconArrow />
          </button>
        </footer>
      </section>

      <aside className="player-rail">
        <PlayerCard player={state.player} />
        <ItemHand
          items={state.player.items}
          hint="Items are used during a quest."
        />
        <Journal log={state.log} limit={7} />
      </aside>
    </div>
  );
}
