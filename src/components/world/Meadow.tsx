/**
 * The wildflower meadow along the bottom of a chapter.
 *
 * Three bands at three depths. The far band is small, pale and barely moves; the near
 * band is large, saturated and sways most, and travels fastest as the chapter scrolls.
 * That difference is the whole effect — a single band of flowers reads as a border, and
 * three read as ground you are moving over.
 *
 * Stems are generated from a fixed seed rather than drawn by hand, so the meadow is
 * dense and irregular without a thousand lines of path data. Each stem sways on its own
 * slightly different cycle, which is what stops it looking like one image wobbling.
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

function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

interface StemProps {
  readonly band: Band;
  readonly count: number;
  readonly seed: number;
}

function Stems({ band, count, seed }: StemProps) {
  const stems = useMemo(() => {
    const random = seeded(seed * 65537 + count);
    const palette = BAND_PALETTE[band];
    return Array.from({ length: count }, (_, index) => {
      const x = (index + random() * 0.8) * (100 / count);
      const height = (band === "far" ? 14 : band === "mid" ? 26 : 42) * (0.6 + random() * 0.7);
      return {
        key: index,
        x,
        height,
        lean: (random() - 0.5) * 9,
        colour: palette[Math.floor(random() * palette.length)],
        // A bud, a five-petal flower, or bare grass.
        head: random() < 0.62 ? (random() < 0.5 ? "flower" : "bud") : "grass",
        petals: 5,
        sway: 4 + random() * 4,
        delay: -random() * 8,
        size: (band === "far" ? 1.5 : band === "mid" ? 2.4 : 3.4) * (0.7 + random() * 0.6),
      };
    });
  }, [band, count, seed]);

  return (
    <svg
      className={`meadow__svg meadow__svg--${band}`}
      viewBox="0 0 100 50"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {stems.map((stem) => (
        <g
          key={stem.key}
          className="meadow__stem"
          style={{
            // The hinge is at the base of the stem, so it bends rather than slides.
            transformOrigin: `${stem.x}px 50px`,
            animationDuration: `${stem.sway}s`,
            animationDelay: `${stem.delay}s`,
            "--lean": `${stem.lean}deg`,
          } as React.CSSProperties}
        >
          <path
            d={`M ${stem.x} 50 Q ${stem.x + stem.lean * 0.4} ${50 - stem.height * 0.6} ${stem.x + stem.lean} ${50 - stem.height}`}
            fill="none"
            stroke={band === "far" ? "#c8d6be" : "#94a987"}
            strokeWidth={band === "near" ? 0.6 : 0.4}
            strokeLinecap="round"
            opacity={band === "far" ? 0.5 : 0.75}
          />

          {stem.head === "flower" && (
            <g transform={`translate(${stem.x + stem.lean} ${50 - stem.height})`}>
              {Array.from({ length: stem.petals }, (_, petal) => (
                <ellipse
                  key={petal}
                  rx={stem.size * 0.42}
                  ry={stem.size * 0.9}
                  cy={-stem.size * 0.62}
                  fill={stem.colour}
                  opacity="0.9"
                  transform={`rotate(${(360 / stem.petals) * petal})`}
                />
              ))}
              <circle r={stem.size * 0.34} fill="#e8d3a4" />
            </g>
          )}

          {stem.head === "bud" && (
            <ellipse
              cx={stem.x + stem.lean}
              cy={50 - stem.height}
              rx={stem.size * 0.5}
              ry={stem.size * 0.85}
              fill={stem.colour}
              opacity="0.85"
            />
          )}
        </g>
      ))}
    </svg>
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
          <Stems band={band} count={band === "far" ? 26 : band === "mid" ? 20 : 14} seed={seed + index} />
        </Parallax>
      ))}
    </div>
  );
}
