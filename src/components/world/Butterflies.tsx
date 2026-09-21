/**
 * Butterflies, on curved flight paths.
 *
 * Each one follows an `offset-path` — a real bezier — rather than a straight translate,
 * because a butterfly that crosses the screen in a straight line reads as a sprite
 * sliding, and one that arcs and loops reads as alive. `offset-rotate` turns it to face
 * the direction of travel for free.
 *
 * The wings are two SVG paths sharing a hinge, flapping on their own much faster cycle.
 */
import { useMemo } from "react";
import "./Butterflies.css";

/** Four routes across a chapter, in the 0-100 coordinate space of its box. */
const PATHS = [
  "M -10 70 C 20 30, 40 90, 70 40 S 100 20, 118 46",
  "M 112 30 C 80 60, 60 10, 34 52 S 6 78, -12 58",
  "M -8 26 C 24 62, 52 16, 76 58 S 102 84, 116 66",
  "M 108 84 C 78 40, 48 74, 26 30 S 4 10, -10 22",
] as const;

const WING_COLOURS = [
  ["#f4d6df", "#e8bfcb"],
  ["#e8ddf5", "#c9b7e8"],
  ["#ddebf4", "#c9d9ec"],
  ["#e8d3a4", "#d7b46a"],
] as const;

interface Props {
  readonly count?: number;
  readonly className?: string;
  readonly seed?: number;
}

function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

export function Butterflies({ count = 3, className, seed = 5 }: Props) {
  const flyers = useMemo(() => {
    const random = seeded(seed * 104729);
    return Array.from({ length: count }, (_, index) => ({
      key: index,
      path: PATHS[Math.floor(random() * PATHS.length)],
      colours: WING_COLOURS[Math.floor(random() * WING_COLOURS.length)],
      size: 16 + random() * 14,
      // Slow: a butterfly that crosses in three seconds is a distraction, not scenery.
      duration: 26 + random() * 22,
      delay: -random() * 40,
      flap: 0.34 + random() * 0.22,
    }));
  }, [count, seed]);

  return (
    <div className={`butterflies${className ? ` ${className}` : ""}`} aria-hidden="true">
      {flyers.map((flyer) => (
        <span
          key={flyer.key}
          className="butterflies__flyer"
          style={
            {
              offsetPath: `path("${flyer.path}")`,
              width: `${flyer.size}px`,
              animationDuration: `${flyer.duration}s`,
              animationDelay: `${flyer.delay}s`,
            } as React.CSSProperties
          }
        >
          <svg viewBox="0 0 24 20" style={{ animationDuration: `${flyer.flap}s` }}>
            <g className="butterflies__wing butterflies__wing--left">
              <path
                d="M12 10 C 6 1, 0 2, 1 8 C 2 14, 7 15, 12 10 Z"
                fill={flyer.colours[0]}
                stroke={flyer.colours[1]}
                strokeWidth="0.5"
              />
            </g>
            <g className="butterflies__wing butterflies__wing--right">
              <path
                d="M12 10 C 18 1, 24 2, 23 8 C 22 14, 17 15, 12 10 Z"
                fill={flyer.colours[0]}
                stroke={flyer.colours[1]}
                strokeWidth="0.5"
              />
            </g>
            <path d="M12 7 L12 14" stroke="#6c6080" strokeWidth="0.9" strokeLinecap="round" />
          </svg>
        </span>
      ))}
    </div>
  );
}
