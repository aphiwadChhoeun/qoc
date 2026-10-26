export type QuestId =
  "b01" | "b02" | "b03" | "b04" | "b05" | "b06" | "b07" | "b08" | "b09" | "b10";

export type ItemId = "b11" | "b12" | "b13" | "b14" | "b15" | "b16";

export type StatKey = "health" | "luck" | "money";

export interface Effect {
  health?: number;
  luck?: number;
  money?: number;
  item?: number;
}

export interface QuestEvent {
  name: string;
  text: string;
  effects: Effect;
}

export type Condition =
  | { type: "pair" }
  | { type: "straight" }
  | { type: "exact"; values: number[] }
  | { type: "stat"; stat: StatKey; op: "<" | ">" | "="; value: number };

export interface QuestCard {
  id: QuestId;
  number: string;
  title: string;
  stars: 1 | 2 | 3;
  art: string;
  fail: QuestEvent & { value: number };
  success: QuestEvent & { value: number };
  special: QuestEvent & { condition: Condition; label: string };
}

export interface ItemEffect {
  health?: number;
  luck?: number;
  money?: number;
  bonus?: number;
  dice?: number;
  shield?: number;
}

export interface ItemCard {
  id: ItemId;
  number: string;
  name: string;
  effectText: string;
  flavour: string;
  art: string;
  effects: ItemEffect;
}

export type Screen =
  "title" | "draft" | "board" | "encounter" | "shop" | "score";

export type Outcome = "success" | "fail" | "abandon";

export interface PlayerState {
  health: number;
  luck: number;
  money: number;
  items: ItemId[];
}

export interface EncounterState {
  questId: QuestId;
  dice: number[];
  selected: number[];
  bonus: number;
  shield: number;
  paidDice: number;
  rerolls: number;
}

export interface ResolutionState {
  questId: QuestId;
  outcome: Outcome;
  total: number;
  dice: number[];
  bonus: number;
  specialMet: boolean;
  health: number;
  luck: number;
  money: number;
  blocked: number;
  itemGained: ItemId | null;
  pendingItem: ItemId | null;
  stars: number;
  atMax: StatKey[];
}

export interface ShopState {
  prices: number[];
  items: (ItemId | null)[];
  sold: boolean[];
}

export type LogKind =
  "quest" | "roll" | "shop" | "item" | "stat" | "phase" | "special";

export interface LogEntry {
  id: number;
  kind: LogKind;
  text: string;
}

export interface GameState {
  version: number;
  seed: number;
  screen: Screen;
  round: 1 | 2;
  player: PlayerState;
  allQuestIds: QuestId[];
  board: QuestId[];
  deck: QuestId[];
  itemDeck: ItemId[];
  draft: ItemId[] | null;
  encounter: EncounterState | null;
  resolution: ResolutionState | null;
  shop: ShopState | null;
  successes: QuestId[];
  failures: QuestId[];
  abandoned: QuestId[];
  defeat: boolean;
  completed: boolean;
  log: LogEntry[];
  logSeq: number;
}

export const PLAYER_MAX = {
  health: 5,
  luck: 5,
  money: 10,
} as const;

export const PLAYER_START = {
  health: 3,
  luck: 1,
  money: 2,
} as const;

export const ITEM_CAP = 3;
export const BASE_DICE = 3;
export const MAX_PAID_DICE = 3;
