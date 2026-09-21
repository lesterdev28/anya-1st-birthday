/**
 * The invitation's first screen after the intro: the generated kingdom, with Anya's
 * portrait and the party details set over the open sky the artwork deliberately leaves
 * empty.
 *
 * The art direction asks for that negative space in the upper half, so the typography
 * sits there and the castle stays clear underneath it. If the artwork has not been
 * generated the painted kingdom takes its place and the layout does not change.
 *
 * On a wide screen the invitation is a portrait panel standing in the middle of a
 * blurred wash of its own artwork, rather than the 9:16 painting stretched edge to edge.
 * Stretched, the castle fills the window and the composition the art was built around is
 * lost; held at its own shape, a desktop visitor sees the same picture a guest on a
 * phone does.
 *
 * The background is never still. A slow drift across the artwork and a parallax offset
 * as the page scrolls are what stop a single generated image from reading as a
 * wallpaper; both stop dead under `prefers-reduced-motion`.
 */
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FairyImage } from "./FairyImage";
import { PaintedKingdom } from "./PaintedKingdom";
import { ParticleField } from "./ParticleField";
import { PortraitMedallion } from "./PortraitMedallion";
import { hasAsset } from "../lib/assets";
import { child, party } from "../data/party";
import "./Hero.css";

/**
 * The wash behind the panel on wide screens. The wide artwork suits it better when it
 * exists, but it is only ever seen blurred, so the portrait art stands in perfectly
 * well until then. Decided once, not per render.
 */
const BACKDROP_ID = hasAsset("fairytale-castle-hero-desktop")
  ? "fairytale-castle-hero-desktop"
  : "fairytale-castle-hero-mobile";

/** Whether a photograph is available for the locket. */
const hasPortrait = hasAsset(child.heroPortrait);

const rise = {
  hidden: { opacity: 0, y: 20 },
  shown: { opacity: 1, y: 0 },
};

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Measured against this section rather than the page, so the effect is the hero's own.
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });

  // The art lags the page and the copy leads it. Parting the two layers as the screen
  // scrolls away is what gives a flat illustration its sense of depth.
  const artY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const copyFade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <header className="hero" ref={section}>
      {/* Only ever visible on wide screens; hidden entirely on a phone. */}
      <div className="hero__backdrop" aria-hidden="true">
        <FairyImage id={BACKDROP_ID} alt="" priority sizes="100vw" className="hero__backdrop-art" />
      </div>

      <div className="hero__stage">
        <motion.div
          className="hero__art"
          aria-hidden="true"
          style={reduceMotion ? undefined : { y: artY }}
        >
          <FairyImage
            id="fairytale-castle-hero-mobile"
            alt=""
            priority
            sizes="(min-width: 900px) 30rem, 100vw"
            className="hero__art-image"
            fallback={<PaintedKingdom />}
          />

          {/* Mist across the valley and a bloom over the sunrise, both slowly moving. */}
          <div className="hero__mist" />
          <div className="hero__bloom" />

          <ParticleField kind="fireflies" count={16} className="hero__fireflies" />
        </motion.div>

        <div className="hero__scrim" aria-hidden="true" />

        <motion.div
          className="hero__copy"
          initial="hidden"
          animate="shown"
          transition={{ staggerChildren: 0.16, delayChildren: 0.2 }}
          style={reduceMotion ? undefined : { y: copyY, opacity: copyFade }}
        >
          <motion.p className="hero__eyebrow" variants={rise} transition={{ duration: 0.9 }}>
            You&rsquo;re Invited
          </motion.p>

          {hasPortrait && (
            <motion.div variants={rise} transition={{ duration: 0.9 }}>
              <PortraitMedallion
                photoId={child.heroPortrait}
                alt={`${child.name}, who is turning one`}
                className="hero__medallion"
              />
            </motion.div>
          )}

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
      </div>
    </header>
  );
}
