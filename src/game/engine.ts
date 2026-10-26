import {
  BASE_DICE,
  ITEM_CAP,
  MAX_PAID_DICE,
  PLAYER_MAX,
  PLAYER_START,
  type Condition,
  type Effect,
  type GameState,
  type ItemId,
  type LogKind,
  type Outcome,
  type PlayerState,
  type QuestId,
  type ResolutionState,
  type StatKey,
} from "./types";
import { ITEMS, ITEM_IDS, QUEST_IDS, QUESTS, STAR_GRADE } from "./data";

const VERSION = 1;

/* ------------------------------------------------------------------ */
/* Randomness                                                          */
/* ------------------------------------------------------------------ */

export function randomSeed(): number {
  return (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
}

function nextRandom(seed: number): [number, number] {
  const next = (seed + 0x6d2b79f5) | 0;
  let t = next;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, next];
}

function randomInt(seed: number, min: number, max: number): [number, number] {
  const [roll, next] = nextRandom(seed);
  return [min + Math.floor(roll * (max - min + 1)), next];
}

function shuffle<T>(items: T[], seed: number): [T[], number] {
  const copy = [...items];
  let current = seed;
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const [j, next] = randomInt(current, 0, i);
    current = next;
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return [copy, current];
}

function rollDice(count: number, seed: number): [number[], number] {
  const dice: number[] = [];
  let current = seed;
  for (let i = 0; i < count; i += 1) {
    const [value, next] = randomInt(current, 1, 6);
    current = next;
    dice.push(value);
  }
  return [dice, current];
}

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

function emptyState(seed: number): GameState {
  return {
    version: VERSION,
    seed,
    screen: "title",
    round: 1,
    player: {
      health: PLAYER_START.health,
      luck: PLAYER_START.luck,
      money: PLAYER_START.money,
      items: [],
    },
    allQuestIds: [...QUEST_IDS],
    board: [],
    deck: [],
    itemDeck: [],
    draft: null,
    encounter: null,
    resolution: null,
    shop: null,
    successes: [],
    failures: [],
    abandoned: [],
    defeat: false,
    completed: false,
    log: [],
    logSeq: 0,
  };
}

export function createTitleState(seed = randomSeed()): GameState {
  return emptyState(seed);
}

export function createNewGame(seed: number): GameState {
  const [questOrder, seedA] = shuffle(QUEST_IDS, seed);
  const [itemOrder, seedB] = shuffle(ITEM_IDS, seedA);
  const state = emptyState(seedB);
  state.screen = "draft";
  state.board = questOrder.slice(0, 5);
  state.deck = questOrder.slice(5);
  state.itemDeck = itemOrder.slice(2);
  state.draft = itemOrder.slice(0, 2);
  addLog(state, "phase", "A fresh pot is brewing. Ten quests, one adventurer.");
  addLog(
    state,
    "phase",
    "Draw two items. Keep one, tuck the other under the deck.",
  );
  return state;
}

function addLog(state: GameState, kind: LogKind, text: string) {
  state.logSeq += 1;
  state.log = [...state.log, { id: state.logSeq, kind, text }].slice(-80);
}

function clone(state: GameState): GameState {
  return {
    ...state,
    player: { ...state.player, items: [...state.player.items] },
    board: [...state.board],
    deck: [...state.deck],
    itemDeck: [...state.itemDeck],
    draft: state.draft ? [...state.draft] : null,
    encounter: state.encounter
      ? {
          ...state.encounter,
          dice: [...state.encounter.dice],
          selected: [...state.encounter.selected],
        }
      : null,
    resolution: state.resolution
      ? { ...state.resolution, atMax: [...state.resolution.atMax] }
      : null,
    shop: state.shop
      ? {
          prices: [...state.shop.prices],
          items: [...state.shop.items],
          sold: [...state.shop.sold],
        }
      : null,
    successes: [...state.successes],
    failures: [...state.failures],
    abandoned: [...state.abandoned],
    allQuestIds: [...state.allQuestIds],
  };
}

function changeStat(
  state: GameState,
  stat: StatKey,
  delta: number,
  atMax?: StatKey[],
): number {
  const before = state.player[stat];
  const max = PLAYER_MAX[stat];
  const after = Math.max(0, Math.min(max, before + delta));
  state.player[stat] = after;
  if (delta > 0 && before >= max && atMax) atMax.push(stat);
  return after - before;
}

