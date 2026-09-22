/**
 * Butterflies, on curved flight paths.
 *
 * Each one follows an `offset-path` — a real bezier — rather than a straight translate,
 * because a butterfly that crosses the screen in a straight line reads as a sprite
 * sliding, and one that arcs and loops reads as alive. `offset-rotate` turns it to face
 * the direction of travel for free.
 *
 * The butterflies themselves are Lester's watercolours rather than drawn shapes. That
 * changes two things about how they fly. They are not symmetrical pairs of wings around
 * a hinge, so the flap is a gentle horizontal breathe instead of a fold — a painting
 * squashed to a third of its width reads as a glitch, not a wingbeat. And they are not
 * rotated to face the curve: `offset-rotate: auto` is right for a drawn arrow shape and
 * wrong for a painting, which it will happily turn upside down halfway along a descent.
 * They keep their own heading and sway a little instead.
 */
import { useMemo } from "react";
import { responsiveImage } from "../../lib/assets";
import "./Butterflies.css";

/** Four routes across a chapter, in the 0-100 coordinate space of its box. */
const PATHS = [
  "M -10 70 C 20 30, 40 90, 70 40 S 100 20, 118 46",
  "M 112 30 C 80 60, 60 10, 34 52 S 6 78, -12 58",
  "M -8 26 C 24 62, 52 16, 76 58 S 102 84, 116 66",
  "M 108 84 C 78 40, 48 74, 26 30 S 4 10, -10 22",
] as const;

/** The two painted butterflies, alternating so a chapter never shows one twice alike. */
const WINGS = ["butterfly-cream", "butterfly-lilac"] as const;

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
      wing: WINGS[index % WINGS.length],
      /* Bigger than the drawn ones were: a painting needs room to read as a painting. */
      size: 34 + random() * 26,
      // Slow: a butterfly that crosses in three seconds is a distraction, not scenery.
      duration: 26 + random() * 22,
      delay: -random() * 40,
      flap: 1.9 + random() * 1.1,
      lean: random() < 0.5 ? -1 : 1,
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
          <Wing id={flyer.wing} flap={flyer.flap} lean={flyer.lean} />
        </span>
      ))}
    </div>
  );
}

/** One painted butterfly, breathing. Renders nothing if the art has not been built. */
function Wing({ id, flap, lean }: { readonly id: string; readonly flap: number; readonly lean: number }) {
  const art = responsiveImage(id);
  if (!art) return null;

  return (
    <picture
      className="butterflies__wings"
      style={
        { animationDuration: `${flap}s`, "--lean": `${lean * 7}deg` } as React.CSSProperties
      }
    >
      <source type="image/avif" srcSet={art.avifSrcSet} sizes="80px" />
      <img src={art.src} srcSet={art.srcSet} sizes="80px" alt="" loading="lazy" decoding="async" />
    </picture>
  );
}
