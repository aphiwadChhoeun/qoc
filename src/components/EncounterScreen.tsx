import { useEffect, useRef, useState } from "react";
import { ITEMS, QUESTS, STAR_GRADE } from "../game/data";
import type { GameState, ResolutionState, StatKey } from "../game/types";
import { Die } from "./Die";
import { EmptyItemSlot, ItemCard } from "./ItemCard";
import { TinyLog } from "./Journal";
import {
  IconArrow,
  IconCheck,
  IconClover,
  IconCoin,
  IconCup,
  IconDice,
  IconHeart,
  IconSkull,
  IconSparkle,
  IconStar,
  IconX,
} from "./Icons";

interface EncounterProps {
  state: GameState;
  onToggleDie: (index: number) => void;
  onSelectAll: () => void;
  onReroll: () => void;
  onPay: () => void;
  onUseItem: (index: number) => void;
  onResolve: () => void;
  onContinue: () => void;
  onPickPending: (index: number) => void;
  onDeclinePending: () => void;
}

function TargetTrack({
  fail,
  success,
  total,
}: {
  fail: number;
  success: number;
  total: number;
}) {
  const min = 3;
  const max = 18;
  const toPct = (value: number) => ((value - min) / (max - min)) * 100;
  const marker = Math.max(0, Math.min(100, toPct(total)));
  return (
    <div className="target-track" aria-hidden>
      <div className="target-track__zones">
        <span
          className="target-zone target-zone--fail"
          style={{ width: `${toPct(fail)}%` }}
        >
          <span>fail</span>
        </span>
        <span
          className="target-zone target-zone--abandon"
          style={{ width: `${toPct(success) - toPct(fail)}%` }}
        >
          <span>abandon</span>
        </span>
        <span
          className="target-zone target-zone--success"
          style={{ width: `${100 - toPct(success)}%` }}
        >
          <span>success</span>
        </span>
        <span className="target-marker" style={{ left: `${marker}%` }}>
          <span>{total}</span>
        </span>
      </div>
      <div className="target-track__nums">
        <span>Fail ≤ {fail}</span>
        <span>Win ≥ {success}</span>
      </div>
    </div>
  );
}

function effectChips(res: ResolutionState) {
  const chips: {
    key: string;
    tone: string;
    label: string;
    Icon: typeof IconHeart;
  }[] = [];
  if (res.health) {
    chips.push({
      key: "health",
      tone: res.health > 0 ? "good" : "bad",
      label: `${res.health > 0 ? "+" : ""}${res.health} Health`,
      Icon: IconHeart,
    });
  }
  if (res.luck) {
    chips.push({
      key: "luck",
      tone: res.luck > 0 ? "good" : "bad",
      label: `${res.luck > 0 ? "+" : ""}${res.luck} Luck`,
      Icon: IconClover,
    });
  }
  if (res.money) {
    chips.push({
      key: "money",
      tone: res.money > 0 ? "good" : "bad",
      label: `${res.money > 0 ? "+" : ""}${res.money} Money`,
      Icon: IconCoin,
    });
  }
  if (res.blocked) {
    chips.push({
      key: "blocked",
      tone: "good",
      label: `${res.blocked} damage blocked`,
      Icon: IconCheck,
    });
  }
  res.atMax.forEach((stat: StatKey) => {
    if (chips.some((chip) => chip.key === stat)) return;
    chips.push({
      key: `max-${stat}`,
      tone: "muted",
      label: `${stat[0].toUpperCase()}${stat.slice(1)} already full`,
      Icon: IconCup,
    });
  });
  return chips;
}

