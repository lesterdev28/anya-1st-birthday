/**
 * Anya's photograph set into the hero as a locket.
 *
 * The photographs are warm indoor phone snaps and the artwork behind them is a cool
 * pastel painting, so a plain circular crop would read as a sticker pasted onto the
 * sky. Three things stop that: the photo is feathered into the background with a mask
 * rather than cut off at a hard edge, it is graded back towards the palette, and a fine
 * gold ring sits just outside the point where it fades, so the eye reads a frame rather
 * than a seam.
 *
 * The crown rests on the rim, which is what makes it a medallion rather than a
 * cropped photo with decoration nearby.
 */
import { FairyImage } from "./FairyImage";
import { GoldCrown } from "./GoldCrown";
import { Drifters } from "./world/Drifters";
import "./PortraitMedallion.css";

interface Props {
  /** A photo id from the media manifest — the stem of the file in public/invitation/photos. */
  readonly photoId: string;
  readonly alt: string;
  readonly className?: string;
}

export function PortraitMedallion({ photoId, alt, className }: Props) {
  return (
    <div className={`medallion${className ? ` ${className}` : ""}`}>
      <div className="medallion__halo" aria-hidden="true" />

      <div className="medallion__ring" aria-hidden="true" />

      <FairyImage
        id={photoId}
        alt={alt}
        priority
        sizes="(min-width: 900px) 18rem, 44vw"
        className="medallion__photo"
      />

      {/*
        An ivory wash over the outer edge of the photo only. The feather alone still
        left a corner of sofa readable at the widest point of the circle; washing the
        rim towards the palette turns what is left into light rather than furniture.
      */}
      <div className="medallion__wash" aria-hidden="true" />

      <Drifters kind="dust" count={9} className="medallion__sparkles" />

      <GoldCrown className="medallion__crown" />
    </div>
  );
}
