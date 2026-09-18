/**
 * The hero: the generated kingdom artwork with the invitation's headline typography
 * laid over it in HTML, never baked into the image.
 *
 * Two art assets back this — a 9:16 mobile version and a 16:9 desktop one — chosen by a
 * <picture>-style media query rather than by JavaScript, so the right one is fetched
 * first time. Both are composed with empty sky through the centre, which is exactly
 * where this typography sits.
 */
import { motion } from "framer-motion";
import { FairyImage } from "./FairyImage";
import { PaintedKingdom } from "./PaintedKingdom";
import { ParticleField } from "./ParticleField";
import { GoldCrown } from "./GoldCrown";
import { child, party } from "../data/party";
import { hasAsset } from "../lib/assets";
import "./Hero.css";

const rise = {
  hidden: { opacity: 0, y: 26 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: [0.22, 0.61, 0.36, 1] as const },
  }),
};

export function Hero() {
  // The desktop crop only exists once generated; on its own the mobile one stretches
  // badly on a wide screen, so fall back to the painted scene there instead.
  const hasDesktopArt = hasAsset("fairytale-castle-hero-desktop");
  const hasMobileArt = hasAsset("fairytale-castle-hero-mobile");

  return (
    <header className="hero" id="top">
      <div className="hero__art">
        {hasMobileArt && (
          <FairyImage
            id="fairytale-castle-hero-mobile"
            alt="An enchanted pastel castle above rolling hills, with clouds, flowers and floating golden stars"
            className="hero__art-mobile"
            priority
            sizes="100vw"
          />
        )}
        {hasDesktopArt && (
          <FairyImage
            id="fairytale-castle-hero-desktop"
            alt=""
            className="hero__art-desktop"
            priority
            sizes="100vw"
          />
        )}
        {!hasMobileArt && !hasDesktopArt && <PaintedKingdom />}
      </div>

      <ParticleField kind="stars" count={34} className="hero__stars" />
      <ParticleField kind="fireflies" count={20} className="hero__fireflies" />

      <div className="hero__scrim" aria-hidden="true" />

      <div className="hero__content">
        <motion.p
          className="hero__eyebrow"
          variants={rise}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          You&rsquo;re invited to celebrate
        </motion.p>

        <motion.h1
          className="hero__name"
          variants={rise}
          initial="hidden"
          animate="visible"
          custom={0.4}
        >
          {child.name}
        </motion.h1>

        <motion.div
          className="hero__rule"
          variants={rise}
          initial="hidden"
          animate="visible"
          custom={0.6}
        >
          <span />
          <GoldCrown className="hero__rule-crown" />
          <span />
        </motion.div>

        <motion.p
          className="hero__turning"
          variants={rise}
          initial="hidden"
          animate="visible"
          custom={0.7}
        >
          is turning
        </motion.p>

        <motion.p
          className="hero__one"
          variants={rise}
          initial="hidden"
          animate="visible"
          custom={0.85}
        >
          {child.turning}
        </motion.p>

        <motion.p
          className="hero__when"
          variants={rise}
          initial="hidden"
          animate="visible"
          custom={1.05}
        >
          {party.dayLabel}, {party.dateLabel}
        </motion.p>
      </div>

      <a className="hero__scroll" href="#details" aria-label="See the party details">
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>
    </header>
  );
}
