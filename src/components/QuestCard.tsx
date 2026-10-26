import { QUESTS } from "../game/data";
import type { QuestId } from "../game/types";
import { IconArrow, IconStar } from "./Icons";

interface QuestCardProps {
  questId: QuestId;
  index: number;
  onSelect: (id: QuestId) => void;
}

export function QuestCard({ questId, index, onSelect }: QuestCardProps) {
  const quest = QUESTS[questId];
  return (
    <button
      type="button"
      className="quest-card"
      style={{ "--delay": `${index * 55}ms` } as React.CSSProperties}
      onClick={() => onSelect(questId)}
      aria-label={`Take quest ${quest.title}, ${quest.stars} stars, fail at ${quest.fail.value} or below, success at ${quest.success.value} or above`}
    >
      <span className="quest-card__tape" aria-hidden />
      <span className="quest-card__art">
        <img src={quest.art} alt="" loading="lazy" />
        <span
          className="quest-card__stars"
          aria-label={`${quest.stars} star quest`}
        >
          {Array.from({ length: quest.stars }, (_, i) => (
            <IconStar key={i} />
          ))}
        </span>
        <span className="quest-card__number">{quest.number}</span>
      </span>
      <span className="quest-card__body">
        <span className="quest-card__title">{quest.title}</span>
        <span className="quest-card__odds">
          <span className="odds-pill odds-pill--fail">
            <span className="odds-pill__mark">≤</span> {quest.fail.value}
            <span className="odds-pill__label">fail</span>
          </span>
          <span className="odds-pill odds-pill--success">
            <span className="odds-pill__mark">≥</span> {quest.success.value}
            <span className="odds-pill__label">win</span>
          </span>
        </span>
        <span className="quest-card__special">
          <span className="tag">{quest.special.label}</span>
          <span>{quest.special.text.replace(/\.$/, "")}</span>
        </span>
      </span>
      <span className="quest-card__cta">
        Take quest <IconArrow />
      </span>
    </button>
  );
}
