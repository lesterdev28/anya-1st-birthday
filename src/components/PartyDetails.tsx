/**
 * When and where. Deliberately the plainest section on the page: this is the part a
 * guest comes back to check on the morning of the party, so it is the one place that
 * chooses legibility over atmosphere.
 */
import { motion } from "framer-motion";
import { FairyImage } from "./FairyImage";
import { party } from "../data/party";
import "./PartyDetails.css";

export function PartyDetails() {
  return (
    <section className="section details" id="details" aria-labelledby="details-title">
      <div className="section__inner">
        <p className="eyebrow">The celebration</p>
        <h2 className="section-title" id="details-title">
          Where the story happens
        </h2>
        <span className="rule">
          <span />
        </span>

        <motion.dl
          className="details__list"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div className="details__row">
            <dt>When</dt>
            <dd>
              {party.dayLabel}, {party.dateLabel}
              <br />
              {party.timeLabel}
            </dd>
          </div>

          <div className="details__row">
            <dt>Where</dt>
            <dd>{party.venue}</dd>
          </div>

          <div className="details__row">
            <dt>Dress</dt>
            <dd>Pastels, if you like. Comfortable, always.</dd>
          </div>
        </motion.dl>

        <FairyImage
          id="gold-ornamental-border"
          alt=""
          sizes="(min-width: 700px) 480px, 80vw"
          className="details__flourish"
        />
      </div>
    </section>
  );
}
