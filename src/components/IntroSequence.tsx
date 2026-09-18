/**
 * The opening cinematic, in the seven scenes the brief lays out:
 *
 *   1. Darkness, stars slowly lighting
 *   2. The Higgsfield opening clip — clouds, a shooting star
 *   3. The castle reveal
 *   4. "Once Upon a Time…" / "A little dream came true…" / "And now…"
 *   5. [NAME] is turning ONE
 *   6. A golden crown above the 1, with sparkles
 *   7. "You're Invited"
 *
 * The whole thing runs about eighteen seconds and can be skipped at any moment. Guests
 * who have already watched it this visit are not made to sit through it again.
 *
 * Every visual behind the typography degrades on its own (see CinematicVideo), so if
 * neither clip is available the sequence still plays over the painted kingdom — the
 * timing and the words are identical either way.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CinematicVideo } from "./CinematicVideo";
import { PaintedKingdom } from "./PaintedKingdom";
import { ParticleField } from "./ParticleField";
import { GoldCrown } from "./GoldCrown";
import { child, introLines } from "../data/party";
import "./IntroSequence.css";

interface Props {
  readonly onFinish: () => void;
}

/** One beat of the sequence. `hold` is how long it stays on screen, in ms. */
interface Beat {
  readonly id: string;
  readonly hold: number;
}

const BEATS: readonly Beat[] = [
  { id: "darkness", hold: 2600 },
  { id: "opening", hold: 4800 },
  { id: "reveal", hold: 3400 },
  { id: "line-1", hold: 2400 },
  { id: "line-2", hold: 2400 },
  { id: "line-3", hold: 1900 },
  { id: "name", hold: 3200 },
  { id: "crown", hold: 2600 },
  { id: "invited", hold: 2800 },
];

const SEEN_KEY = "anya-intro-seen";

/** sessionStorage throws in private mode on some browsers, so every access is guarded. */
function hasSeenIntro(): boolean {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberIntroSeen(): void {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Not being able to remember is harmless; the guest just sees it again.
  }
}

export function IntroSequence({ onFinish }: Props) {
  const [beatIndex, setBeatIndex] = useState(0);
  const finished = useRef(false);
  const beat = BEATS[beatIndex];

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    rememberIntroSeen();
    onFinish();
  }, [onFinish]);

  // Advance through the beats. A guest who reduces motion gets a much shorter run
  // rather than a wall of animation they did not ask for.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduced ? Math.min(beat.hold, 1200) : beat.hold;

    const timer = window.setTimeout(() => {
      if (beatIndex >= BEATS.length - 1) {
        finish();
      } else {
        setBeatIndex((index) => index + 1);
      }
    }, hold);

    return () => window.clearTimeout(timer);
  }, [beatIndex, beat.hold, finish]);

  // Escape skips, matching the button.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") finish();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [finish]);

  const stage = beat.id;

  /** Which backdrop belongs to this beat. */
  const backdrop = useMemo(() => {
    if (stage === "darkness") return "night";
    if (stage === "opening") return "opening";
    return "reveal";
  }, [stage]);

  return (
    <motion.div
      className="intro"
      role="dialog"
      aria-label="Opening animation"
      exit={{ opacity: 0 }}
      transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {/* ---- backdrops ---- */}
      <div className={`intro__backdrop intro__backdrop--night${backdrop === "night" ? " is-visible" : ""}`}>
        <ParticleField kind="stars" count={70} className="intro__stars" />
      </div>

      <div className={`intro__backdrop${backdrop === "opening" ? " is-visible" : ""}`}>
        {backdrop === "opening" && (
          <CinematicVideo id="fairytale-opening" loop={false} preload="auto" fallback={<PaintedKingdom />} />
        )}
      </div>

      <div className={`intro__backdrop${backdrop === "reveal" ? " is-visible" : ""}`}>
        {backdrop === "reveal" && (
          <CinematicVideo id="castle-reveal" preload="auto" fallback={<PaintedKingdom />} />
        )}
      </div>

      {/* A shooting star crosses once, during the opening beat. */}
      {stage === "opening" && <span className="intro__shooting-star" aria-hidden="true" />}

      <div className="intro__scrim" aria-hidden="true" />

      {/* ---- typography ---- */}
      <div className="intro__stage">
        <AnimatePresence mode="wait">
          {stage === "line-1" && <IntroLine key="l1" text={introLines[0]} />}
          {stage === "line-2" && <IntroLine key="l2" text={introLines[1]} />}
          {stage === "line-3" && <IntroLine key="l3" text={introLines[2]} />}

          {(stage === "name" || stage === "crown") && (
            <motion.div
              key="name"
              className="intro__name-block"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <AnimatePresence>
                {stage === "crown" && (
                  <motion.div
                    className="intro__crown"
                    initial={{ opacity: 0, y: 18, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
                  >
                    <GoldCrown />
                    <ParticleField kind="sparkles" count={18} className="intro__crown-sparkles" />
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="intro__child-name">{child.name}</p>
              <p className="intro__turning">is turning</p>
              <p className="intro__one">{child.turning}</p>
            </motion.div>
          )}

          {stage === "invited" && (
            <motion.p
              key="invited"
              className="intro__invited"
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1] }}
            >
              You&rsquo;re Invited
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <button type="button" className="intro__skip" onClick={finish}>
        Skip intro
      </button>
    </motion.div>
  );
}

function IntroLine({ text }: { readonly text: string }) {
  return (
    <motion.p
      className="intro__line"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {text}
    </motion.p>
  );
}

export { hasSeenIntro };