function applyEffects(
  state: GameState,
  effects: Effect,
  shield: number,
  atMax: StatKey[],
): { health: number; luck: number; money: number; blocked: number } {
  const rawHealth = effects.health ?? 0;
  const damage = Math.max(0, -rawHealth);
  const blocked = Math.min(shield, damage);
  const health =
    rawHealth === 0
      ? 0
      : changeStat(state, "health", rawHealth + blocked, atMax);
  const luck = effects.luck
    ? changeStat(state, "luck", effects.luck, atMax)
    : 0;
  const money = effects.money
    ? changeStat(state, "money", effects.money, atMax)
    : 0;
  return { health, luck, money, blocked };
}

function formatSigned(n: number): string {
  return n > 0 ? `+${n}` : `${n}`;
}

function effectSummary(effects: {
  health: number;
  luck: number;
  money: number;
}): string {
  const parts: string[] = [];
  if (effects.health) parts.push(`${formatSigned(effects.health)} Health`);
  if (effects.luck) parts.push(`${formatSigned(effects.luck)} Luck`);
  if (effects.money) parts.push(`${formatSigned(effects.money)} Money`);
  return parts.length ? parts.join(", ") : "No change";
}

function valuesWithCounts(dice: number[]) {
  const counts = new Map<number, number>();
  for (const die of dice) counts.set(die, (counts.get(die) ?? 0) + 1);
  return counts;
}

export function specialMatches(
  condition: Condition,
  dice: number[],
  player: PlayerState,
): boolean {
  const counts = valuesWithCounts(dice);
  switch (condition.type) {
    case "pair":
      return [...counts.values()].some((count) => count >= 2);
    case "straight": {
      const unique = [...new Set(dice)].sort((a, b) => a - b);
      for (let i = 0; i <= unique.length - 3; i += 1) {
        if (
          unique[i + 1] === unique[i] + 1 &&
          unique[i + 2] === unique[i] + 2
        ) {
          return true;
        }
      }
      return false;
    }
    case "exact": {
      const needed = new Map<number, number>();
      for (const value of condition.values) {
        needed.set(value, (needed.get(value) ?? 0) + 1);
      }
      return [...needed.entries()].every(
        ([value, count]) => (counts.get(value) ?? 0) >= count,
      );
    }
    case "stat": {
      const value = player[condition.stat];
      if (condition.op === "<") return value < condition.value;
      if (condition.op === ">") return value > condition.value;
      return value === condition.value;
    }
    default:
      return false;
  }
}

export function drawItemFromDeck(state: GameState): ItemId | null {
  return state.itemDeck.shift() ?? null;
}

export function totalStarsEarned(state: GameState): number {
  return state.successes.reduce((sum, id) => sum + QUESTS[id].stars, 0);
}

export function finalScore(state: GameState): number {
  if (state.defeat) return 0;
  return totalStarsEarned(state) - state.failures.length;
}

