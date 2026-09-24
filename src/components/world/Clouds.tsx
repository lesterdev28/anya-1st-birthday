/**
 * The cloud system.
 *
 * A cloud here is a div carrying a handful of overlapping radial gradients — no SVG, no
 * image, no blur filter. That matters: the brief wants clouds on every screen of a long
 * page, moving at several speeds at once, at sixty frames a second on a phone. Gradients
 * are painted once and then only ever transformed, which the compositor does for free,
 * whereas a blurred PNG per cloud would be a download and a repaint each.
 *
 * Softness comes from the gradients themselves fading to transparent, so the edges are
 * watercolour rather than cut out.
 */
import { useMemo } from "react";
import { useNearViewport } from "../../lib/near";
import { Parallax } from "../../lib/scene";
import "./Clouds.css";

export type Depth = "far" | "mid" | "near";

/** The brief's own scroll multipliers. */
const DEPTH_SPEED: Record<Depth, number> = { far: 0.15, mid: 0.35, near: 0.65 };

/** Four silhouettes, so a band of clouds does not read as one shape repeated. */
const SHAPES = ["a", "b", "c", "d"] as const;

/** Fixed scatter: clouds that jump to new positions on every render read as a glitch. */
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

interface BandProps {
  readonly depth: Depth;
  readonly count?: number;
  readonly className?: string;
  /** Distinguishes two bands at the same depth so they do not scatter identically. */
  readonly seed?: number;
}

/**
 * A drifting band of clouds. Horizontal movement only — this is used inside the fixed
 * sky, where there is no scroll to parallax against.
 */
export function CloudBand({ depth, count = 4, className, seed = 1 }: BandProps) {
  /*
   * A band holds still until it is near the screen. There are a hundred and ten clouds
   * on this page and at most a dozen are ever in view; the rest were costing a frame's
   * work each for nobody. See src/lib/near.ts.
   */
  const { ref, near } = useNearViewport<HTMLDivElement>();

  const clouds = useMemo(() => {
    const random = seeded(seed * 7919 + DEPTH_SPEED[depth] * 10000);
    return Array.from({ length: count }, (_, index) => ({
      key: index,
      shape: SHAPES[Math.floor(random() * SHAPES.length)],
      left: random() * 100,
      top: random() * 100,
      scale: 0.7 + random() * 0.9,
      // Far clouds take minutes to cross; near ones are quicker but still unhurried.
      duration: (depth === "far" ? 210 : depth === "mid" ? 150 : 100) + random() * 60,
      delay: -random() * 200,
      opacity: 0.45 + random() * 0.45,
    }));
  }, [count, depth, seed]);

  return (
    <div
      ref={ref}
      className={`clouds clouds--${depth}${near ? " is-here" : ""}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      {clouds.map((cloud) => (
        <span
          key={cloud.key}
          className={`cloud cloud--${cloud.shape}`}
          style={{
            left: `${cloud.left}%`,
            top: `${cloud.top}%`,
            opacity: cloud.opacity,
            animationDuration: `${cloud.duration}s`,
            animationDelay: `${cloud.delay}s`,
            "--cloud-scale": cloud.scale,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

interface LayerProps extends BandProps {
  /** Pixels of vertical travel across the chapter, before the depth multiplier. */
  readonly distance?: number;
}

/**
 * A band of clouds that also travels vertically as its chapter scrolls past. Use inside
 * a `Chapter`; two or three of these at different depths are what give a flat screen the
 * feeling of having air in it.
 */
export function CloudLayer({ depth, count, className, seed, distance = 320 }: LayerProps) {
  return (
    <Parallax depth={DEPTH_SPEED[depth]} distance={distance} className={className}>
      <CloudBand depth={depth} count={count} seed={seed} />
    </Parallax>
  );
}

interface CurtainProps {
  /** 0 fully parted, 1 fully closed. */
  readonly className?: string;
}

/**
 * The cloud curtain that closes over one chapter and opens on the next.
 *
 * Two banks of cloud that rise from the bottom and descend from the top, meet in the
 * middle of the screen, then part again as scrolling continues. It is the brief's
 * transition device, and it is what stops the seam between two chapters from ever being
 * visible: whatever is behind the curtain can change completely while it is closed.
 */
export function CloudCurtain({ className }: CurtainProps) {
  return (
    <div className={`curtain${className ? ` ${className}` : ""}`} aria-hidden="true">
      <Parallax depth={1} distance={-420} className="curtain__bank curtain__bank--top">
        <CloudBand depth="near" count={4} seed={11} />
      </Parallax>
      <Parallax depth={1} distance={420} className="curtain__bank curtain__bank--bottom">
        <CloudBand depth="near" count={4} seed={23} />
      </Parallax>
    </div>
  );
}
