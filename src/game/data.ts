import type { ItemCard, ItemId, QuestCard, QuestId } from "./types";

export const QUESTS: Record<QuestId, QuestCard> = {
  b01: {
    id: "b01",
    number: "B01",
    title: "Hey, Get Down Here!",
    stars: 1,
    art: "/art/quest-b01.webp",
    fail: {
      value: 8,
      name: "It ran further up the tree!",
      text: "Lose 1 Luck.",
      effects: { luck: -1 },
    },
    success: {
      value: 11,
      name: "Hello, kitty!",
      text: "Gain 1 Luck.",
      effects: { luck: 1 },
    },
    special: {
      condition: { type: "exact", values: [1, 1, 1] },
      label: "1 · 1 · 1",
      name: "You fell out of the tree.",
      text: "Lose 1 Health.",
      effects: { health: -1 },
    },
  },
  b02: {
    id: "b02",
    number: "B02",
    title: "Let It Ride!",
    stars: 1,
    art: "/art/quest-b02.webp",
    fail: {
      value: 10,
      name: "Caught cheating!",
      text: "Lose 1 Money. Lose 1 Health.",
      effects: { money: -1, health: -1 },
    },
    success: {
      value: 14,
      name: "Got lucky!",
      text: "Gain 1 Money.",
      effects: { money: 1 },
    },
    special: {
      condition: { type: "pair" },
      label: "PAIR",
      name: "Someone dropped something!",
      text: "Gain 1 Money.",
      effects: { money: 1 },
    },
  },
  b03: {
    id: "b03",
    number: "B03",
    title: "Treasure? Here?",
    stars: 2,
    art: "/art/quest-b03.webp",
    fail: {
      value: 9,
      name: "Ack! It's a trap!",
      text: "Lose 2 Health.",
      effects: { health: -2 },
    },
    success: {
      value: 12,
      name: "It opened! What's inside?",
      text: "Gain 1 Item.",
      effects: { item: 1 },
    },
    special: {
      condition: { type: "pair" },
      label: "PAIR",
      name: "There's also money in here!",
      text: "Gain 1 Money.",
      effects: { money: 1 },
    },
  },
  b04: {
    id: "b04",
    number: "B04",
    title: "Looks... Edible.",
    stars: 2,
    art: "/art/quest-b04.webp",
    fail: {
      value: 6,
      name: "It's edible AND poisonous!",
      text: "Lose 2 Health.",
      effects: { health: -2 },
    },
    success: {
      value: 10,
      name: "It's edible AND delicious!",
      text: "Gain 1 Health.",
      effects: { health: 1 },
    },
    special: {
      condition: { type: "straight" },
      label: "STRAIGHT",
      name: "It's edible AND magical!",
      text: "Gain 1 Luck.",
      effects: { luck: 1 },
    },
  },
  b05: {
    id: "b05",
    number: "B05",
    title: "This Street Looks Busy...",
    stars: 2,
    art: "/art/quest-b05.webp",
    fail: {
      value: 4,
      name: "A car runs a red light!",
      text: "Lose 1 Health.",
      effects: { health: -1 },
    },
    success: {
      value: 8,
      name: '"Such a sweet young person."',
      text: "Gain 1 Luck.",
      effects: { luck: 1 },
    },
    special: {
      condition: { type: "pair" },
      label: "PAIR",
      name: "And grandma is rich!",
      text: "Gain 1 Money.",
      effects: { money: 1 },
    },
  },
  b06: {
    id: "b06",
    number: "B06",
    title: "An Orc? Here?!",
    stars: 3,
    art: "/art/quest-b06.webp",
    fail: {
      value: 10,
      name: "ORC SMASH!",
      text: "Lose 3 Health.",
      effects: { health: -3 },
    },
    success: {
      value: 13,
      name: "Admit it. You got lucky.",
      text: "Gain 1 Item.",
      effects: { item: 1 },
    },
    special: {
      condition: { type: "straight" },
      label: "STRAIGHT",
      name: "Very lucky.",
      text: "Gain 2 Money.",
      effects: { money: 2 },
    },
  },
  b07: {
    id: "b07",
    number: "B07",
    title: "Is This Actually Your Car?",
    stars: 2,
    art: "/art/quest-b07.webp",
    fail: {
      value: 9,
      name: "They run away. Police arrive.",
      text: "Lose 1 Luck.",
      effects: { luck: -1 },
    },
    success: {
      value: 12,
      name: "You help them unlock the car!",
      text: "Gain 1 Luck.",
      effects: { luck: 1 },
    },
    special: {
      condition: { type: "exact", values: [2, 3, 4] },
      label: "2 · 3 · 4",
      name: "This was indeed their car.",
      text: "Gain 2 Money.",
      effects: { money: 2 },
    },
  },
  b08: {
    id: "b08",
    number: "B08",
    title: "This Is Unprovoked!",
    stars: 2,
    art: "/art/quest-b08.webp",
    fail: {
      value: 10,
      name: "Furious swipes!",
      text: "Lose 1 Health.",
      effects: { health: -1 },
    },
    success: {
      value: 12,
      name: "The monster is felled!",
      text: "Gain 1 Item. Gain 1 Money.",
      effects: { item: 1, money: 1 },
    },
    special: {
      condition: { type: "pair" },
      label: "PAIR",
      name: "The monster had a wallet.",
      text: "Gain 1 Money.",
      effects: { money: 1 },
    },
  },
  b09: {
    id: "b09",
    number: "B09",
    title: "Evil... Ice Cream?!",
    stars: 3,
    art: "/art/quest-b09.webp",
    fail: {
      value: 10,
      name: "I'm lactose intolerant!",
      text: "Lose 1 Health.",
      effects: { health: -1 },
    },
    success: {
      value: 14,
      name: "Your favorite flavor: evil.",
      text: "Gain 2 Luck.",
      effects: { luck: 2 },
    },
    special: {
      condition: { type: "exact", values: [2] },
      label: "2",
      name: "Cherry on top!",
      text: "Gain 3 Money.",
      effects: { money: 3 },
    },
  },
  b10: {
    id: "b10",
    number: "B10",
    title: "I'll Protect You!",
    stars: 3,
    art: "/art/quest-b10.webp",
    fail: {
      value: 9,
      name: "The cape! It does nothing!",
      text: "Lose 2 Health.",
      effects: { health: -2 },
    },
    success: {
      value: 12,
      name: "The kitten is safe.",
      text: "Nothing.",
      effects: {},
    },
    special: {
      condition: { type: "exact", values: [6] },
      label: "6",
      name: "The kitten purrs.",
      text: "Gain 2 Luck.",
      effects: { luck: 2 },
    },
  },
};

