# Quests Over Coffee — web edition

A snappy, single-player web adaptation of **Quests Over Coffee** (base set, rules v2.1.0) built with React, TypeScript, and Vite.

Roll 3d6, bluff your way through ten tiny quests, spend Luck and Money like they are going out of style, and see whether your adventure grades as a perfect cup or gas-station coffee.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build      # type-check + production build into dist/
npm run preview    # preview the production build
npm test           # rules-engine tests (31 cases)
```

## What is implemented

- Full solo base-set loop: draft an item, resolve five quests, visit the shop, resolve five more, then final scoring.
- All ten base-set Quest cards, with their exact fail/success values and events.
- All six base-set Item cards.
- **Luck** rerolls any number of selected dice.
- **Paying for help**: spend money equal to a quest's stars for one extra d6, up to 3 extra dice per quest.
- **Special conditions**: `PAIR`, `STRAIGHT`, exact dice values, and stat-based conditions. Specials fire even on failed or abandoned quests.
- **Items**: health, luck, money, +2 to a roll, extra dice, damage shields, and the Cursed Trading Card's very fair downside.
- Shop setup with 3d6 prices, purchases, and unbought items returning to the deck.
- Health, Luck, and Money caps; satchel limit of 3; loot swaps when your hands are full.
- Final scoring and the official four coffee grades. Zero Health ends the run at a score of 0.
- Autosave to `localStorage`, with a Continue option on the title screen.
- Sound effects generated in the browser with Web Audio (toggleable), keyboard-friendly controls, responsive layout, and reduced-motion support.

The optional Environment and Companion decks, the two-player variant, and the Quest Board variant are not included. This is the solo base-set experience.

## Controls

- Click any quest card to begin it.
- Click dice to select them for a Luck reroll, or use **Select all**.
- Items can be used at any point before resolving a quest by pressing **Use**.
- Everything resolves with **Resolve quest**; there is no take-backs in a coffee shop.

## Project structure

```
src/
  game/
    data.ts          # cards, effects, art paths, grade table
    engine.ts        # pure seeded reducer: dice, quests, shop, scoring
    types.ts         # state and card types
  components/        # screens and reusable pieces
  sound.ts           # tiny Web Audio sound effects
  styles.css         # the whole visual system
public/art/          # card art from the base set
scripts/
  engine.test.ts     # rules-engine tests (run with tsx)
```

The game state is a serializable reducer with a seeded RNG, so tests can reproduce dice and shuffles. The UI is plain React + CSS: no animation library, no state library, no runtime dependencies beyond React and bundled fonts.

## Credits

**Quests Over Coffee** is a game by **Alexander Shen** ([alexandershen.com](https://alexandershen.com), [@shenbotmakes](https://twitter.com/shenbotmakes)). Base rules v2.1.0. All illustrations and card designs are from the base set. This is an unofficial fan-made web adaptation; support the original game and its creator.

Fonts: Fraunces and Work Sans via Fontsource.
