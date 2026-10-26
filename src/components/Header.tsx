import { PLAYER_MAX, type GameState } from "../game/types";
import {
  IconBag,
  IconClover,
  IconCoin,
  IconDice,
  IconHeart,
  IconHelp,
  IconRestart,
  IconSoundOff,
  IconSoundOn,
  IconSwordCup,
} from "./Icons";

interface HeaderProps {
  state: GameState;
  muted: boolean;
  onToggleMute: () => void;
  onRules: () => void;
  onNewGame: () => void;
}

const STEPS = ["Quest I", "Shop", "Quest II", "Score"] as const;

function phaseIndex(state: GameState): number {
  if (state.screen === "score") return 3;
  if (state.screen === "shop") return 1;
  if (state.round === 2) return 2;
  return 0;
}

export function Header({
  state,
  muted,
  onToggleMute,
  onRules,
  onNewGame,
}: HeaderProps) {
  const active = phaseIndex(state);
  const resolved =
    state.successes.length + state.failures.length + state.abandoned.length;

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="brand-mark">
          <IconSwordCup />
        </span>
        <span className="brand-word">
          <strong>Quests</strong>
          <small>over coffee</small>
        </span>
      </div>

      <nav className="phase-trail" aria-label="Game phases">
        {STEPS.map((step, index) => (
          <span
            key={step}
            className={`phase-step ${index === active ? "is-active" : ""} ${
              index < active ? "is-done" : ""
            }`}
          >
            <span className="phase-step__dot">
              {index < active ? "✓" : index + 1}
            </span>
            <span>{step}</span>
          </span>
        ))}
      </nav>

      <div className="app-header__right">
        <div className="header-stats" aria-label="Player stats">
          <span
            className="hstat hstat--health"
            title={`Health ${state.player.health}/${PLAYER_MAX.health}`}
          >
            <IconHeart />
            <strong>{state.player.health}</strong>
            <small>/{PLAYER_MAX.health}</small>
          </span>
          <span
            className="hstat hstat--luck"
            title={`Luck ${state.player.luck}/${PLAYER_MAX.luck}`}
          >
            <IconClover />
            <strong>{state.player.luck}</strong>
            <small>/{PLAYER_MAX.luck}</small>
          </span>
          <span
            className="hstat hstat--money"
            title={`Money ${state.player.money}/${PLAYER_MAX.money}`}
          >
            <IconCoin />
            <strong>{state.player.money}</strong>
            <small>/{PLAYER_MAX.money}</small>
          </span>
          <span
            className="hstat hstat--bag"
            title={`Items ${state.player.items.length}/3`}
          >
            <IconBag />
            <strong>{state.player.items.length}</strong>
            <small>/3</small>
          </span>
          <span className="hstat hstat--progress" title="Quests resolved">
            <IconDice />
            <strong>{resolved}</strong>
            <small>/10</small>
          </span>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleMute}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            title={muted ? "Turn sound on" : "Turn sound off"}
          >
            {muted ? <IconSoundOff /> : <IconSoundOn />}
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={onRules}
            aria-label="How to play"
            title="How to play"
          >
            <IconHelp />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={onNewGame}
            aria-label="Start a new game"
            title="Start a new game"
          >
            <IconRestart />
          </button>
        </div>
      </div>
    </header>
  );
}
