/**
 * Fairies, hovering around a chapter.
 *
 * Not the butterflies with different artwork. A butterfly is scenery: it crosses the
 * screen on a long curve and the eye lets it go. A fairy is a character, and a character
 * that slides past reads as a sprite on a conveyor. So these keep still — they take a
 * perch out at the edge of the chapter and hover there, breathing up and down and tipping
 * a degree or two, the way something with wings holds a position.
 *
 * They also stay behind the photographs. The month's pictures are the thing the guest
 * came for, and a painted figure drifting over Anya's face is the one way this could go
 * wrong; the perches are out at the margins and the layer sits under the frame, so a
 * fairy can only ever peek from behind it.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { responsiveImage } from "../../lib/assets";
import "./Fairies.css";

/** The three painted fairies, so a chapter can hold more than one without repeating. */
const FAIRIES = ["fairy-with-poppy", "fairy-leaf-wings", "fairy-in-flight"] as const;

/**
 * Where a fairy can stand, as a percentage of the chapter box.
 *
 * All of them are out near an edge, and `face` turns her to look inward — a row of
 * fairies all facing the same way reads as clip art, and a ring of them looking at the
 * photograph in the middle reads as attention.
 */
const PERCHES = [
  { x: 1, y: 14, face: 1 },
  { x: 80, y: 19, face: -1 },
  { x: 0, y: 58, face: 1 },
  { x: 82, y: 63, face: -1 },
  { x: 34, y: 2, face: 1 },
  { x: 52, y: 82, face: -1 },
  { x: 14, y: 84, face: 1 },
  { x: 70, y: 40, face: -1 },
] as const;

interface Props {
  readonly count?: number;
  readonly seed?: number;
  readonly className?: string;
}

function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

export function Fairies({ count = 4, seed = 1, className }: Props) {
  const group = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = group.current;
    if (!element) return;
    const watcher = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      rootMargin: "40% 0px 40% 0px",
    });
    watcher.observe(element);
    return () => watcher.disconnect();
  }, []);

  const flock = useMemo(() => {
    const random = seeded(seed * 2246822519 + 1);
    /* Drawn without replacement, so no month ever puts two fairies on one perch. */
    const perches = [...PERCHES];
    return Array.from({ length: Math.min(count, perches.length) }, (_, index) => {
      const perch = perches.splice(Math.floor(random() * perches.length), 1)[0];
      return {
        id: index,
        perch,
        art: FAIRIES[Math.floor(random() * FAIRIES.length)],
        size: 5.4 + random() * 2.6,
        hover: 5.5 + random() * 3.5,
        delay: -random() * 8,
        /* Which of the three tips in the stylesheet she takes; see the note there. */
        lean: Math.floor(random() * 3),
      };
    });
  }, [count, seed]);

  return (
    <div
      ref={group}
      className={`fairies${near ? " is-here" : ""}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      {flock.map(({ id, ...one }) => (
        <Fairy key={id} {...one} />
      ))}
    </div>
  );
}

function Fairy({
  perch,
  art,
  size,
  hover,
  delay,
  lean,
}: {
  readonly perch: (typeof PERCHES)[number];
  readonly art: string;
  readonly size: number;
  readonly hover: number;
  readonly delay: number;
  readonly lean: number;
}) {
  const image = responsiveImage(art);
  if (!image) return null;

  return (
    <span
      className={`fairies__one fairies__one--${perch.face === 1 ? "in" : "out"}${lean}`}
      style={{
        left: `${perch.x}%`,
        top: `${perch.y}%`,
        width: `clamp(3.4rem, ${size}cqw, ${size}rem)`,
        animationDuration: `${hover}s`,
        animationDelay: `${delay}s`,
      }}
    >
      <picture>
        <source type="image/avif" srcSet={image.avifSrcSet} sizes="120px" />
        <img src={image.src} srcSet={image.srcSet} sizes="120px" alt="" loading="lazy" decoding="async" />
      </picture>
    </span>
  );
}
