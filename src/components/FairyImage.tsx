/**
 * Displays one optimized image — a Higgsfield asset or a photo — with an AVIF/WebP
 * picture, a blurred placeholder while it decodes, and lazy loading below the fold.
 *
 * When the asset is not in the manifest (not generated yet) this renders `fallback`
 * instead. That is what keeps the invitation whole while the Higgsfield art is pending.
 */
import { useState, type ReactNode } from "react";
import { responsiveImage } from "../lib/assets";
import "./FairyImage.css";

interface Props {
  readonly id: string;
  readonly alt: string;
  /** Rendered when the asset has not been generated yet. */
  readonly fallback?: ReactNode;
  readonly className?: string;
  /** The hero is above the fold and must not be lazy. */
  readonly priority?: boolean;
  /** Passed to the <img> sizes attribute; defaults to full viewport width. */
  readonly sizes?: string;
}

export function FairyImage({ id, alt, fallback = null, className, priority = false, sizes = "100vw" }: Props) {
  const image = responsiveImage(id);
  const [loaded, setLoaded] = useState(false);

  if (!image) return <>{fallback}</>;

  return (
    <div
      className={`fairy-image${className ? ` ${className}` : ""}`}
      style={{
        // Reserving the ratio up front means no layout shift when the image arrives.
        aspectRatio: String(image.aspectRatio),
        backgroundImage: `url(${image.placeholder})`,
      }}
    >
      <picture>
        <source type="image/avif" srcSet={image.avifSrcSet} sizes={sizes} />
        <source type="image/webp" srcSet={image.srcSet} sizes={sizes} />
        <img
          src={image.src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          className={loaded ? "is-loaded" : undefined}
        />
      </picture>
    </div>
  );
}
