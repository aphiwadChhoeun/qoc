import { ART, QUESTS } from "../game/data";
import { Die } from "./Die";
import { IconArrow, IconCup, IconStar } from "./Icons";

interface TitleScreenProps {
  hasSave: boolean;
  continueLabel: string;
  onStart: () => void;
  onContinue: () => void;
  onRules: () => void;
}

const HERO_QUESTS = ["b06", "b09", "b01"] as const;

export function TitleScreen({
  hasSave,
  continueLabel,
  onStart,
  onContinue,
  onRules,
}: TitleScreenProps) {
  return (
    <div className="title-screen">
      <div className="title-screen__grain" aria-hidden />
      <main className="title-hero">
        <div className="title-hero__copy">
          <div className="title-kicker">
            <span className="title-kicker__line" />
            <span>A solo dice-and-dares adventure</span>
          </div>
          <h1 className="title-logo">
            <span className="title-logo__quests">Quests</span>
            <span className="title-logo__over">
              <span>over</span>
              <IconCup />
            </span>
            <span className="title-logo__coffee">Coffee</span>
          </h1>
          <p className="title-lede">
            Roll dice. Lose your luck. Escape an orc. Ten tiny quests, one
            increasingly strange coffee break.
          </p>
          <div className="title-actions">
            <button
              type="button"
              className="btn btn--primary btn--hero"
              onClick={onStart}
            >
              Brew a new game <IconArrow />
            </button>
            {hasSave && (
              <button
                type="button"
                className="btn btn--paper btn--hero"
                onClick={onContinue}
              >
                {continueLabel}
              </button>
            )}
          </div>
          <div className="title-meta">
            <button type="button" className="text-link" onClick={onRules}>
              How to play
            </button>
            <span className="title-meta__dot" />
            <span>1 player</span>
            <span className="title-meta__dot" />
            <span>10–20 min</span>
            <span className="title-meta__dot" />
            <span>Base set</span>
          </div>
        </div>

        <div className="title-hero__art" aria-hidden>
          <div className="hero-card hero-card--back">
            <img src={ART.backQuest} alt="" />
          </div>
          {HERO_QUESTS.map((id, i) => (
            <div key={id} className={`hero-card hero-card--${i + 1}`}>
              <span className="hero-card__tape" />
              <img src={QUESTS[id].art} alt="" />
              <span className="hero-card__stars">
                {Array.from({ length: QUESTS[id].stars }, (_, s) => (
                  <IconStar key={s} />
                ))}
              </span>
            </div>
          ))}
          <span className="hero-die hero-die--one">
            <Die value={5} size="lg" />
          </span>
          <span className="hero-die hero-die--two">
            <Die value={6} size="md" tone="gold" />
          </span>
          <span className="hero-die hero-die--three">
            <Die value={3} size="sm" />
          </span>
          <div className="hero-steam hero-steam--one" />
          <div className="hero-steam hero-steam--two" />
        </div>
      </main>
      <footer className="title-footer">
        <span>A game by Alexander Shen</span>
        <span className="title-meta__dot" />
        <span>Web adaptation · Rules v2.1.0</span>
        <span className="title-meta__dot" />
        <span>Illustrations from the base set</span>
      </footer>
    </div>
  );
}
