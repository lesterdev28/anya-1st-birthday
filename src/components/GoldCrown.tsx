/**
 * The little gold crown, drawn inline so it is crisp at any size and can glow via CSS.
 *
 * Drawn as fine gold wire rather than as a solid shape. A filled, chunky crown reads as
 * clip-art the moment it sits on top of the painted artwork — the artwork has soft
 * edges and glazed light everywhere, and a flat vector silhouette is the one thing on
 * the screen that obviously is not painted. Thin strokes with pearl tips sit in that
 * world instead of on top of it.
 *
 * A generated `golden-crown` asset is part of the art direction; when it exists,
 * callers that want the painted illustration use FairyImage with this as the fallback.
 * This version is also what sits above the number 1 in the intro, where a vector edge
 * reads better against moving video than a raster would.
 */
import "./GoldCrown.css";

interface Props {
  readonly className?: string;
}

export function GoldCrown({ className }: Props) {
  return (
    <svg
      className={`gold-crown${className ? ` ${className}` : ""}`}
      viewBox="0 0 120 84"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="crown-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6e6c0" />
          <stop offset="45%" stopColor="#e4c68a" />
          <stop offset="100%" stopColor="#c4a052" />
        </linearGradient>
      </defs>

      <g
        fill="none"
        stroke="url(#crown-gold)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Three points, the centre one tallest, springing from a single swept line. */}
        <path d="M16 64 L22 32 L41 50 L60 22 L79 50 L98 32 L104 64" />
        {/* The band, drawn as two fine rules rather than a filled bar. */}
        <path d="M16 64 H104" />
        <path d="M19 72 H101" opacity="0.7" />
      </g>

      {/* Pearls at the tips. Ivory centres with a gold edge, so they catch the light. */}
      <g fill="#fbf5ea" stroke="url(#crown-gold)" strokeWidth="2">
        <circle cx="22" cy="31" r="3.4" />
        <circle cx="98" cy="31" r="3.4" />
      </g>

      {/* The centre point is finished with a small star rather than a pearl. */}
      <path
        d="M60 13 L62.4 19.6 L69 22 L62.4 24.4 L60 31 L57.6 24.4 L51 22 L57.6 19.6 Z"
        fill="url(#crown-gold)"
      />

      {/* Two gems on the band, in the palette's blush and lavender. */}
      <circle cx="46" cy="68" r="2.6" fill="#f3c9d4" />
      <circle cx="74" cy="68" r="2.6" fill="#c9b8e4" />
    </svg>
  );
}
