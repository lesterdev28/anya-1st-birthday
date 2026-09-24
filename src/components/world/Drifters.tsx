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
import { useNearViewport } from "../../lib/near";
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
  /*
   * Dust is the largest of the small things on purpose. Its gradient fades to nothing
   * before the box ends — which is what stops it reading as a disc — so only about the
   * middle two thirds of the size is painted at all. At the old 1.6px a mote painted
   * roughly one pixel and simply was not there.
   */
  dust: [3.4, 4.6],
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
  /*
   * Off-screen particles hold still.
   *
   * Measured on a throttled phone over one full scroll of the page, the drifters cost
   * seconds of main-thread work for groups nobody could see. `rootMargin` starts a
   * chapter's particles moving well before it arrives, so nothing is ever caught
   * standing still. The hook is shared with the clouds and the meadow; see lib/near.ts.
   */
  const { ref, near } = useNearViewport<HTMLDivElement>();

  const particles = useMemo(() => {
    const random = seeded(SEEDS[kind]);
    const [size, sizeSpread] = SIZES[kind];
    const [duration, durationSpread] = DURATIONS[kind];

    return Array.from({ length: count }, (_, index) => ({
      key: index,
      left: random() * 100,
      top: random() * 100,
      /*
       * A glint is a flare, so it sits larger than the grain it came from. It is sized
       * here rather than scaled in the keyframes, because a keyframe that multiplies by
       * a custom property cannot be composited. `4n + 1` in the stylesheet is this.
       */
      size: (size + random() * sizeSpread) * (kind === "dust" && index % 4 === 0 ? 1.45 : 1),
      duration: duration + random() * durationSpread,
      // Negative delays start every particle mid-cycle, so nothing begins in unison.
      delay: -random() * 30,
      /* Which of the four drift lanes in the stylesheet this one takes. */
      lane: Math.floor(random() * 4),
    }));
  }, [count, kind]);

  return (
    <div
      ref={ref}
      className={`drifters drifters--${kind}${near ? " is-here" : ""}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <span
          key={particle.key}
          className={`drifters__bit drifters__bit--d${particle.lane}`}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
