/**
 * The twelfth month, which is the top of the story.
 *
 * There is no photograph for month twelve and there is not going to be one, so this is
 * written as the moment the year adds up rather than as another picture: the clouds that
 * have been drifting all the way down the page draw apart, the light rises, and what is
 * behind them is the count of the days themselves, ticking up as the guest scrolls.
 *
 * Counting on scroll rather than on a timer is the point — the guest is the one moving
 * through her year, so the number should answer to their thumb.
 */
import { useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";
import { Chapter, useChapterScroll } from "../../lib/scene";
import { CloudBand } from "../world/Clouds";
import { Drifters } from "../world/Drifters";
import { Butterflies } from "../world/Butterflies";
import { Reveal } from "../world/Reveal";
import { GoldCrown } from "../GoldCrown";
import { monthChapters, story } from "../../data/party";
import "./YearClimax.css";

/** The chapter the data file marks as the finale of the year. */
const twelfth = monthChapters[monthChapters.length - 1];

export function YearClimax() {
  return (
    <Chapter scene="month-12" className="climax" label={`${twelfth.title}: ${twelfth.caption}`}>
      <ClimaxScene />
    </Chapter>
  );
}

function ClimaxScene() {
  const { progress, inChapter } = useChapterScroll();
  const reduceMotion = useReducedMotion();
  const still = reduceMotion || !inChapter;

  const days = useTransform(progress, [0.2, 0.62], [0, 365]);
  const [shown, setShown] = useState(0);
  useMotionValueEvent(days, "change", (value) => {
    const rounded = Math.round(value);
    setShown((current) => (current === rounded ? current : rounded));
  });

  /* The two banks of cloud, closed across the middle and parting as the guest arrives. */
  const partLeft = useTransform(progress, [0.18, 0.6], ["0%", "-78%"]);
  const partRight = useTransform(progress, [0.18, 0.6], ["0%", "78%"]);
  const lightUp = useTransform(progress, [0.2, 0.62], [0, 1]);
  const dustRise = useTransform(progress, [0.2, 1], ["18%", "-22%"]);

  return (
    <>
      <motion.div className="climax__light" style={still ? undefined : { opacity: lightUp }} />

      <motion.div className="climax__dust" style={still ? undefined : { y: dustRise }}>
        <Drifters kind="dust" count={34} />
      </motion.div>

      {/* Outside the dust layer, which parallaxes — a butterfly flies its own path. */}
      <Butterflies count={5} seed={37} className="climax__butterflies" />

      <div className="climax__inner">
        <Reveal className="climax__crown" y={-14} amount={0.5}>
          <GoldCrown />
        </Reveal>

        <p className="climax__count">
          <span className="climax__number gilt">{reduceMotion ? 365 : shown}</span>
          <span className="climax__unit">{story.climaxCount.replace(/^365\s*/, "")}</span>
        </p>

        <Reveal as="p" className="script climax__onward" delay={0.1} amount={0.5}>
          {story.climaxOnward}
        </Reveal>

        <Reveal as="p" className="climax__celebrate" delay={0.25} amount={0.5}>
          {story.climaxCelebrate}
        </Reveal>
      </div>

      {/* In front of the words, and travelling outward: the year opening up. */}
      <div className="climax__gate" aria-hidden="true">
        <motion.div className="climax__gate-half" style={still ? undefined : { x: partLeft }}>
          <CloudBand depth="near" count={5} seed={31} />
        </motion.div>
        <motion.div
          className="climax__gate-half climax__gate-half--right"
          style={still ? undefined : { x: partRight }}
        >
          <CloudBand depth="near" count={5} seed={47} />
        </motion.div>
      </div>
    </>
  );
}
