/**
 * A bank of Lester's painted cloud, scattered.
 *
 * The rest of the sky is drawn in CSS gradients, which is right for air that has to be
 * on every screen of a long page. This is the opposite case: one cloud, drawn, used
 * where a cloud has to read as a *thing* rather than as atmosphere — the bank that opens
 * on the kingdom, and the gate that parts as the guest descends out of it.
 *
 * Several copies at different sizes, flipped and nudged, because one shape used once
 * reads as a sticker and the same shape used six times reads as weather.
 */
import { useMemo } from "react";
import { responsiveImage } from "../../lib/assets";
import "./PaintedClouds.css";

interface Props {
  readonly count?: number;
  readonly seed?: number;
  readonly className?: string;
  /** Width of one cloud, as a percentage of the bank. */
  readonly spread?: number;
  /** Clouds across. The rows follow from this and the count. */
  readonly columns?: number;
  /** Lays the bank out right to left, for the half of a gate that opens rightward. */
  readonly mirror?: boolean;
}

function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

export function PaintedClouds({
  count = 6,
  seed = 1,
  className,
  spread = 62,
  columns = 3,
  mirror = false,
}: Props) {
  const art = responsiveImage("story-cloud");

  const clouds = useMemo(() => {
    const random = seeded(seed * 2654435761);
    /*
     * Laid out on a loose grid rather than at random. A bank has to be solid, and clouds
     * scattered freely across a box leave a hole in it every time — which is fatal here,
     * because a hole in the bank is a hole in the curtain.
     */
    const rows = Math.max(1, Math.ceil(count / columns));
    const band = 100 / rows;
    return Array.from({ length: count }, (_, index) => ({
      key: index,
      left: -16 + (index % columns) * (116 / columns) + random() * 14,
      top: Math.floor(index / columns) * band - band * 0.35 + random() * band * 0.4,
      width: spread * (0.82 + random() * 0.4),
      flip: random() < 0.5 ? -1 : 1,
      tilt: (random() - 0.5) * 6,
      opacity: 0.82 + random() * 0.18,
      /* Never quite still: a bank that has stopped moving stops being cloud. */
      drift: 14 + random() * 12,
      delay: -random() * 20,
    }));
  }, [count, seed, spread, columns]);

  if (!art) return null;

  return (
    <div
      className={`painted-clouds${mirror ? " painted-clouds--mirror" : ""}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      {clouds.map((cloud) => (
        <span
          key={cloud.key}
          className="painted-clouds__cloud"
          style={
            {
              left: `${cloud.left}%`,
              top: `${cloud.top}%`,
              width: `${cloud.width}%`,
              opacity: cloud.opacity,
              animationDuration: `${cloud.drift}s`,
              animationDelay: `${cloud.delay}s`,
              "--flip": cloud.flip,
              "--tilt": `${cloud.tilt}deg`,
            } as React.CSSProperties
          }
        >
          <picture>
            <source type="image/avif" srcSet={art.avifSrcSet} sizes="60vw" />
            <img src={art.src} srcSet={art.srcSet} sizes="60vw" alt="" decoding="async" />
          </picture>
        </span>
      ))}
    </div>
  );
}