export function EncounterScreen({
  state,
  onToggleDie,
  onSelectAll,
  onReroll,
  onPay,
  onUseItem,
  onResolve,
  onContinue,
  onPickPending,
  onDeclinePending,
}: EncounterProps) {
  const [itemLock, setItemLock] = useState(false);
  const enc = state.encounter;
  if (!enc) return null;
  const quest = QUESTS[enc.questId];
  const total = enc.dice.reduce((a, b) => a + b, 0) + enc.bonus;
  const selectedCount = enc.selected.length;
  const canReroll = selectedCount > 0 && state.player.luck > 0;
  const canPay = state.player.money >= quest.stars && enc.paidDice < 3;
  const allSelected = selectedCount === enc.dice.length;
  const completedCount =
    state.successes.length + state.failures.length + state.abandoned.length;
  const resolution = state.resolution;
  const questNumber = Math.min(completedCount + (resolution ? 0 : 1), 10);

  const useItem = (index: number) => {
    if (itemLock) return;
    setItemLock(true);
    onUseItem(index);
    window.setTimeout(() => setItemLock(false), 360);
  };

  return (
    <>
      <div className="encounter-screen">
        <header className="encounter-head">
          <div>
            <p className="eyebrow">
              Quest {questNumber} of 10 · Round {state.round}
              <span className="eyebrow__spark">✦</span>
            </p>
            <h1>{quest.title}</h1>
          </div>
          <div className="encounter-head__meta">
            <span
              className="star-count"
              aria-label={`${quest.stars} star quest`}
            >
              {Array.from({ length: quest.stars }, (_, i) => (
                <IconStar key={i} />
              ))}
            </span>
            <span className="grade-mini">
              Star grade <strong>{STAR_GRADE}</strong>
            </span>
          </div>
        </header>

        <div className="stage">
          <span className="stage__grain" aria-hidden />
          <div className="stage__art">
            <div className="quest-polaroid">
              <span className="quest-polaroid__tape" aria-hidden />
              <span className="quest-polaroid__img">
                <img src={quest.art} alt={`Illustration for ${quest.title}`} />
                <span className="quest-polaroid__stars">
                  {Array.from({ length: quest.stars }, (_, i) => (
                    <IconStar key={i} />
                  ))}
                </span>
              </span>
              <span className="quest-polaroid__caption">
                <span>{quest.number}</span>
                <span>{quest.stars}-star quest</span>
              </span>
            </div>
          </div>

          <div className="stage__play">
            <div className="roll-readout">
              <div className="roll-total">
                <span className="eyebrow">Roll total</span>
                <strong>{total}</strong>
                {enc.bonus > 0 && (
                  <span className="bonus-chip">+{enc.bonus} spyglass</span>
                )}
              </div>
              <div className="roll-verdict">
                {total >= quest.success.value ? (
                  <span className="verdict verdict--success">
                    Success range
                  </span>
                ) : total <= quest.fail.value ? (
                  <span className="verdict verdict--fail">Fail range</span>
                ) : (
                  <span className="verdict verdict--abandon">
                    Abandon range
                  </span>
                )}
                <span className="roll-verdict__sum">
                  {enc.dice.join(" + ")}
                  {enc.bonus ? ` + ${enc.bonus}` : ""} = {total}
                </span>
              </div>
            </div>

            <TargetTrack
              fail={quest.fail.value}
              success={quest.success.value}
              total={total}
            />

            <div className="roll-special">
              <span className="tag">{quest.special.label}</span>
              <span>
                <strong>{quest.special.name}</strong> {quest.special.text}
              </span>
            </div>

            <div className="dice-box">
              <div className="dice-row">
                {enc.dice.map((value, index) => (
                  <Die
                    key={`${index}-${value}`}
                    value={value}
                    selected={enc.selected.includes(index)}
                    onClick={() => onToggleDie(index)}
                    size={enc.dice.length > 5 ? "sm" : "md"}
                  />
                ))}
              </div>
              <div className="dice-box__foot">
                <span>
                  <IconDice /> {enc.dice.length}d6
                  {selectedCount > 0
                    ? ` · ${selectedCount} selected`
                    : " · tap dice to select"}
                </span>
                <button
                  type="button"
                  className="text-link"
                  onClick={onSelectAll}
                >
                  {allSelected ? "Deselect all" : "Select all"}
                </button>
              </div>
            </div>

            <div className="encounter-actions">
              <button
                type="button"
                className="btn btn--paper"
                onClick={onReroll}
                disabled={!canReroll}
                title={
                  selectedCount === 0
                    ? "Select dice to reroll first"
                    : "Spend 1 Luck"
                }
              >
                <IconClover />
                <span>
                  Reroll {selectedCount > 0 ? selectedCount : ""}
                  <small>1 Luck</small>
                </span>
              </button>
              <button
                type="button"
                className="btn btn--paper"
                onClick={onPay}
                disabled={!canPay}
                title={
                  enc.paidDice >= 3
                    ? "Maximum 3 paid dice per quest"
                    : "Add one die to this quest"
                }
              >
                <IconCoin />
                <span>
                  Buy a die
                  <small>
                    {quest.stars} Money · {3 - enc.paidDice} left
                  </small>
                </span>
              </button>
            </div>

            <button
              type="button"
              className="btn btn--primary btn--resolve"
              onClick={onResolve}
            >
              <span>Resolve quest</span>
              <span className="btn--resolve__total">{total} total</span>
              <IconArrow />
            </button>

            <section className="encounter-items">
              <header>
                <h3>
                  Satchel <span>{state.player.items.length}/3</span>
                </h3>
                <p>Spend an item before you resolve.</p>
              </header>
              <div className="encounter-items__grid">
                {state.player.items.map((item, index) => (
                  <ItemCard
                    key={`${item}-${index}`}
                    itemId={item}
                    variant="tile"
                    onUse={() => useItem(index)}
                    actionLabel="Use"
                    disabled={itemLock}
                  />
                ))}
                {Array.from(
                  { length: Math.max(0, 3 - state.player.items.length) },
                  (_, i) => (
                    <EmptyItemSlot key={`empty-${i}`} label="Empty slot" />
                  ),
                )}
              </div>
            </section>

            <div className="encounter-log">
              <span className="encounter-log__label">Latest note</span>
              <TinyLog log={state.log} />
            </div>
          </div>

          <div className="stage__notes">
            <div className="quest-notes">
              <div className="quest-note quest-note--fail">
                <span className="quest-note__badge">
                  <IconSkull />
                </span>
                <div>
                  <span className="quest-note__threshold">
                    Fail · {quest.fail.value} or less
                  </span>
                  <strong>{quest.fail.name}</strong>
                  <p>{quest.fail.text}</p>
                </div>
              </div>
              <div className="quest-note quest-note--success">
                <span className="quest-note__badge">
                  <IconStar />
                </span>
                <div>
                  <span className="quest-note__threshold">
                    Success · {quest.success.value} or more
                  </span>
                  <strong>{quest.success.name}</strong>
                  <p>{quest.success.text}</p>
                </div>
              </div>
              <div className="quest-note quest-note--special">
                <span className="quest-note__badge">
                  <IconSparkle />
                </span>
                <div>
                  <span className="quest-note__threshold">
                    Special ·{" "}
                    <span className="tag tag--tiny">{quest.special.label}</span>
                  </span>
                  <strong>{quest.special.name}</strong>
                  <p>{quest.special.text}</p>
                </div>
              </div>
              <p className="quest-notes__hint">
                Special conditions fire on the dice, no matter the outcome.
              </p>
            </div>
          </div>
        </div>
      </div>

      {resolution && (
        <ResultSheet
          resolution={resolution}
          state={state}
          onContinue={onContinue}
          onPickPending={onPickPending}
          onDeclinePending={onDeclinePending}
        />
      )}
    </>
  );
}