export function scoreGrade(score: number) {
  return score >= STAR_GRADE
    ? 0
    : score >= STAR_GRADE - 5
      ? 1
      : score >= STAR_GRADE - 10
        ? 2
        : 3;
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

export type Action =
  | { type: "NEW_GAME"; seed: number }
  | { type: "LOAD_SAVE"; state: GameState }
  | { type: "PICK_STARTING_ITEM"; item: ItemId }
  | { type: "SELECT_QUEST"; questId: QuestId }
  | { type: "TOGGLE_DIE"; index: number }
  | { type: "SELECT_ALL_DICE" }
  | { type: "REROLL" }
  | { type: "PAY_FOR_HELP" }
  | { type: "USE_ITEM"; index: number }
  | { type: "RESOLVE" }
  | { type: "CONTINUE" }
  | { type: "BUY_SHOP_ITEM"; index: number }
  | { type: "LEAVE_SHOP" }
  | { type: "PICK_PENDING_ITEM"; index: number }
  | { type: "DECLINE_PENDING_ITEM" }
  | { type: "TO_TITLE" };

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "NEW_GAME":
      return createNewGame(action.seed);

    case "LOAD_SAVE":
      return action.state;

    case "TO_TITLE":
      return { ...state, screen: "title" };

    case "PICK_STARTING_ITEM": {
      if (state.screen !== "draft" || !state.draft) return state;
      const flipped = state.draft.find((id) => id !== action.item);
      const next = clone(state);
      next.player.items = [action.item];
      next.draft = null;
      next.screen = "board";
      if (flipped) next.itemDeck = [...next.itemDeck, flipped];
      addLog(next, "item", `Kept ${ITEMS[action.item].name}.`);
      addLog(next, "phase", "Round 1 — five quests are on the board.");
      return next;
    }

    case "SELECT_QUEST": {
      if (state.screen !== "board" || state.encounter) return state;
      if (!state.board.includes(action.questId)) return state;
      const [dice, seed] = rollDice(BASE_DICE, state.seed);
      const next = clone(state);
      next.seed = seed;
      next.screen = "encounter";
      next.encounter = {
        questId: action.questId,
        dice,
        selected: [],
        bonus: 0,
        shield: 0,
        paidDice: 0,
        rerolls: 0,
      };
      addLog(next, "quest", `Quest begun: ${QUESTS[action.questId].title}`);
      addLog(
        next,
        "roll",
        `Base roll 3d6 → ${dice.join(", ")} (${dice.reduce((a, b) => a + b, 0)}).`,
      );
      return next;
    }

    case "TOGGLE_DIE": {
      if (!state.encounter || state.screen !== "encounter" || state.resolution)
        return state;
      const next = clone(state);
      const enc = next.encounter!;
      if (action.index < 0 || action.index >= enc.dice.length) return state;
      enc.selected = enc.selected.includes(action.index)
        ? enc.selected.filter((i) => i !== action.index)
        : [...enc.selected, action.index];
      return next;
    }

    case "SELECT_ALL_DICE": {
      if (!state.encounter || state.resolution) return state;
      const next = clone(state);
      const enc = next.encounter!;
      const allSelected = enc.selected.length === enc.dice.length;
      enc.selected = allSelected ? [] : enc.dice.map((_, i) => i);
      return next;
    }

    case "REROLL": {
      if (!state.encounter || state.screen !== "encounter" || state.resolution)
        return state;
      const enc = state.encounter;
      if (enc.selected.length === 0 || state.player.luck < 1) return state;
      const next = clone(state);
      const active = next.encounter!;
      const [values, seed] = rollDice(active.selected.length, next.seed);
      next.seed = seed;
      const before = active.dice.map((d) => d);
      active.selected
        .slice()
        .sort((a, b) => a - b)
        .forEach((dieIndex, i) => {
          active.dice[dieIndex] = values[i];
        });
      active.selected = [];
      active.rerolls += 1;
      const after = active.dice.map((d) => d);
      changeStat(next, "luck", -1);
      addLog(
        next,
        "roll",
        `Spent 1 Luck. Rerolled ${values.length} ${values.length === 1 ? "die" : "dice"}: ${before.join(", ")} → ${after.join(", ")}.`,
      );
      return next;
    }

    case "PAY_FOR_HELP": {
      if (!state.encounter || state.screen !== "encounter" || state.resolution)
        return state;
      const enc = state.encounter;
      const quest = QUESTS[enc.questId];
      if (enc.paidDice >= MAX_PAID_DICE) return state;
      if (state.player.money < quest.stars) return state;
      const next = clone(state);
      const active = next.encounter!;
      const [values, seed] = rollDice(1, next.seed);
      next.seed = seed;
      active.dice = [...active.dice, values[0]];
      active.paidDice += 1;
      changeStat(next, "money", -quest.stars);
      addLog(
        next,
        "roll",
        `Paid ${quest.stars} Money for an extra die → ${values[0]} (${active.dice.length}d6 total).`,
      );
      return next;
    }

    case "USE_ITEM": {
      if (!state.encounter || state.screen !== "encounter" || state.resolution)
        return state;
      const item = state.player.items[action.index];
      if (!item) return state;
      const card = ITEMS[item];
      const next = clone(state);
      const active = next.encounter!;
      next.player.items = next.player.items.filter(
        (_, i) => i !== action.index,
      );
      next.itemDeck = [...next.itemDeck, item];
      const notes: string[] = [];
      const atMax: StatKey[] = [];

      if (card.effects.bonus) {
        active.bonus += card.effects.bonus;
        notes.push(`+${card.effects.bonus} to the roll`);
      }
      if (card.effects.shield) {
        active.shield += card.effects.shield;
        notes.push("negates 1 damage");
      }
      if (card.effects.dice) {
        const [values, seed] = rollDice(card.effects.dice, next.seed);
        next.seed = seed;
        active.dice = [...active.dice, ...values];
        notes.push(`adds ${values.length}d6 → ${values.join(", ")}`);
      }
      if (card.effects.health || card.effects.luck || card.effects.money) {
        const applied = applyEffects(
          next,
          {
            health: card.effects.health,
            luck: card.effects.luck,
            money: card.effects.money,
          },
          0,
          atMax,
        );
        if (applied.health)
          notes.push(`${formatSigned(applied.health)} Health`);
        if (applied.blocked) notes.push(`${applied.blocked} damage blocked`);
        if (applied.luck) notes.push(`${formatSigned(applied.luck)} Luck`);
        if (applied.money) notes.push(`${formatSigned(applied.money)} Money`);
      }

      addLog(next, "item", `Used ${card.name}. ${notes.join(" · ")}.`);

      if (next.player.health <= 0) {
        next.defeat = true;
        next.completed = true;
        next.screen = "score";
        next.encounter = null;
        addLog(
          next,
          "stat",
          "You collapse. The coffee goes cold. Final score: 0.",
        );
      }
      return next;
    }

    case "RESOLVE": {
      if (!state.encounter || state.screen !== "encounter" || state.resolution)
        return state;
      return resolveQuest(state);
    }

    case "BUY_SHOP_ITEM": {
      if (state.screen !== "shop" || !state.shop) return state;
      const item = state.shop.items[action.index];
      if (!item || state.shop.sold[action.index]) return state;
      const cost = state.shop.prices[action.index];
      if (state.player.money < cost) return state;
      if (state.player.items.length >= ITEM_CAP) return state;
      const next = clone(state);
      const shop = next.shop!;
      shop.sold[action.index] = true;
      changeStat(next, "money", -cost);
      next.player.items = [...next.player.items, item];
      addLog(next, "shop", `Bought ${ITEMS[item].name} for ${cost} Money.`);
      return next;
    }

    case "LEAVE_SHOP": {
      if (state.screen !== "shop" || !state.shop) return state;
      const next = clone(state);
      const unsold = next.shop!.items.filter(
        (item, i) => item !== null && !next.shop!.sold[i],
      ) as ItemId[];
      const [shuffled, seed] = shuffle(
        [...next.itemDeck, ...unsold],
        next.seed,
      );
      next.seed = seed;
      next.itemDeck = shuffled;
      next.shop = null;
      next.round = 2;
      next.board = [...next.deck];
      next.deck = [];
      next.screen = "board";
      addLog(
        next,
        "phase",
        "The shop bell jingles. Round 2 — five new quests appear.",
      );
      return next;
    }

    case "PICK_PENDING_ITEM": {
      if (!state.resolution?.pendingItem) return state;
      const newItem = state.resolution.pendingItem;
      const oldItem = state.player.items[action.index];
      if (!oldItem) return state;
      const next = clone(state);
      next.player.items = next.player.items.map((item, i) =>
        i === action.index ? newItem : item,
      );
      next.itemDeck = [...next.itemDeck, oldItem];
      next.resolution!.pendingItem = null;
      next.resolution!.itemGained = newItem;
      addLog(
        next,
        "item",
        `Swapped ${ITEMS[oldItem].name} for ${ITEMS[newItem].name}.`,
      );
      return next;
    }

    case "DECLINE_PENDING_ITEM": {
      if (!state.resolution?.pendingItem) return state;
      const newItem = state.resolution.pendingItem;
      const next = clone(state);
      next.itemDeck = [...next.itemDeck, newItem];
      next.resolution!.pendingItem = null;
      addLog(
        next,
        "item",
        `Left ${ITEMS[newItem].name} behind — satchel full.`,
      );
      return next;
    }

    case "CONTINUE": {
      if (!state.resolution) return state;
      if (state.resolution.pendingItem) return state;
      const next = clone(state);
      next.resolution = null;

      if (next.defeat) {
        next.screen = "score";
        next.completed = true;
        next.encounter = null;
        return next;
      }

      if (next.board.length > 0) {
        next.encounter = null;
        next.screen = "board";
        return next;
      }

      next.encounter = null;
      if (next.round === 1) {
        return openShop(next);
      }

      next.screen = "score";
      next.completed = true;
      addLog(
        next,
        "phase",
        "Every quest has been resolved. Time to tally the stars.",
      );
      return next;
    }

    default:
      return state;
  }
}

