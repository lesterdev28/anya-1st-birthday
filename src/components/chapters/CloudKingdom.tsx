/**
 * Chapter one: the cloud kingdom the guest arrives in.
 *
 * Eight planes stacked front to back, exactly as the brief lays them out: the sky (which
 * belongs to the whole page and is behind everything), distant cloud, stars, mid cloud,
 * petals, the typography, and then a bank of foreground cloud *in front of* the words.
 * That last one is what sells the depth — type with nothing over it always reads as an
 * overlay, and type with a cloud drifting across it reads as being inside the scene.
 *
 * Scrolling away from here is written as a descent: the name grows and softens as though
 * the camera were moving toward and then past it, the words fade, and the foreground
 * clouds draw apart to either side to let the guest through into the meadow below.
 *
 * Behind all of it sits the painted kingdom itself — the one piece of generated artwork
 * the invitation uses, masked top and bottom so it has no edges and the page's own sky
 * simply becomes it. Everything in front is still drawn in CSS, so the clouds that pass
 * over the castle are the same clouds that carry on through the rest of the journey.
 */
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { Chapter, useChapterScroll } from "../../lib/scene";
import { responsiveImage } from "../../lib/assets";
import { CloudBand, CloudLayer } from "../world/Clouds";
import { Drifters } from "../world/Drifters";
import { Butterflies } from "../world/Butterflies";
import { PaintedClouds } from "../world/PaintedClouds";
import { child, party, story } from "../../data/party";
import "./CloudKingdom.css";

interface Props {
  /** Called by the CTA: unlocks audio and carries the guest into the next chapter. */
  readonly onEnter: () => void;
}

export function CloudKingdom({ onEnter }: Props) {
  return (
    <Chapter scene="intro" id="top" className="kingdom" label="Anya is turning one">
      <KingdomScene onEnter={onEnter} />
    </Chapter>
  );
}

function KingdomScene({ onEnter }: Props) {
  const { progress, inChapter } = useChapterScroll();
  const reduceMotion = useReducedMotion();

  /*
   * This chapter sits at the very top of the page, so it is already halfway through its
   * own enter-to-leave range before the guest has scrolled at all. Every transform below
   * is therefore keyed to the second half of that range — 0.5 is "untouched".
   */
  const nameScale = useTransform(progress, [0.5, 1], [1, 1.45]);
  /* The deepest layer, so it moves least — a long way off rather than a backdrop. */
  const vistaRise = useTransform(progress, [0.5, 1], ["0%", "-7%"]);
  const vistaZoom = useTransform(progress, [0.5, 1], [1, 1.1]);
  const nameFilter = useTransform(progress, [0.5, 1], ["blur(0px)", "blur(7px)"]);
  const copyFade = useTransform(progress, [0.5, 0.86], [1, 0]);
  const starsRise = useTransform(progress, [0.5, 1], ["0%", "-38%"]);
  const partLeft = useTransform(progress, [0.5, 1], ["0%", "-46%"]);
  const partRight = useTransform(progress, [0.5, 1], ["0%", "46%"]);

  const still = reduceMotion || !inChapter;

  const vista = responsiveImage("fairytale-castle-hero-mobile");

  return (
    <>
      {vista && (
        <motion.div
          className="kingdom__vista"
          aria-hidden="true"
          style={still ? undefined : { y: vistaRise, scale: vistaZoom }}
        >
          <picture>
            <source type="image/avif" srcSet={vista.avifSrcSet} sizes="100vw" />
            <img src={vista.src} srcSet={vista.srcSet} sizes="100vw" alt="" decoding="async" />
          </picture>
        </motion.div>
      )}

      <CloudLayer depth="far" count={4} seed={2} className="kingdom__clouds kingdom__clouds--far" />

      <motion.div className="kingdom__stars" style={still ? undefined : { y: starsRise }}>
        <Drifters kind="stars" count={30} />
      </motion.div>

      <CloudLayer depth="mid" count={3} seed={4} className="kingdom__clouds kingdom__clouds--mid" />

      <Drifters kind="petals" count={14} className="kingdom__petals" />
      <Butterflies count={5} seed={9} className="kingdom__butterflies" />

      <motion.div className="kingdom__copy" style={still ? undefined : { opacity: copyFade }}>
        <motion.p
          className="script kingdom__once"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
        >
          {story.once}
        </motion.p>

        <motion.h1
          className="kingdom__name"
          style={still ? undefined : { scale: nameScale, filter: nameFilter }}
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {child.name}
        </motion.h1>

        <motion.p
          className="kingdom__turning"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.95, ease: "easeOut" }}
        >
          is turning <span className="kingdom__one">{child.turning}</span>
        </motion.p>

        <motion.p
          className="kingdom__invite"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.3, delay: 1.25 }}
        >
          {story.comeCelebrate}
        </motion.p>

        <motion.p
          className="kingdom__when"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.3, delay: 1.45 }}
        >
          {party.dayLabel}, {party.dateLabel}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.7, ease: "easeOut" }}
        >
          <button type="button" className="enter" onClick={onEnter}>
            <span className="enter__label">Enter {child.name}&rsquo;s Fairy Garden</span>
            <span className="enter__sparkles" aria-hidden="true">
              {Array.from({ length: 7 }, (_, index) => (
                <i key={index} style={{ "--i": index } as React.CSSProperties} />
              ))}
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/*
        In front of the words. These are the doors: they sit closed across the lower
        screen and draw apart as the guest scrolls down through them.
      */}
      <div className="kingdom__gate" aria-hidden="true">
        <motion.div className="kingdom__gate-half" style={still ? undefined : { x: partLeft }}>
          <CloudBand depth="near" count={4} seed={61} />
          <PaintedClouds count={3} columns={3} seed={5} spread={54} className="kingdom__gate-art" />
        </motion.div>
        <motion.div
          className="kingdom__gate-half kingdom__gate-half--right"
          style={still ? undefined : { x: partRight }}
        >
          <CloudBand depth="near" count={4} seed={73} />
          <PaintedClouds count={3} columns={3} seed={17} spread={54} mirror className="kingdom__gate-art" />
        </motion.div>
      </div>
    </>
  );
}
