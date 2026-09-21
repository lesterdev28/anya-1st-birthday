/**
 * The invitation's first screen after the intro: the generated kingdom, with the
 * name and date set over the open sky the artwork deliberately leaves empty.
 *
 * The art direction asks for that negative space in the upper half, so the typography
 * sits there and the castle stays clear underneath it. If the artwork has not been
 * generated the painted kingdom takes its place and the layout does not change.
 */
import { motion } from "framer-motion";
import { FairyImage } from "./FairyImage";
import { PaintedKingdom } from "./PaintedKingdom";
import { ParticleField } from "./ParticleField";
import { GoldCrown } from "./GoldCrown";
import { hasAsset } from "../lib/assets";
import { child, party } from "../data/party";
import "./Hero.css";

/** Whether the wide desktop artwork exists yet; decided once, not per render. */
const hasWideArt = hasAsset("fairytale-castle-hero-desktop");

const rise = {
  hidden: { opacity: 0, y: 20 },
  shown: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <header className="hero">
      <div className="hero__art" aria-hidden="true">
        {/*
          Mobile-first: the vertical artwork is what most guests see. The wide version
          only replaces it on large screens, and only when it has actually been
          generated — otherwise the portrait art is stretched to cover, which is far
          better than the blank hero a CSS-only swap would leave behind.
        */}
        <FairyImage
          id="fairytale-castle-hero-mobile"
          alt=""
          priority
          sizes="100vw"
          className={`hero__art-image${hasWideArt ? " hero__art-image--portrait" : ""}`}
          fallback={<PaintedKingdom />}
        />
        {hasWideArt && (
          <FairyImage
            id="fairytale-castle-hero-desktop"
            alt=""
            priority
            sizes="100vw"
            className="hero__art-image hero__art-image--landscape"
          />
        )}
        <ParticleField kind="fireflies" count={16} className="hero__fireflies" />
      </div>

      <div className="hero__scrim" aria-hidden="true" />

      <motion.div
        className="hero__copy"
        initial="hidden"
        animate="shown"
        transition={{ staggerChildren: 0.16, delayChildren: 0.2 }}
      >
        <motion.p className="hero__eyebrow" variants={rise} transition={{ duration: 0.9 }}>
          You&rsquo;re Invited
        </motion.p>

        <motion.div className="hero__crown" variants={rise} transition={{ duration: 0.9 }}>
          <GoldCrown />
        </motion.div>

        <motion.h1 className="hero__name" variants={rise} transition={{ duration: 0.9 }}>
          {child.name}
        </motion.h1>

        <motion.p className="hero__turning" variants={rise} transition={{ duration: 0.9 }}>
          is turning <span className="hero__one">{child.turning}</span>
        </motion.p>

        <motion.div className="hero__rule" variants={rise} transition={{ duration: 0.9 }}>
          <span className="rule">
            <span />
          </span>
        </motion.div>

        <motion.p className="hero__when" variants={rise} transition={{ duration: 0.9 }}>
          {party.dayLabel}, {party.dateLabel}
          <br />
          {party.venue}
        </motion.p>
      </motion.div>

      <a className="hero__scroll" href="#story">
        <span className="visually-hidden">Scroll to the invitation</span>
        <span className="hero__scroll-dot" aria-hidden="true" />
      </a>
    </header>
  );
}
