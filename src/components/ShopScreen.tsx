import { ITEMS, ART } from "../game/data";
import { ITEM_CAP, type GameState, type ItemId } from "../game/types";
import { ItemCard } from "./ItemCard";
import { Die } from "./Die";
import {
  IconArrow,
  IconBag,
  IconCoin,
  IconCup,
  IconShop,
  IconStar,
} from "./Icons";

interface ShopScreenProps {
  state: GameState;
  onBuy: (index: number) => void;
  onLeave: () => void;
}

export function ShopScreen({ state, onBuy, onLeave }: ShopScreenProps) {
  const shop = state.shop;
  if (!shop) return null;
  const full = state.player.items.length >= ITEM_CAP;

  return (
    <div className="shop-screen">
      <header className="shop-hero">
        <div className="shop-hero__art" aria-hidden>
          <img src={ART.shop} alt="" />
        </div>
        <div className="shop-hero__copy">
          <p className="eyebrow">
            Intermission · the shop <span className="eyebrow__spark">✦</span>
          </p>
          <h1>Spend it while it&apos;s hot.</h1>
          <p>
            Three items, three dice-rolled prices. Buy what you can carry, then
            head back out for the final five quests.
          </p>
          <div className="shop-hero__meta">
            <span className="shop-money">
              <IconCoin /> {state.player.money} Money
            </span>
            <span className={`shop-bag ${full ? "is-full" : ""}`}>
              <IconBag /> {state.player.items.length}/{ITEM_CAP} satchel
            </span>
          </div>
        </div>
        <div className="shop-hero__sign">
          <IconShop />
          <span>Open</span>
        </div>
      </header>

      <div className="shop-layout">
        <div className="shop-grid">
          {shop.items.map((item, index) => {
            const price = shop.prices[index];
            const sold = shop.sold[index];
            const affordable = state.player.money >= price;
            const disabled = !item || sold || !affordable || full;
            return (
              <article
                key={`${item ?? "empty"}-${index}`}
                className={`shop-slot ${sold ? "is-sold" : ""}`}
                style={{ "--delay": `${index * 80}ms` } as React.CSSProperties}
              >
                <div className="shop-slot__price">
                  <Die value={price} size="md" tone="gold" />
                  <span>{price} Money</span>
                </div>
                {item ? (
                  <ItemCard itemId={item} variant="shop" showFlavour />
                ) : (
                  <div className="shop-slot__empty">
                    <IconCup />
                    <strong>Sold out</strong>
                    <span>The deck ran dry.</span>
                  </div>
                )}
                {sold && <span className="sold-stamp">Sold</span>}
                <button
                  type="button"
                  className="btn btn--primary btn--block"
                  disabled={disabled}
                  onClick={() => onBuy(index)}
                >
                  {sold ? (
                    "Sold"
                  ) : !item ? (
                    "Nothing here"
                  ) : full ? (
                    "Satchel full"
                  ) : !affordable ? (
                    `Need ${price - state.player.money} more`
                  ) : (
                    <>
                      Buy for {price} <IconCoin />
                    </>
                  )}
                </button>
              </article>
            );
          })}
        </div>

        <aside className="shop-side">
          <section className="paper-panel shop-satchel">
            <header>
              <h3>
                Your satchel{" "}
                <span>
                  {state.player.items.length}/{ITEM_CAP}
                </span>
              </h3>
              <p>Three items max. Make them count.</p>
            </header>
            <div className="shop-satchel__list">
              {state.player.items.length === 0 && (
                <p className="shop-satchel__empty">
                  Nothing but lint and ambition.
                </p>
              )}
              {state.player.items.map((item: ItemId, index: number) => (
                <div key={`${item}-${index}`} className="shop-satchel__item">
                  <img src={ITEMS[item].art} alt="" />
                  <div>
                    <strong>{ITEMS[item].name}</strong>
                    <span>{ITEMS[item].effectText}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="paper-panel shop-prices">
            <h3>Today&apos;s prices</h3>
            <p>The shopkeeper rolls 3d6 and does not take questions.</p>
            <div className="shop-prices__dice">
              {shop.prices.map((price, i) => (
                <span key={i} className={shop.sold[i] ? "is-sold" : ""}>
                  <Die value={price} size="sm" />
                  <small>Item {i + 1}</small>
                </span>
              ))}
            </div>
            <div className="shop-prices__note">
              <IconStar /> Unbought items return to the deck.
            </div>
          </section>

          <button
            type="button"
            className="btn btn--primary btn--leave"
            onClick={onLeave}
          >
            <span>
              Leave the shop
              <small>Round 2 · five new quests</small>
            </span>
            <IconArrow />
          </button>
        </aside>
      </div>

      <footer className="shop-foot">
        <span>
          Money is capped at 10. Unspent coins do not count toward your score.
        </span>
        <span>
          <IconCup /> Take a breath. The last five quests are waiting.
        </span>
      </footer>
    </div>
  );
}