export const ITEMS: Record<ItemId, ItemCard> = {
  b11: {
    id: "b11",
    number: "B11",
    name: "Fancy Pizza",
    effectText: "Discard this card. Gain 1 Health.",
    flavour:
      "Fancy Pizza, with all of its inedible gems and precious stones, is still more popular than pineapple.",
    art: "/art/item-b11.webp",
    effects: { health: 1 },
  },
  b12: {
    id: "b12",
    number: "B12",
    name: "Enchanted Spyglass",
    effectText: "Discard this card. Add 2 to the rolled dice result.",
    flavour:
      "Ordered this from a magic catalog. It cost 100 bubble gum wrappers. It was either this or one of those finger traps.",
    art: "/art/item-b12.webp",
    effects: { bonus: 2 },
  },
  b13: {
    id: "b13",
    number: "B13",
    name: "Robo-Fighter",
    effectText: "Discard this card. Gain 1 die to roll for this Quest only.",
    flavour: "WHAT WOULD A COMPUTER DO WITH A LIFETIME SUPPLY OF CHOCOLATE?",
    art: "/art/item-b13.webp",
    effects: { dice: 1 },
  },
  b14: {
    id: "b14",
    number: "B14",
    name: "Really Sturdy Box",
    effectText: "Discard this card. Negate 1 Damage done for this Quest only.",
    flavour:
      "It's, like, a really sturdy box. One of the best boxes I've ever seen. No joke.",
    art: "/art/item-b14.webp",
    effects: { shield: 1 },
  },
  b15: {
    id: "b15",
    number: "B15",
    name: "Cursed Trading Card",
    effectText: "Discard this card. Gain 2 Money. Lose 1 Health.",
    flavour:
      "Legend has it that this trading card, cherished by many collectors, is actually just a piece of cardboard.",
    art: "/art/item-b15.webp",
    effects: { money: 2, health: -1 },
  },
  b16: {
    id: "b16",
    number: "B16",
    name: "Stinky Potion",
    effectText: "Discard this card. Gain 1 Health. Gain 1 Luck.",
    flavour:
      "While a very powerful potion, the wizard that made it lacked a working nose.",
    art: "/art/item-b16.webp",
    effects: { health: 1, luck: 1 },
  },
};

export const QUEST_IDS = Object.keys(QUESTS) as QuestId[];
export const ITEM_IDS = Object.keys(ITEMS) as ItemId[];

export const STAR_GRADE = QUEST_IDS.reduce(
  (sum, id) => sum + QUESTS[id].stars,
  0,
);

export const ART = {
  backQuest: "/art/back-quest.webp",
  backItem: "/art/back-item.webp",
  shop: "/art/shop.webp",
} as const;

export const GRADES = [
  {
    title: "A perfect cup!",
    note: "Absolutely flawless. The barista bows as you leave.",
    min: STAR_GRADE,
  },
  {
    title: "Quite strong and bold!",
    note: "A mighty brew. A few grounds in the cup, but delicious.",
    min: STAR_GRADE - 5,
  },
  {
    title: "A good and decent brew.",
    note: "Worth hanging on the fridge. No notes.",
    min: STAR_GRADE - 10,
  },
  {
    title: "The coffee's cold, but not on purpose.",
    note: "Come back tomorrow. We will sort through the back for items.",
    min: -Infinity,
  },
] as const;
