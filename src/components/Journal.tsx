import { useEffect, useRef } from "react";
import type { LogEntry } from "../game/types";
import {
  IconClover,
  IconDice,
  IconHeart,
  IconScroll,
  IconShop,
  IconSparkle,
  IconStar,
} from "./Icons";

const ICONS = {
  quest: IconScroll,
  roll: IconDice,
  shop: IconShop,
  item: IconStar,
  stat: IconHeart,
  phase: IconClover,
  special: IconSparkle,
} as const;

interface JournalProps {
  log: LogEntry[];
  limit?: number;
  title?: string;
}

export function Journal({ log, limit = 5, title = "Quest log" }: JournalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const entries = log.slice(-limit);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log, limit]);

  return (
    <section className="journal paper-panel" aria-label="Quest log">
      <header className="journal__head">
        <h3>{title}</h3>
        <span className="journal__count">{log.length} notes</span>
      </header>
      <div className="journal__scroll" ref={scrollRef}>
        {entries.length === 0 && (
          <p className="journal__empty">Nothing in the log yet.</p>
        )}
        {entries.map((entry) => {
          const Icon = ICONS[entry.kind] ?? IconScroll;
          return (
            <div
              key={entry.id}
              className={`journal__entry journal__entry--${entry.kind}`}
            >
              <span className="journal__icon">
                <Icon />
              </span>
              <span>{entry.text}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function TinyLog({ log }: { log: LogEntry[] }) {
  const latest = log[log.length - 1];
  if (!latest) return null;
  return (
    <div className="tiny-log">
      <span className="tiny-log__dot" />
      <span>{latest.text}</span>
    </div>
  );
}
