/**
 * One of Lester's watercolour cut-outs, placed in the world.
 *
 * These are paintings with their own transparency rather than boxes, so they are never
 * given a frame, a border or a shadow: the whole point is that a toadstool or a cottage
 * simply stands in the meadow. Position, size and depth are the caller's business — this
 * only owns loading the right file and never breaking the layout while it does.
 */
import { responsiveImage } from "../../lib/assets";
import "./Painted.css";

interface Props {
  /** A stem under public/invitation/art. */
  readonly id: string;
  readonly className?: string;
}

export function Painted({ id, className }: Props) {
  const art = responsiveImage(id);
  if (!art) return null;

  return (
    <picture className={`painted${className ? ` ${className}` : ""}`} aria-hidden="true">
      <source type="image/avif" srcSet={art.avifSrcSet} sizes="(min-width: 900px) 20rem, 44vw" />
      <img src={art.src} srcSet={art.srcSet} sizes="(min-width: 900px) 20rem, 44vw" alt="" loading="lazy" decoding="async" />
    </picture>
  );
}
