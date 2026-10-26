import { useEffect, useReducer, useRef, useState } from "react";
import { BoardScreen } from "./components/BoardScreen";
import { DraftScreen } from "./components/DraftScreen";
import { EncounterScreen } from "./components/EncounterScreen";
import { Header } from "./components/Header";
import { Modal } from "./components/Modal";
import { RulesModal } from "./components/RulesModal";
import { ScoreScreen } from "./components/ScoreScreen";
import { ShopScreen } from "./components/ShopScreen";
import { TitleScreen } from "./components/TitleScreen";
import {
  clearSave,
  createTitleState,
  gameReducer,
  loadGame,
  randomSeed,
  saveGame,
} from "./game/engine";
import type { GameState } from "./game/types";
import { playSound } from "./sound";

const MUTE_KEY = "quests-over-coffee-muted";

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

function continueLabel(state: GameState): string {
  switch (state.screen) {
    case "draft":
      return "Continue setup";
    case "board":
    case "encounter":
      return "Continue quest";
    case "shop":
      return "Back to the shop";
    case "score":
      return "View last score";
    default:
      return "Continue";
  }
}

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () =>
    createTitleState(randomSeed()),
  );
  const [saved, setSaved] = useState<GameState | null>(() => loadGame());
  const [muted, setMuted] = useState(readMuted);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);

  const prevSound = useRef({
    screen: state.screen,
    dice: state.encounter?.dice.join("-") ?? "",
    resolution: "",
    money: state.player.money,
    defeat: state.defeat,
  });

  useEffect(() => {
    saveGame(state);
  }, [state]);

  useEffect(() => {
    try {
      localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [muted]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.screen]);

  useEffect(() => {
    if (muted) {
      prevSound.current = {
        screen: state.screen,
        dice: state.encounter?.dice.join("-") ?? "",
        resolution: state.resolution
          ? `${state.resolution.questId}-${state.resolution.outcome}-${state.resolution.total}`
          : "",
        money: state.player.money,
        defeat: state.defeat,
      };
      return;
    }
    const prev = prevSound.current;

    if (state.screen !== prev.screen) {
      if (state.screen === "encounter" || state.screen === "draft")
        playSound("card");
      else if (state.screen === "shop") playSound("shop");
    }

    const dice = state.encounter?.dice.join("-") ?? "";
    if (dice && dice !== prev.dice) playSound("dice");

    const resolution = state.resolution
      ? `${state.resolution.questId}-${state.resolution.outcome}-${state.resolution.total}`
      : "";
    if (resolution && resolution !== prev.resolution && state.resolution) {
      playSound(state.resolution.outcome === "success" ? "success" : "fail");
    }

    if (
      state.screen === "score" &&
      state.defeat &&
      !prev.defeat &&
      !resolution
    ) {
      playSound("fail");
    }

    if (
      state.screen === "shop" &&
      state.player.money < prev.money &&
      state.screen === prev.screen
    ) {
      playSound("coin");
    }

    prevSound.current = {
      screen: state.screen,
      dice,
      resolution,
      money: state.player.money,
      defeat: state.defeat,
    };
  }, [state, muted]);

  useEffect(() => {
    const onClick = (event: PointerEvent) => {
      if (muted) return;
      const target = event.target as HTMLElement | null;
      const button = target?.closest("button");
      if (button && !button.disabled) playSound("click");
    };
    document.addEventListener("pointerdown", onClick);
    return () => document.removeEventListener("pointerdown", onClick);
  }, [muted]);

  const startNew = () => {
    clearSave();
    setSaved(null);
    setConfirmNew(false);
    dispatch({ type: "NEW_GAME", seed: randomSeed() });
  };

  const continueSaved = () => {
    if (!saved) return;
    dispatch({ type: "LOAD_SAVE", state: saved });
  };

  return (
    <div className="app">
      <div className="ambient" aria-hidden>
        <span className="ambient__ring ambient__ring--one" />
        <span className="ambient__ring ambient__ring--two" />
        <span className="ambient__bean ambient__bean--one" />
        <span className="ambient__bean ambient__bean--two" />
      </div>

      {state.screen === "title" ? (
        <TitleScreen
          hasSave={Boolean(saved)}
          continueLabel={saved ? continueLabel(saved) : "Continue"}
          onStart={startNew}
          onContinue={continueSaved}
          onRules={() => setRulesOpen(true)}
        />
      ) : (
        <div className="app-shell">
          <Header
            state={state}
            muted={muted}
            onToggleMute={() => setMuted((value) => !value)}
            onRules={() => setRulesOpen(true)}
            onNewGame={() => setConfirmNew(true)}
          />

          <main className={`app-main app-main--${state.screen}`}>
            {state.screen === "draft" && state.draft && (
              <DraftScreen
                options={state.draft}
                onKeep={(item) =>
                  dispatch({ type: "PICK_STARTING_ITEM", item })
                }
              />
            )}

            {state.screen === "board" && (
              <BoardScreen
                state={state}
                onSelectQuest={(questId) =>
                  dispatch({ type: "SELECT_QUEST", questId })
                }
                onOpenRules={() => setRulesOpen(true)}
              />
            )}

            {state.screen === "encounter" && (
              <EncounterScreen
                state={state}
                onToggleDie={(index) => dispatch({ type: "TOGGLE_DIE", index })}
                onSelectAll={() => dispatch({ type: "SELECT_ALL_DICE" })}
                onReroll={() => dispatch({ type: "REROLL" })}
                onPay={() => dispatch({ type: "PAY_FOR_HELP" })}
                onUseItem={(index) => dispatch({ type: "USE_ITEM", index })}
                onResolve={() => dispatch({ type: "RESOLVE" })}
                onContinue={() => dispatch({ type: "CONTINUE" })}
                onPickPending={(index) =>
                  dispatch({ type: "PICK_PENDING_ITEM", index })
                }
                onDeclinePending={() =>
                  dispatch({ type: "DECLINE_PENDING_ITEM" })
                }
              />
            )}

            {state.screen === "shop" && (
              <ShopScreen
                state={state}
                onBuy={(index) => dispatch({ type: "BUY_SHOP_ITEM", index })}
                onLeave={() => dispatch({ type: "LEAVE_SHOP" })}
              />
            )}

            {state.screen === "score" && (
              <ScoreScreen
                state={state}
                onRestart={startNew}
                onRules={() => setRulesOpen(true)}
              />
            )}
          </main>
        </div>
      )}

      <RulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} />

      <Modal
        open={confirmNew}
        onClose={() => setConfirmNew(false)}
        eyebrow="A fresh pot"
        title="Start a new game?"
        footer={
          <div className="modal-buttons">
            <button
              type="button"
              className="btn btn--paper"
              onClick={() => setConfirmNew(false)}
            >
              Keep playing
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={startNew}
            >
              Start over
            </button>
          </div>
        }
      >
        <p>
          Your current run — quests, coins, questionable items — will be
          discarded. The coffee shop does not do refunds.
        </p>
      </Modal>
    </div>
  );
}
