import { GRADES, QUESTS, STAR_GRADE } from "../game/data";
import { finalScore, scoreGrade, totalStarsEarned } from "../game/engine";
import type { GameState, QuestId } from "../game/types";
import {
  IconArrow,
  IconCheck,
  IconCoin,
  IconCup,
  IconHeart,
  IconSkull,
  IconStar,
  IconX,
} from "./Icons";

interface ScoreScreenProps {
  state: GameState;
  onRestart: () => void;
  onRules: () => void;
}

type QuestOutcome = "success" | "fail" | "abandon" | "unplayed" | "active";

export function ScoreScreen({ state, onRestart, onRules }: ScoreScreenProps) {
  const score = finalScore(state);
  const stars = totalStarsEarned(state);
  const gradeIndex = scoreGrade(score);
  const grade = GRADES[gradeIndex];
  const cups = 4 - gradeIndex;
  const totalResolved =
    state.successes.length + state.failures.length + state.abandoned.length;

  const outcomeFor = (id: QuestId): QuestOutcome => {
    if (state.successes.includes(id)) return "success";
    if (state.failures.includes(id)) return "fail";
    if (state.abandoned.includes(id)) return "abandon";
    if (state.encounter?.questId === id) return "active";
    return "unplayed";
  };

  return (
    <div className={`score-screen ${state.defeat ? "is-defeat" : ""}`}>
      <div className="score-confetti" aria-hidden>
        {Array.from({ length: state.defeat ? 0 : 18 }, (_, i) => {
          const left = (i * 37 + 6) % 93;
          const top = (i * 23 + 4) % 52;
          const delay = (i % 9) * 0.62;
          const size = 9 + (i % 4) * 3;
          return (
            <span
              key={i}
              style={
                {
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDelay: `-${delay}s`,
                  width: `${size}px`,
                  height: `${size}px`,
                } as React.CSSProperties
              }
            >
              <IconStar />
            </span>
          );
        })}
      </div>

      <main className="score-sheet">
        <header className="score-head">
          <p className="eyebrow">
            Final scoring · {totalResolved} of 10 quests resolved
            <span className="eyebrow__spark">✦</span>
          </p>
          {state.defeat ? (
            <>
              <div className="defeat-badge">
                <IconSkull /> Defeated
              </div>
              <h1>Out of Health. Out of time.</h1>
              <p className="score-sub">
                You ran out of Health, so the adventure ends with a score of 0.
                The coffee is on the house. Come back tomorrow.
              </p>
            </>
          ) : (
            <>
              <div className="cup-rating" aria-label={`${cups} out of 4 cups`}>
                {Array.from({ length: 4 }, (_, i) => (
                  <span key={i} className={i < cups ? "is-filled" : ""}>
                    <IconCup />
                  </span>
                ))}
              </div>
              <h1>{grade.title}</h1>
              <p className="score-sub">{grade.note}</p>
            </>
          )}
        </header>

        <section className="score-hero" aria-label="Final score">
          <div className="score-hero__main">
            <span className="score-hero__label">Final score</span>
            <strong className="score-hero__number">{score}</strong>
            <span className="score-hero__formula">
              {state.defeat
                ? "Defeat sets the score to 0."
                : `${stars} stars kept − ${state.failures.length} failed`}
            </span>
          </div>
          <div className="score-hero__side">
            <div className="score-stat">
              <IconStar />
              <strong>{stars}</strong>
              <span>Stars kept</span>
            </div>
            <div className="score-stat score-stat--win">
              <IconCheck />
              <strong>{state.successes.length}</strong>
              <span>Quests won</span>
            </div>
            <div className="score-stat score-stat--fail">
              <IconX />
              <strong>{state.failures.length}</strong>
              <span>Quests failed</span>
            </div>
            <div className="score-stat score-stat--muted">
              <IconCup />
              <strong>{state.abandoned.length}</strong>
              <span>Abandoned</span>
            </div>
          </div>
        </section>

        <section className="score-ladder" aria-label="Star grade ladder">
          <div className="score-ladder__head">
            <h2>Star grade: {STAR_GRADE}</h2>
            <p>
              1 VP per star kept. −1 VP per failed quest. The star grade is
              every star in the deck.
            </p>
          </div>
          <div className="score-ladder__rows">
            {GRADES.map((entry, index) => {
              const low = index === 0 ? STAR_GRADE : entry.min;
              const high = index === 0 ? null : GRADES[index - 1].min - 1;
              const range =
                high === null
                  ? `${low}+ VP`
                  : index === GRADES.length - 1
                    ? `${high} VP and below`
                    : `${low}–${high} VP`;
              return (
                <div
                  key={entry.title}
                  className={`score-ladder__row ${gradeIndex === index ? "is-current" : ""}`}
                >
                  <span className="score-ladder__range">{range}</span>
                  <span className="score-ladder__title">{entry.title}</span>
                  {gradeIndex === index && (
                    <span className="score-ladder__current">You</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="score-quests" aria-label="Quest results">
          <div className="score-quests__head">
            <h2>The quest board, in hindsight</h2>
            <span>
              <IconCoin /> {state.player.money} money left · <IconHeart />{" "}
              {state.player.health} health · {state.player.items.length}/3 items
            </span>
          </div>
          <div className="score-quests__grid">
            {state.allQuestIds.map((id) => {
              const quest = QUESTS[id];
              const outcome = outcomeFor(id);
              return (
                <div key={id} className={`score-quest score-quest--${outcome}`}>
                  <img src={quest.art} alt="" />
                  <div className="score-quest__body">
                    <span className="score-quest__stars">
                      {Array.from({ length: quest.stars }, (_, i) => (
                        <IconStar key={i} />
                      ))}
                    </span>
                    <strong>{quest.title}</strong>
                    <span className="score-quest__status">
                      {outcome === "success" && (
                        <>
                          <IconCheck /> Kept · +{quest.stars} VP
                        </>
                      )}
                      {outcome === "fail" && (
                        <>
                          <IconX /> Failed · −1 VP
                        </>
                      )}
                      {outcome === "abandon" && (
                        <>
                          <IconCup /> Abandoned
                        </>
                      )}
                      {outcome === "unplayed" && (
                        <>
                          <IconCup /> Not attempted
                        </>
                      )}
                      {outcome === "active" && (
                        <>
                          <IconCup /> In progress
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="score-foot">
          <div>
            <p className="score-foot__coffee">
              {state.defeat
                ? "The barista quietly refills your cup."
                : gradeIndex === 0
                  ? "The barista gives you a free refill. Absolute perfection."
                  : "Every cup is a lesson. Brew another."}
            </p>
            <button type="button" className="text-link" onClick={onRules}>
              Rules &amp; credits
            </button>
          </div>
          <button
            type="button"
            className="btn btn--primary btn--hero"
            onClick={onRestart}
          >
            Brew another game <IconArrow />
          </button>
        </footer>
      </main>
    </div>
  );
}
