import assert from "node:assert/strict";
import {
  createNewGame,
  finalScore,
  gameReducer,
  specialMatches,
  totalStarsEarned,
  type Action,
} from "../src/game/engine";
import type { GameState, ItemId, QuestId } from "../src/game/types";
import { QUESTS } from "../src/game/data";

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passed += 1;
    console.log(`  ok  ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`  FAIL ${name}`);
    console.error(error);
  }
}

function fresh(seed = 7): GameState {
  const state = createNewGame(seed);
  state.screen = "board";
  state.draft = null;
  state.player = { health: 3, luck: 1, money: 2, items: [] };
  return state;
}

function begin(state: GameState, questId: QuestId, dice: number[]): GameState {
  const next = {
    ...state,
    screen: "board" as const,
    board: [questId],
    deck: [],
  };
  const selected = gameReducer(next, { type: "SELECT_QUEST", questId });
  selected.encounter!.dice = [...dice];
  return selected;
}

function dispatch(state: GameState, action: Action): GameState {
  return gameReducer(state, action);
}

console.log("\nSetup");
test("new game deals 5 face-up quests, 5 facedown, 2 draft items", () => {
  const state = createNewGame(123);
  assert.equal(state.screen, "draft");
  assert.equal(state.board.length, 5);
  assert.equal(state.deck.length, 5);
  assert.equal(state.draft?.length, 2);
  assert.equal(state.itemDeck.length, 4);
  assert.equal(new Set(state.board).size, 5);
});
test("keeping one draft item sends the other to the deck", () => {
  const state = createNewGame(123);
  const pick = state.draft![0];
  const next = dispatch(state, { type: "PICK_STARTING_ITEM", item: pick });
  assert.equal(next.screen, "board");
  assert.deepEqual(next.player.items, [pick]);
  assert.equal(next.itemDeck.length, 5);
});
test("base roll is 3d6", () => {
  const state = begin(fresh(), "b05", [1, 2, 3]);
  assert.equal(state.encounter?.dice.length, 3);
  assert.equal(state.screen, "encounter");
});

console.log("\nSpecial conditions");
test("pair detects duplicates", () => {
  assert.equal(
    specialMatches({ type: "pair" }, [1, 2, 2], fresh().player),
    true,
  );
  assert.equal(
    specialMatches({ type: "pair" }, [1, 2, 3], fresh().player),
    false,
  );
});
test("straight detects a three-die run", () => {
  assert.equal(
    specialMatches({ type: "straight" }, [2, 3, 4], fresh().player),
    true,
  );
  assert.equal(
    specialMatches({ type: "straight" }, [6, 4, 5], fresh().player),
    true,
  );
  assert.equal(
    specialMatches({ type: "straight" }, [2, 3, 5], fresh().player),
    false,
  );
  assert.equal(
    specialMatches({ type: "straight" }, [2, 2, 3, 4], fresh().player),
    true,
  );
});
test("exact values work as a multiset subset", () => {
  assert.equal(
    specialMatches(
      { type: "exact", values: [1, 1, 1] },
      [1, 1, 1, 4],
      fresh().player,
    ),
    true,
  );
  assert.equal(
    specialMatches(
      { type: "exact", values: [1, 1, 1] },
      [1, 1, 4],
      fresh().player,
    ),
    false,
  );
  assert.equal(
    specialMatches(
      { type: "exact", values: [2, 3, 4] },
      [4, 2, 3, 6],
      fresh().player,
    ),
    true,
  );
});
test("stat conditions read the player", () => {
  const player = { ...fresh().player, health: 2 };
  assert.equal(
    specialMatches(
      { type: "stat", stat: "health", op: "<", value: 3 },
      [1],
      player,
    ),
    true,
  );
  assert.equal(
    specialMatches(
      { type: "stat", stat: "health", op: ">", value: 3 },
      [1],
      player,
    ),
    false,
  );
  assert.equal(
    specialMatches(
      { type: "stat", stat: "health", op: "=", value: 2 },
      [1],
      player,
    ),
    true,
  );
});

console.log("\nQuest resolution");
test("success keeps the card, applies event, and scores stars", () => {
  const state = begin(fresh(), "b04", [3, 4, 5]);
  const next = dispatch(state, { type: "RESOLVE" });
  assert.equal(next.resolution?.outcome, "success");
  assert.equal(next.resolution?.specialMet, true);
  assert.equal(next.player.health, 4); // +1 health from success
  assert.equal(next.player.luck, 2); // +1 luck from straight
  assert.deepEqual(next.successes, ["b04"]);
  assert.equal(totalStarsEarned(next), 2);
});
test("failure discards the quest, applies fail event, and costs 1 VP", () => {
  const state = begin(fresh(), "b05", [1, 1, 1]);
  const next = dispatch(state, { type: "RESOLVE" });
  assert.equal(next.resolution?.outcome, "fail");
  assert.equal(next.resolution?.specialMet, true); // pair
  assert.equal(next.player.health, 2); // -1 fail
  assert.equal(next.player.money, 3); // +1 special
  assert.deepEqual(next.failures, ["b05"]);
  assert.equal(totalStarsEarned(next), 0);
  assert.equal(finalScore(next), -1);
});
test("abandoned quests have no event but special conditions still fire", () => {
  const state = begin(fresh(), "b02", [3, 3, 4]); // 10 = fail, not <= fail (10)? fail is 10
  const next = dispatch(state, { type: "RESOLVE" });
  // total 10 equals fail value, so it is a failure rather than abandoned.
  assert.equal(next.resolution?.outcome, "fail");
  const b02 = begin(fresh(), "b02", [3, 4, 4]); // 11 is between 10 and 14
  const next2 = dispatch(b02, { type: "RESOLVE" });
  assert.equal(next2.resolution?.outcome, "abandon");
  assert.equal(next2.resolution?.specialMet, true);
  assert.equal(next2.player.money, 3); // special pair still pays
  assert.deepEqual(next2.abandoned, ["b02"]);
});
test("special condition can fire even when the quest fails", () => {
  const state = begin(fresh(), "b07", [2, 3, 4]); // 9 = fail
  const next = dispatch(state, { type: "RESOLVE" });
  assert.equal(next.resolution?.outcome, "fail");
  assert.equal(next.resolution?.specialMet, true);
  assert.equal(next.player.money, 4); // +2 special
  assert.equal(next.player.luck, 0); // -1 fail
});
test("exact 6 special on a success", () => {
  const state = begin(fresh(), "b10", [6, 6, 6]);
  const next = dispatch(state, { type: "RESOLVE" });
  assert.equal(next.resolution?.outcome, "success");
  assert.equal(next.player.luck, 3); // +2
  assert.deepEqual(next.successes, ["b10"]);
});
test("resolving twice is a no-op", () => {
  const state = begin(fresh(), "b05", [1, 1, 1]);
  const once = dispatch(state, { type: "RESOLVE" });
  const twice = dispatch(once, { type: "RESOLVE" });
  assert.equal(twice, once);
  assert.equal(twice.failures.length, 1);
});
test("sturdy box blocks one quest damage", () => {
  const state = begin(fresh(), "b06", [1, 1, 1]);
  state.encounter!.shield = 1;
  const next = dispatch(state, { type: "RESOLVE" });
  assert.equal(next.resolution?.outcome, "fail");
  assert.equal(next.resolution?.blocked, 1);
  assert.equal(next.player.health, 1); // 3 - 3 + 1
});

console.log("\nDice economy");
test("luck rerolls any number of selected dice", () => {
  const state = begin(fresh(), "b05", [1, 2, 3]);
  state.player.luck = 2;
  let next = dispatch(state, { type: "TOGGLE_DIE", index: 0 });
  next = dispatch(next, { type: "TOGGLE_DIE", index: 2 });
  next = dispatch(next, { type: "REROLL" });
  assert.equal(next.player.luck, 1);
  assert.deepEqual(next.encounter?.selected, []);
  assert.equal(next.encounter?.dice.length, 3);
});
test("select all toggles selection", () => {
  const state = begin(fresh(), "b05", [1, 2, 3]);
  let next = dispatch(state, { type: "SELECT_ALL_DICE" });
  assert.deepEqual(next.encounter?.selected, [0, 1, 2]);
  next = dispatch(next, { type: "SELECT_ALL_DICE" });
  assert.deepEqual(next.encounter?.selected, []);
});
test("paying for help costs stars and caps at 3 dice", () => {
  const state = begin(fresh(), "b06", [1, 2, 3]);
  state.player.money = 10;
  let next = state;
  for (let i = 0; i < 4; i += 1) {
    next = dispatch(next, { type: "PAY_FOR_HELP" });
  }
  assert.equal(next.encounter?.paidDice, 3);
  assert.equal(next.encounter?.dice.length, 6);
  assert.equal(next.player.money, 1); // 10 - 3*3
});

console.log("\nItems");
test("fancy pizza heals and is discarded to the deck", () => {
  const state = begin(fresh(), "b05", [1, 2, 3]);
  state.player.items = ["b11"];
  const next = dispatch(state, { type: "USE_ITEM", index: 0 });
  assert.equal(next.player.health, 4);
  assert.deepEqual(next.player.items, []);
  assert.ok(next.itemDeck.includes("b11"));
});
test("spyglass adds 2 to the total", () => {
  const state = begin(fresh(), "b05", [2, 3, 4]);
  state.player.items = ["b12"];
  const next = dispatch(state, { type: "USE_ITEM", index: 0 });
  assert.equal(next.encounter?.bonus, 2);
});
test("robo-fighter adds a die immediately", () => {
  const state = begin(fresh(), "b05", [1, 2, 3]);
  state.player.items = ["b13"];
  const next = dispatch(state, { type: "USE_ITEM", index: 0 });
  assert.equal(next.encounter?.dice.length, 4);
});
test("really sturdy box adds a damage shield", () => {
  const state = begin(fresh(), "b05", [1, 2, 3]);
  state.player.items = ["b14"];
  const next = dispatch(state, { type: "USE_ITEM", index: 0 });
  assert.equal(next.encounter?.shield, 1);
});
test("cursed card can defeat you at 1 health", () => {
  const state = begin(fresh(), "b05", [1, 2, 3]);
  state.player.health = 1;
  state.player.items = ["b15"];
  const next = dispatch(state, { type: "USE_ITEM", index: 0 });
  assert.equal(next.defeat, true);
  assert.equal(next.screen, "score");
  assert.equal(next.player.health, 0);
  assert.equal(finalScore(next), 0);
});
test("stinky potion heals and grants luck", () => {
  const state = begin(fresh(), "b05", [1, 2, 3]);
  state.player.items = ["b16"];
  const next = dispatch(state, { type: "USE_ITEM", index: 0 });
  assert.equal(next.player.health, 4);
  assert.equal(next.player.luck, 2);
});

console.log("\nLoot and the shop");
test("loot fills an open slot", () => {
  const state = begin(fresh(), "b03", [4, 4, 4]);
  state.itemDeck = ["b14"];
  const next = dispatch(state, { type: "RESOLVE" });
  assert.equal(next.resolution?.outcome, "success");
  assert.equal(next.resolution?.itemGained, "b14");
  assert.ok(next.player.items.includes("b14"));
});
test("loot offers a swap when the satchel is full", () => {
  const state = begin(fresh(), "b03", [4, 4, 4]);
  state.player.items = ["b11", "b12", "b13"];
  state.itemDeck = ["b14"];
  let next = dispatch(state, { type: "RESOLVE" });
  assert.equal(next.resolution?.pendingItem, "b14");
  assert.equal(next.player.items.length, 3);
  const blocked = dispatch(next, { type: "CONTINUE" });
  assert.equal(blocked.screen, "encounter");
  next = dispatch(next, { type: "PICK_PENDING_ITEM", index: 0 });
  assert.deepEqual(next.resolution?.pendingItem, null);
  assert.equal(next.resolution?.itemGained, "b14");
  assert.deepEqual(next.player.items, ["b14", "b12", "b13"]);
});
test("after five quests the shop opens with three prices and items", () => {
  let state = fresh();
  state.board = ["b05", "b07", "b09"];
  state.deck = [];
  state.itemDeck = ["b11", "b12", "b13", "b14"];
  const withQuest = begin(state, "b05", [1, 2, 3]);
  withQuest.board = ["b05"];
  const resolved = dispatch(withQuest, { type: "RESOLVE" });
  const next = dispatch(resolved, { type: "CONTINUE" });
  assert.equal(next.screen, "shop");
  assert.equal(next.shop?.prices.length, 3);
  assert.equal(next.shop?.items.length, 3);
  assert.equal(next.shop?.sold.length, 3);
  assert.ok(next.shop!.prices.every((p) => p >= 1 && p <= 6));
});
test("buying in the shop spends money and fills a slot", () => {
  let state = fresh();
  state.screen = "shop";
  state.shop = {
    prices: [2, 5, 6],
    items: ["b11", "b12", "b13"],
    sold: [false, false, false],
  };
  state.player.money = 4;
  let next = dispatch(state, { type: "BUY_SHOP_ITEM", index: 0 });
  assert.equal(next.player.money, 2);
  assert.deepEqual(next.player.items, ["b11"]);
  assert.equal(next.shop?.sold[0], true);
  // no money for the 5-cost item
  next = dispatch(next, { type: "BUY_SHOP_ITEM", index: 1 });
  assert.equal(next.player.money, 2);
  assert.equal(next.player.items.length, 1);
});
test("leaving the shop starts round 2 with the remaining quests", () => {
  let state = fresh();
  state.screen = "shop";
  state.deck = ["b06", "b07", "b08", "b09", "b10"];
  state.itemDeck = ["b14"];
  state.shop = {
    prices: [2, 5, 6],
    items: ["b11", "b12", "b13"],
    sold: [false, false, false],
  };
  const next = dispatch(state, { type: "LEAVE_SHOP" });
  assert.equal(next.screen, "board");
  assert.equal(next.round, 2);
  assert.deepEqual(next.board, ["b06", "b07", "b08", "b09", "b10"]);
  assert.equal(next.shop, null);
  assert.ok(next.itemDeck.includes("b11") && next.itemDeck.includes("b12"));
});

console.log("\nScoring");
test("final score is stars kept minus failures", () => {
  let state = fresh();
  state.successes = ["b01", "b03"];
  state.failures = ["b02"];
  state.abandoned = ["b05"];
  state.defeat = false;
  assert.equal(totalStarsEarned(state), 3);
  assert.equal(finalScore(state), 2);
});
test("defeat always scores zero", () => {
  const state = fresh();
  state.successes = ["b10", "b09"];
  state.defeat = true;
  assert.equal(finalScore(state), 0);
});
test("quest data stays within the expected base set", () => {
  assert.equal(Object.keys(QUESTS).length, 10);
  assert.equal(
    Object.values(QUESTS).reduce((sum, quest) => sum + quest.stars, 0),
    21,
  );
});

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exitCode = 1;
