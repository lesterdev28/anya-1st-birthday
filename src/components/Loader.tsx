/**
 * The moment before the journey starts.
 *
 * Its real job is to hide the half-second in which the fonts swap and the first chapter
 * lays itself out — the cloud kingdom opening on a flash of unstyled type would undo the
 * entrance before it happened. It holds for a moment on purpose and then lifts.
 *
 * It never waits on anything it cannot control: a slow photo further down the page must
 * not keep a guest staring at a loading screen, so this is a fixed, short hold rather
 * than a real progress bar pretending to measure something.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Drifters } from "./world/Drifters";
import { story } from "../data/party";
import "./Loader.css";

/** Long enough to cover the font swap, short enough that nobody waits for it. */
export const HOLD_MS = 1500;

export function Loader() {
  const [open, setOpen] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(false), reduceMotion ? 300 : HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  useEffect(() => {
    document.body.dataset.loading = open ? "true" : "false";
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
          aria-hidden="true"
        >
          <Drifters kind="dust" count={26} className="loader__dust" />

          <div className="loader__middle">
            <p className="script loader__title">{story.loadingTitle}</p>
            <p className="loader__line">{story.loading}</p>
            <span className="loader__rule" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
