/**
 * The wildflower meadow along the bottom of a chapter.
 *
 * Three bands at three depths. The far band is small, pale and barely moves; the near
 * band is large, saturated and sways most, and travels fastest as the chapter scrolls.
 * That difference is the whole effect — a single band of flowers reads as a border, and
 * three read as ground you are moving over.
 *
 * Every stem is a DOM element sized in pixels rather than a shape inside one stretched
 * SVG. An SVG with `preserveAspectRatio: none` scales its contents by the width of its
 * box, so the same meadow that looked right on a phone grew flowers the size of a fist
 * on a desktop. Here the width of the screen changes how far apart the stems stand and
 * nothing else, which is what distance actually does.
 */
import { useMemo } from "react";
import { Parallax } from "../../lib/scene";
import "./Meadow.css";

type Band = "far" | "mid" | "near";

const BAND_SPEED: Record<Band, number> = { far: 0.15, mid: 0.35, near: 0.65 };

const BAND_PALETTE: Record<Band, readonly string[]> = {
  far: ["#c8d6be", "#ddebf4", "#e8ddf5"],
  mid: ["#94a987", "#c9b7e8", "#f4d6df"],
  near: ["#94a987", "#e8bfcb", "#c9b7e8", "#e8d3a4"],
};

/** Stem height and flower size in pixels, as [base, spread] pairs, per band. */
const BAND_SCALE: Record<Band, { readonly height: readonly [number, number]; readonly head: readonly [number, number] }> = {
  far: { height: [22, 16], head: [5, 4] },
  mid: { height: [44, 28], head: [8, 6] },
  near: { height: [72, 44], head: [12, 9] },
};

/**
 * How many stems in a band, spread across whatever width it is given.
 *
 * A wide screen therefore stands them further apart rather than drawing them bigger,
 * which is what the eye expects of a border of flowers seen from further back.
 */
const DENSITY: Record<Band, number> = { far: 34, mid: 24, near: 16 };

function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

interface StemsProps {
  readonly band: Band;
  readonly seed: number;
}

function Stems({ band, seed }: StemsProps) {
  const stems = useMemo(() => {
    const random = seeded(seed * 65537 + DENSITY[band]);
    const palette = BAND_PALETTE[band];
    const { height, head } = BAND_SCALE[band];
    const count = DENSITY[band];

    return Array.from({ length: count }, (_, index) => {
      const kind = random();
      return {
        key: index,
        /* Evenly spaced with a nudge, so it is irregular without ever leaving a gap. */
        x: ((index + 0.5 + (random() - 0.5) * 0.7) / count) * 100,
        height: height[0] + random() * height[1],
        head: head[0] + random() * head[1],
        lean: (random() - 0.5) * 10,
        colour: palette[Math.floor(random() * palette.length)],
        shape: kind < 0.38 ? "flower" : kind < 0.66 ? "bud" : "grass",
        sway: 4 + random() * 4,
        delay: -random() * 8,
      };
    });
  }, [band, seed]);

  return (
    <div className={`meadow__stems meadow__stems--${band}`}>
      {stems.map((stem) => (
        <span
          key={stem.key}
          className="meadow__stem"
          style={
            {
              left: `${stem.x}%`,
              "--h": `${stem.height}px`,
              "--lean": `${stem.lean}deg`,
              animationDuration: `${stem.sway}s`,
              animationDelay: `${stem.delay}s`,
            } as React.CSSProperties
          }
        >
          {stem.shape !== "grass" && (
            <i
              className={`meadow__head meadow__head--${stem.shape}`}
              style={{ "--size": `${stem.head}px`, "--c": stem.colour } as React.CSSProperties}
            />
          )}
        </span>
      ))}
    </div>
  );
}

interface Props {
  readonly className?: string;
  /** Fewer bands for a chapter that only wants a suggestion of ground. */
  readonly bands?: readonly Band[];
  readonly seed?: number;
}

export function Meadow({ className, bands = ["far", "mid", "near"], seed = 3 }: Props) {
  return (
    <div className={`meadow${className ? ` ${className}` : ""}`} aria-hidden="true">
      {bands.map((band, index) => (
        <Parallax
          key={band}
          depth={BAND_SPEED[band]}
          distance={180}
          className={`meadow__band meadow__band--${band}`}
        >
          <Stems band={band} seed={seed + index} />
        </Parallax>
      ))}
    </div>
  );
}
