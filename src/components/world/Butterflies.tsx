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
 *
 * A whole page of these would be a whole page of main-thread animation, since
 * `offset-distance` is not a compositor property. So each group watches whether it is
 * anywhere near the screen and parks its animations when it is not: at most two chapters
 * are ever in view, so at most a handful are ever actually moving.
 *
 * The routes are written once, in a 0-100 box, and scaled to the measured chapter before
 * they are handed to CSS. They have to be: `path()` takes user units, which are pixels,
 * and a percentage in one is not a percentage of anything — a route written as if it were
 * flies the whole group around a hundred-pixel square in the top corner.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { responsiveImage } from "../../lib/assets";
import "./Butterflies.css";

/**
 * Routes across a chapter, in the 0-100 coordinate space of its box, grouped by the band
 * of the screen they keep to.
 *
 * The grouping is the point. A chapter is a screen tall with its subject in the middle,
 * so the empty parts of it are the top and the bottom — and butterflies picked at random
 * all crowd the middle, which is the one place that was never empty. Each flyer takes a
 * different band, so every chapter gets one high, one low and one crossing between them.
 */
const BANDS = [
  /* High: across the empty air above the frame. */
  [
    "M -10 14 C 22 32, 50 -2, 78 20 S 104 38, 118 16",
    "M 114 8 C 86 28, 58 2, 30 24 S 4 42, -12 24",
    "M -8 22 C 26 4, 54 30, 80 10 S 106 24, 116 6",
  ],
  /* Low: across the empty air below the caption. */
  [
    "M -8 88 C 20 66, 48 96, 74 74 S 100 58, 116 82",
    "M 110 94 C 82 72, 54 98, 28 76 S 2 62, -10 88",
    "M -10 76 C 24 94, 52 68, 78 90 S 104 72, 118 92",
  ],
  /* Crossing: the long diagonals, which are what tie the two bands together. */
  [
    "M -10 70 C 20 30, 40 90, 70 40 S 100 20, 118 46",
    "M 112 30 C 80 60, 60 10, 34 52 S 6 78, -12 58",
    "M -8 26 C 24 62, 52 16, 76 58 S 102 84, 116 66",
    "M 108 84 C 78 40, 48 74, 26 30 S 4 10, -10 22",
  ],
] as const;

/**
 * The painted butterflies, dealt in order so a chapter never shows one twice alike.
 *
 * Eight of them now: the two watercolours the journey started with, a flat blush one,
 * and the six cut out of the sheet Lester sent. Enough that a guest scrolling through
 * sixteen chapters never sees the same wing twice in a screen.
 */
const WINGS = [
  "butterfly-cream",
  "butterfly-pearl-02",
  "butterfly-lilac",
  "butterfly-pearl-04",
  "butterfly-blush",
  "butterfly-pearl-01",
  "butterfly-pearl-05",
  "butterfly-pearl-03",
  "butterfly-pearl-06",
] as const;

interface Props {
  readonly count?: number;
  readonly className?: string;
  readonly seed?: number;
}

/**
 * Rewrites a 0-100 route into the pixels of the box it has to cross.
 *
 * Every command in these paths — M, C, S — takes its coordinates in absolute x/y pairs,
 * so walking the numbers left to right and alternating the axis is enough; there is no
 * arc flag or single-axis command to trip over.
 */
function scalePath(path: string, width: number, height: number): string {
  let axis = 0;
  return path.replace(/-?\d+(?:\.\d+)?/g, (value) => {
    const span = axis++ % 2 === 0 ? width : height;
    return ((Number(value) / 100) * span).toFixed(1);
  });
}

function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

export function Butterflies({ count = 3, className, seed = 5 }: Props) {
  const group = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [box, setBox] = useState({ width: 0, height: 0 });

  /* The chapter is a screen tall and the screen can be turned, so this is watched. */
  useEffect(() => {
    const element = group.current;
    if (!element) return;
    const watcher = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox({ width: Math.round(width), height: Math.round(height) });
    });
    watcher.observe(element);
    return () => watcher.disconnect();
  }, []);

  /*
   * A generous margin: a butterfly should already be mid-flight when the chapter arrives,
   * not visibly start from its beginning as the guest scrolls it into view.
   */
  useEffect(() => {
    const element = group.current;
    if (!element) return;
    const watcher = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: "60% 0px 60% 0px" },
    );
    watcher.observe(element);
    return () => watcher.disconnect();
  }, []);

  const flyers = useMemo(() => {
    const random = seeded(seed * 104729);
    return Array.from({ length: count }, (_, index) => {
      /* One per band, in order, so the bands fill before any of them doubles up. */
      const band = BANDS[index % BANDS.length];
      return {
      key: index,
      path: band[Math.floor(random() * band.length)],
      wing: WINGS[(index + seed) % WINGS.length],
      /* Bigger than the drawn ones were: a painting needs room to read as a painting. */
      size: 34 + random() * 26,
      // Slow: a butterfly that crosses in three seconds is a distraction, not scenery.
      duration: 26 + random() * 22,
      delay: -random() * 40,
      flap: 1.9 + random() * 1.1,
      lean: random() < 0.5 ? -1 : 1,
      };
    });
  }, [count, seed]);

  return (
    <div
      ref={group}
      className={`butterflies${near ? " is-flying" : ""}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      {box.width > 0 &&
        flyers.map((flyer) => (
          <span
            key={flyer.key}
            className="butterflies__flyer"
            style={
              {
                offsetPath: `path("${scalePath(flyer.path, box.width, box.height)}")`,
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
      className={`butterflies__wings butterflies__wings--${lean < 0 ? "left" : "right"}`}
      style={{ animationDuration: `${flap}s` }}
    >
      <source type="image/avif" srcSet={art.avifSrcSet} sizes="80px" />
      <img src={art.src} srcSet={art.srcSet} sizes="80px" alt="" loading="lazy" decoding="async" />
    </picture>
  );
}