function resolveQuest(state: GameState): GameState {
  const enc = state.encounter!;
  const quest = QUESTS[enc.questId];
  const total = enc.dice.reduce((a, b) => a + b, 0) + enc.bonus;
  const outcome: Outcome =
    total >= quest.success.value
      ? "success"
      : total <= quest.fail.value
        ? "fail"
        : "abandon";
  const specialMet = specialMatches(
    quest.special.condition,
    enc.dice,
    state.player,
  );
  const baseEffects =
    outcome === "success"
      ? quest.success.effects
      : outcome === "fail"
        ? quest.fail.effects
        : {};
  const specialEffects = specialMet ? quest.special.effects : {};
  const combined: Effect = {
    health: (baseEffects.health ?? 0) + (specialEffects.health ?? 0),
    luck: (baseEffects.luck ?? 0) + (specialEffects.luck ?? 0),
    money: (baseEffects.money ?? 0) + (specialEffects.money ?? 0),
    item: (baseEffects.item ?? 0) + (specialEffects.item ?? 0),
  };

  const next = clone(state);
  const atMax: StatKey[] = [];
  const applied = applyEffects(next, combined, enc.shield, atMax);

  let itemGained: ItemId | null = null;
  let pendingItem: ItemId | null = null;
  if (combined.item && combined.item > 0) {
    const drawn = drawItemFromDeck(next);
    if (drawn) {
      if (next.player.items.length < ITEM_CAP) {
        next.player.items = [...next.player.items, drawn];
        itemGained = drawn;
      } else {
        pendingItem = drawn;
      }
    } else {
      addLog(next, "item", "The item deck is empty — no loot this time.");
    }
  }

  if (outcome === "success") next.successes = [...next.successes, quest.id];
  if (outcome === "fail") next.failures = [...next.failures, quest.id];
  if (outcome === "abandon") next.abandoned = [...next.abandoned, quest.id];
  next.board = next.board.filter((id) => id !== quest.id);

  const resolution: ResolutionState = {
    questId: quest.id,
    outcome,
    total,
    dice: [...enc.dice],
    bonus: enc.bonus,
    specialMet,
    health: applied.health,
    luck: applied.luck,
    money: applied.money,
    blocked: applied.blocked,
    itemGained,
    pendingItem,
    stars: outcome === "success" ? quest.stars : 0,
    atMax,
  };
  next.resolution = resolution;

  const eventName =
    outcome === "success"
      ? quest.success.name
      : outcome === "fail"
        ? quest.fail.name
        : "The quest slips away.";
  const outcomeLabel =
    outcome === "success"
      ? "SUCCESS"
      : outcome === "fail"
        ? "FAILED"
        : "ABANDONED";
  addLog(
    next,
    "quest",
    `${outcomeLabel}: ${quest.title} — ${total} vs ${quest.fail.value}/${quest.success.value}. ${eventName}`,
  );

  const summary = effectSummary(applied);
  if (summary !== "No change" || applied.blocked) {
    const shieldNote = applied.blocked ? ` (${applied.blocked} blocked)` : "";
    addLog(next, "stat", `${summary}${shieldNote}.`);
  }
  if (specialMet) {
    addLog(
      next,
      "special",
      `Special [${quest.special.label}] — ${quest.special.name} ${quest.special.text}`,
    );
  }
  if (itemGained) addLog(next, "item", `Looted ${ITEMS[itemGained].name}.`);
  if (pendingItem) {
    addLog(
      next,
      "item",
      `Found ${ITEMS[pendingItem].name}, but your satchel is full.`,
    );
  }

  if (next.player.health <= 0) {
    next.defeat = true;
    addLog(next, "stat", "You fall to 0 Health. The adventure ends here.");
  }
  return next;
}

