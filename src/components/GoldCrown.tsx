/**
 * The little gold crown, drawn inline so it is crisp at any size and can glow via CSS.
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

      {/* Five points, each tipped with a pearl, over a banded base. */}
      <path
        d="M12 66 L6 22 L30 42 L46 10 L60 34 L74 10 L90 42 L114 22 L108 66 Z"
        fill="url(#crown-gold)"
      />
      <rect x="12" y="66" width="96" height="12" rx="4" fill="url(#crown-gold)" />

      <g fill="#fbf5ea">
        <circle cx="6" cy="20" r="4.5" />
        <circle cx="46" cy="8" r="4.5" />
        <circle cx="74" cy="8" r="4.5" />
        <circle cx="114" cy="20" r="4.5" />
        <circle cx="60" cy="32" r="4" />
      </g>

      {/* Two small gems on the band, in the palette's blush and lavender. */}
      <circle cx="42" cy="72" r="4" fill="#f3c9d4" />
      <circle cx="78" cy="72" r="4" fill="#c9b8e4" />
      <circle cx="60" cy="72" r="4.5" fill="#fbf5ea" />
    </svg>
  );
}
