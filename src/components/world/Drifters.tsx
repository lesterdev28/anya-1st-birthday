/**
 * Everything small that floats: stars, fairy dust, petals, pollen and fireflies.
 *
 * Plain DOM elements moved by CSS keyframes. The brief asks for these on every screen of
 * a long page, so each one has to cost almost nothing — a span with a background and a
 * transform animation is composited and never touches layout.
 *
 * Positions come from a fixed seed. A random scatter that re-rolls on every render reads
 * as a glitch rather than as magic, and it also breaks React's reconciliation.
 *
 * Counts are halved on small screens, which is the brief's own instruction for phones:
 * keep the magic, reduce the particle count.
 */
import { useMemo } from "react";
import "./Drifters.css";

export type DrifterKind = "stars" | "dust" | "petals" | "pollen" | "fireflies";

interface Props {
  readonly kind: DrifterKind;
  readonly count?: number;
  readonly className?: string;
}

function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const SEEDS: Record<DrifterKind, number> = {
  stars: 20261010,
  dust: 5150,
  petals: 77211,
  pollen: 31459,
  fireflies: 60607,
};

/** How big each kind is, in pixels, as a [min, extra] pair. */
const SIZES: Record<DrifterKind, readonly [number, number]> = {
  stars: [1.5, 2.6],
  dust: [1.6, 2.4],
  petals: [7, 7],
  pollen: [2, 2.6],
  fireflies: [3, 4.5],
};

/** Seconds for one cycle, as a [min, extra] pair. */
const DURATIONS: Record<DrifterKind, readonly [number, number]> = {
  stars: [3, 5],
  dust: [14, 12],
  petals: [16, 14],
  pollen: [18, 16],
  fireflies: [7, 9],
};

export function Drifters({ kind, count = 24, className }: Props) {
  const particles = useMemo(() => {
    const random = seeded(SEEDS[kind]);
    const [size, sizeSpread] = SIZES[kind];
    const [duration, durationSpread] = DURATIONS[kind];

    return Array.from({ length: count }, (_, index) => ({
      key: index,
      left: random() * 100,
      top: random() * 100,
      size: size + random() * sizeSpread,
      duration: duration + random() * durationSpread,
      // Negative delays start every particle mid-cycle, so nothing begins in unison.
      delay: -random() * 30,
      drift: (random() - 0.5) * 90,
      spin: random() > 0.5 ? 1 : -1,
    }));
  }, [count, kind]);

  return (
    <div className={`drifters drifters--${kind}${className ? ` ${className}` : ""}`} aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.key}
          className="drifters__bit"
          style={
            {
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              "--drift": `${particle.drift}px`,
              "--spin": particle.spin,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