function openShop(state: GameState): GameState {
  const [prices, seed] = rollDice(3, state.seed);
  const next = clone(state);
  next.seed = seed;
  next.screen = "shop";
  const [shuffled, seededDeck] = shuffle(next.itemDeck, next.seed);
  next.seed = seededDeck;
  next.itemDeck = shuffled;
  const items: (ItemId | null)[] = [];
  for (let i = 0; i < 3; i += 1) {
    items.push(next.itemDeck.shift() ?? null);
  }
  next.shop = { prices, items, sold: [false, false, false] };
  next.resolution = null;
  next.encounter = null;
  addLog(
    next,
    "shop",
    `The shop opens. Prices rolled: ${prices.join(", ")} Money.`,
  );
  return next;
}

/* ------------------------------------------------------------------ */
/* Persistence helpers                                                 */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "quests-over-coffee-save-v1";

export function saveGame(state: GameState) {
  try {
    if (state.screen === "title") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — the coffee still tastes fine */
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (parsed.version !== VERSION) return null;
    if (!parsed.player || typeof parsed.player.health !== "number") return null;
    if (!Array.isArray(parsed.allQuestIds)) return null;
    return {
      ...parsed,
      screen: parsed.screen === "title" ? "title" : parsed.screen,
    };
  } catch {
    return null;
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