function ResultSheet({
  resolution,
  state,
  onContinue,
  onPickPending,
  onDeclinePending,
}: {
  resolution: ResolutionState;
  state: GameState;
  onContinue: () => void;
  onPickPending: (index: number) => void;
  onDeclinePending: () => void;
}) {
  const quest = QUESTS[resolution.questId];
  const event =
    resolution.outcome === "success"
      ? quest.success
      : resolution.outcome === "fail"
        ? quest.fail
        : null;
  const isSuccess = resolution.outcome === "success";
  const isFail = resolution.outcome === "fail";
  const chips = effectChips(resolution);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheetRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !sheetRef.current) return;
      const focusable = [
        ...sheetRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === sheetRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
  const nextLabel = state.defeat
    ? "See the damage"
    : state.board.length > 0
      ? "Next quest"
      : state.round === 1
        ? "Off to the shop"
        : "Tally the stars";

  return (
    <div className="result-scrim">
      <div
        ref={sheetRef}
        tabIndex={-1}
        className={`result-sheet result-sheet--${resolution.outcome}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
      >
        <span className="result-sheet__grain" aria-hidden />
        {isSuccess && (
          <div className="result-burst" aria-hidden>
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} style={{ "--burst": i } as React.CSSProperties}>
                <IconStar />
              </span>
            ))}
          </div>
        )}

        <header className="result-sheet__head">
          <div className={`result-stamp result-stamp--${resolution.outcome}`}>
            {isSuccess ? <IconCheck /> : isFail ? <IconX /> : <IconCup />}
            <span>
              {isSuccess
                ? "Quest complete"
                : isFail
                  ? "Quest failed"
                  : "Abandoned"}
            </span>
          </div>
          <div className="result-sheet__score">
            <span>Quest value</span>
            <strong>
              {isSuccess ? `+${resolution.stars}` : isFail ? "−1" : "0"}
              <small>VP</small>
            </strong>
          </div>
        </header>

        <div className="result-sheet__title">
          <p className="eyebrow">{quest.title}</p>
          <h2 id="result-title">
            {event ? event.name : "The quest slips away."}
          </h2>
          <p>
            {event
              ? event.text
              : "No event triggers. The card goes back to the box."}
          </p>
        </div>

        <div className="result-sheet__math">
          <span>
            {resolution.dice.join(" + ")}
            {resolution.bonus ? ` + ${resolution.bonus}` : ""}
          </span>
          <strong>= {resolution.total}</strong>
          <span className="result-sheet__thresholds">
            fail ≤ {quest.fail.value} · win ≥ {quest.success.value}
          </span>
        </div>

        {chips.length > 0 && (
          <div className="result-chips">
            {chips.map(({ key, tone, label, Icon }) => (
              <span key={key} className={`result-chip result-chip--${tone}`}>
                <Icon /> {label}
              </span>
            ))}
          </div>
        )}

        <div
          className={`special-result ${resolution.specialMet ? "is-met" : ""}`}
        >
          <span className="tag">{quest.special.label}</span>
          <div>
            <strong>
              {resolution.specialMet
                ? quest.special.name
                : "Special condition not met."}
            </strong>
            <p>
              {resolution.specialMet
                ? quest.special.text
                : `Needed ${quest.special.label} on the dice.`}
            </p>
          </div>
          <span className="special-result__mark">
            {resolution.specialMet ? <IconCheck /> : <IconX />}
          </span>
        </div>

        {(resolution.itemGained || resolution.pendingItem) && (
          <div className="result-loot">
            <span className="result-loot__label">
              {resolution.pendingItem
                ? "Satchel full — choose a swap"
                : "Loot added to satchel"}
            </span>
            <div className="result-loot__items">
              {resolution.pendingItem ? (
                <>
                  <div className="result-loot__new">
                    <ItemCard itemId={resolution.pendingItem} variant="tile" />
                  </div>
                  <div className="result-loot__swaps">
                    {state.player.items.map((item, index) => (
                      <button
                        key={`${item}-${index}`}
                        type="button"
                        className="swap-btn"
                        onClick={() => onPickPending(index)}
                      >
                        <img src={ITEMS[item].art} alt="" />
                        <span>Swap {ITEMS[item].name}</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      className="text-link"
                      onClick={onDeclinePending}
                    >
                      Leave it behind
                    </button>
                  </div>
                </>
              ) : (
                resolution.itemGained && (
                  <div className="result-loot__new">
                    <ItemCard itemId={resolution.itemGained} variant="tile" />
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {state.defeat && (
          <div className="defeat-note">
            <IconSkull />
            <div>
              <strong>Out of Health.</strong>
              <p>Your adventure ends with a final score of 0.</p>
            </div>
          </div>
        )}

        <footer className="result-sheet__foot">
          <p className="result-sheet__decknote">
            {resolution.outcome === "success"
              ? "Card kept for final scoring."
              : "Card returned to the box."}
          </p>
          <button
            type="button"
            className="btn btn--primary"
            onClick={onContinue}
            disabled={Boolean(resolution.pendingItem)}
          >
            {nextLabel} <IconArrow />
          </button>
        </footer>
      </div>
    </div>
  );
}
