/**
 * The way in: a bank of cloud lying closed across the screen, which draws apart.
 *
 * The loading screen holds a night sky over everything while the fonts settle. When it
 * lifts, this is what is underneath — not the kingdom yet, but the weather in front of
 * it. The two banks part to either side and the kingdom is behind them, which is the
 * arrival the whole first chapter is written around: the guest does not load a page,
 * they come up through the clouds.
 *
 * It runs once and then removes itself. Nothing on the page can be reached through it
 * in the meantime, and nothing about the page depends on it: if the artwork has not been
 * built, `PaintedClouds` renders nothing and the kingdom is simply there.
 */
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PaintedClouds } from "./world/PaintedClouds";
import { HOLD_MS } from "./Loader";
import "./CloudOpening.css";

/** Begun just as the loading screen starts to dissolve, so the two read as one move. */
const PART_AFTER_MS = HOLD_MS + 250;
const PART_SECONDS = 2.4;

export function CloudOpening() {
  const reduceMotion = useReducedMotion();
  const [parting, setParting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setDone(true);
      return;
    }
    const timer = window.setTimeout(() => setParting(true), PART_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  if (done) return null;

  /*
   * The banks do not slide off the screen; they thin out and go. Cloud that stays solid
   * all the way to the edge reads as two doors being pulled, and the moment it passes the
   * edge there is a hard line where the last of it was. Fading it out over the second
   * half of the move means the kingdom is arriving through cloud that is dissolving,
   * which is the only way cloud has ever cleared.
   */
  const travel = {
    x: { duration: PART_SECONDS, ease: [0.32, 0, 0.16, 1] as const },
    opacity: { duration: PART_SECONDS * 0.62, delay: PART_SECONDS * 0.3, ease: "easeInOut" as const },
  };

  return (
    <div className="opening" aria-hidden="true">
      <motion.div
        className="opening__half"
        initial={{ x: "0%", opacity: 1 }}
        animate={{ x: parting ? "-86%" : "0%", opacity: parting ? 0 : 1 }}
        transition={travel}
      >
        <PaintedClouds count={9} seed={5} spread={132} />
      </motion.div>

      <motion.div
        className="opening__half opening__half--right"
        initial={{ x: "0%", opacity: 1 }}
        animate={{ x: parting ? "86%" : "0%", opacity: parting ? 0 : 1 }}
        transition={travel}
        onAnimationComplete={() => parting && setDone(true)}
      >
        <PaintedClouds count={9} seed={17} spread={132} mirror />
      </motion.div>
    </div>
  );
}
