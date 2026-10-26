import { Modal } from "./Modal";
import {
  IconCheck,
  IconClover,
  IconCoin,
  IconCup,
  IconDice,
  IconHeart,
  IconShop,
  IconSkull,
  IconSparkle,
  IconStar,
} from "./Icons";

interface RulesModalProps {
  open: boolean;
  onClose: () => void;
}

export function RulesModal({ open, onClose }: RulesModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Quests Over Coffee · Base set"
      title="How to play"
      wide
      footer={
        <button type="button" className="btn btn--primary" onClick={onClose}>
          Back to the table
        </button>
      }
    >
      <div className="rules">
        <section className="rules__intro">
          <p>
            A solo coffee-break adventure for one player. You have ten quests,
            three dice, a little luck, and an item or two. Resolve five quests,
            visit the shop, resolve five more, then add up your stars.
          </p>
        </section>

        <section className="rules__block">
          <h3>
            <IconCup /> The goal
          </h3>
          <p>
            Keep quests by succeeding. At the end, score{" "}
            <strong>1 VP per star</strong> on every kept quest and{" "}
            <strong>−1 VP per failed quest</strong>. Abandoned quests score
            nothing. If your Health reaches 0 at any point, you are defeated and
            your final score is 0.
          </p>
        </section>

        <section className="rules__block">
          <h3>
            <IconDice /> Resolving a quest
          </h3>
          <ol>
            <li>Choose any face-up quest.</li>
            <li>Roll 3d6 as your base roll.</li>
            <li>
              Total at or below the <strong>Fail</strong> value: the fail event
              occurs and the quest is discarded.
            </li>
            <li>
              Total at or above the <strong>Success</strong> value: the success
              event occurs and you keep the card for scoring.
            </li>
            <li>Anything in between: the quest is abandoned with no event.</li>
            <li>
              If your final dice satisfy the <strong>Special</strong> condition,
              that event also occurs — even if the quest failed or was
              abandoned.
            </li>
          </ol>
        </section>

        <div className="rules__cols">
          <section className="rules__block">
            <h3>
              <IconClover /> Luck
            </h3>
            <p>
              Spend 1 Luck to reroll <em>any number</em> of dice once. You can
              do this as many times as you have Luck. Select dice by tapping
              them, then reroll.
            </p>
          </section>
          <section className="rules__block">
            <h3>
              <IconCoin /> Paying for help
            </h3>
            <p>
              Spend Money equal to the quest&apos;s stars to add one extra d6.
              (A 2-star quest costs 2 Money per die.) Maximum 3 extra dice per
              quest. Extra dice can be rerolled with Luck too.
            </p>
          </section>
          <section className="rules__block">
            <h3>
              <IconStar /> Items
            </h3>
            <p>
              Carry up to 3 items. Use them during a quest, then discard to the
              bottom of the item deck. Some add dice, some add to the total,
              some heal you mid-fight.
            </p>
          </section>
          <section className="rules__block">
            <h3>
              <IconShop /> The shop
            </h3>
            <p>
              After the first five quests, the shop opens. Roll 3d6 for prices,
              deal three items, and buy what you can afford. Unbought items
              return to the deck. Then the final five quests begin.
            </p>
          </section>
        </div>

        <section className="rules__block">
          <h3>
            <IconSparkle /> Special conditions
          </h3>
          <ul className="rules__conditions">
            <li>
              <span className="tag">PAIR</span> At least two dice show the same
              value.
            </li>
            <li>
              <span className="tag">STRAIGHT</span> At least three dice form a
              sequential run (for example 2 · 3 · 4).
            </li>
            <li>
              <span className="tag">2 · 3 · 4</span> The dice must include those
              exact values.
            </li>
            <li>
              <span className="tag">6</span> At least one die shows the listed
              number.
            </li>
          </ul>
        </section>

        <section className="rules__block rules__grade">
          <h3>
            <IconHeart /> Final grading
          </h3>
          <p>
            The <strong>Star Grade</strong> is every star in the ten-quest deck
            (21 in the base set). Compare your final score to it:
          </p>
          <table>
            <thead>
              <tr>
                <th>Your score</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Star Grade or more</td>
                <td>A perfect cup!</td>
              </tr>
              <tr>
                <td>Within 5 VP</td>
                <td>Quite strong and bold!</td>
              </tr>
              <tr>
                <td>Within 6–10 VP</td>
                <td>A good and decent brew.</td>
              </tr>
              <tr>
                <td>11+ VP away</td>
                <td>The coffee&apos;s cold, but not on purpose.</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="rules__block rules__credits">
          <h3>
            <IconSkull /> Credits &amp; adaptation
          </h3>
          <p>
            <strong>Quests Over Coffee</strong> is a game by Alexander Shen
            (alexandershen.com, @shenbotmakes). Base rules v2.1.0. This is a
            fan-made web adaptation of the solo base set. All illustrations come
            from the base set cards. The optional Environment and Companion
            decks are not included here.
          </p>
        </section>

        <p className="rules__footer-note">
          <IconCheck /> Tip: special conditions use the final dice you keep, not
          the spyglass bonus.
        </p>
      </div>
    </Modal>
  );
}
