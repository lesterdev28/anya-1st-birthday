/**
 * When and where. The countdown lives here too, since it is about the same moment.
 */
import { motion } from "framer-motion";
import { Countdown } from "./Countdown";
import { ParticleField } from "./ParticleField";
import { FairyImage } from "./FairyImage";
import { party } from "../data/party";
import "./Details.css";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 0.61, 0.36, 1] as const },
  },
};

export function Details() {
  return (
    <section className="details section" id="details">
      <ParticleField kind="sparkles" count={18} className="details__sparkles" />

      <motion.div
        className="section__inner"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
      >
        <p className="eyebrow">The celebration</p>
        <h2 className="section-title">A party in the kingdom</h2>
        <div className="rule" aria-hidden="true">
          <span />
        </div>

        <dl className="details__grid">
          <div className="details__item">
            <dt>When</dt>
            <dd>
              <span className="details__strong">{party.dayLabel}</span>
              <span>{party.dateLabel}</span>
              <span>{party.timeLabel}</span>
            </dd>
          </div>

          <div className="details__item">
            <dt>Where</dt>
            <dd>
              <span className="details__strong">{party.venue}</span>
              <a
                className="details__map"
                href={`https://maps.google.com/?q=${encodeURIComponent(party.venue)}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                Open in maps
              </a>
            </dd>
          </div>
        </dl>

        <Countdown target={party.startsAt} />
      </motion.div>

      {/* A soft band of the kingdom's silhouette closes the section. */}
      <FairyImage
        id="castle-silhouette"
        alt=""
        className="details__silhouette"
        sizes="100vw"
        fallback={null}
      />
    </section>
  );
}
