import { PLAYER_MAX, type PlayerState, type StatKey } from "../game/types";
import { IconClover, IconCoin, IconCup, IconHeart } from "./Icons";

interface StatRowProps {
  stat: StatKey;
  value: number;
  max: number;
  compact?: boolean;
}

const STAT_META = {
  health: { label: "Health", Icon: IconHeart, tone: "health" },
  luck: { label: "Luck", Icon: IconClover, tone: "luck" },
  money: { label: "Money", Icon: IconCoin, tone: "money" },
} as const;

export function StatRow({ stat, value, max, compact = false }: StatRowProps) {
  const meta = STAT_META[stat];
  const Icon = meta.Icon;
  return (
    <div
      className={`stat-row stat-row--${meta.tone} ${compact ? "stat-row--compact" : ""}`}
    >
      <span className="stat-row__label">
        <Icon />
        <span>{meta.label}</span>
      </span>
      <span className="stat-row__pips" aria-hidden>
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={`stat-pip ${i < value ? "is-filled" : ""}`}
            style={{ "--pip-index": i } as React.CSSProperties}
          />
        ))}
      </span>
      <span className="stat-row__value">
        {value}
        <span className="stat-row__max">/{max}</span>
      </span>
    </div>
  );
}

export function PlayerCard({ player }: { player: PlayerState }) {
  return (
    <section className="player-card paper-panel" aria-label="Player status">
      <div className="player-card__head">
        <div>
          <p className="eyebrow">The adventurer</p>
          <h2>Your satchel &amp; stats</h2>
        </div>
        <div className="roll-chip" title="Base roll each quest">
          <IconCup />
          <span>3d6</span>
        </div>
      </div>
      <div className="player-card__stats">
        <StatRow stat="health" value={player.health} max={PLAYER_MAX.health} />
        <StatRow stat="luck" value={player.luck} max={PLAYER_MAX.luck} />
        <StatRow stat="money" value={player.money} max={PLAYER_MAX.money} />
      </div>
      <div className="player-card__rule">
        <span>Roll 3d6</span>
        <span className="dot" />
        <span>Max 3 items</span>
        <span className="dot" />
        <span>0 Health = defeat</span>
      </div>
    </section>
  );
}
