/**
 * A CSS/SVG-painted version of the same enchanted kingdom, drawn to the palette and
 * composition in tools/art-direction.md.
 *
 * This is the invitation's fallback layer, and it is deliberately *not* a stand-in for
 * the Higgsfield artwork. It exists for two reasons the brief calls for:
 *
 *   1. The invitation must never show a guest a loading screen. If the cinematic video
 *      cannot load — slow connection, codec, data saver — this paints the scene instantly.
 *   2. While a Higgsfield asset has not been generated yet, the page still reads as one
 *      finished world instead of a broken image.
 *
 * When the generated art lands, FairyImage picks it up from the manifest and this stops
 * being rendered in that slot. Nothing here is passed off as generated art.
 *
 * It is built as separate layers rather than as one SVG on purpose. A single portrait
 * viewBox cannot serve both a 9:16 phone and a 16:9 desktop — `slice` either crops the
 * horizon off a wide screen or blows the castle up to fill it. So the sky is a CSS
 * gradient, which scales to any ratio; the hills are stretched with
 * preserveAspectRatio="none", since a stretched hill silhouette is invisible; and the
 * castle is its own fixed-ratio element sized in CSS, which keeps it in proportion and
 * below the typography at every viewport.
 */
import "./PaintedKingdom.css";

interface Props {
  readonly className?: string;
}

/** Foreground flowers, placed as a percentage across the near hill. */
const FLOWERS = [4, 11, 19, 27, 36, 64, 72, 80, 88, 95];

export function PaintedKingdom({ className }: Props) {
  return (
    <div className={`painted-kingdom${className ? ` ${className}` : ""}`} aria-hidden="true">
      <div className="pk-sky" />

      {/* Clouds and moon, anchored to the top of the sky. */}
      <svg
        className="pk-air"
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMin slice"
        role="presentation"
      >
        <g className="pk-cloud pk-cloud--a" fill="#fbf5ea" opacity="0.72">
          <ellipse cx="250" cy="240" rx="130" ry="46" />
          <ellipse cx="330" cy="216" rx="92" ry="54" />
          <ellipse cx="180" cy="222" rx="78" ry="40" />
        </g>
        <g className="pk-cloud pk-cloud--b" fill="#f8e9ee" opacity="0.62">
          <ellipse cx="950" cy="420" rx="150" ry="50" />
          <ellipse cx="880" cy="396" rx="96" ry="56" />
          <ellipse cx="1040" cy="404" rx="82" ry="42" />
        </g>
        <g className="pk-cloud pk-cloud--c" fill="#fbf5ea" opacity="0.55">
          <ellipse cx="560" cy="96" rx="112" ry="38" />
          <ellipse cx="620" cy="78" rx="76" ry="44" />
        </g>
        <g className="pk-cloud pk-cloud--d" fill="#f4eaf6" opacity="0.5">
          <ellipse cx="150" cy="660" rx="160" ry="44" />
          <ellipse cx="230" cy="642" rx="100" ry="50" />
        </g>
        <g className="pk-cloud pk-cloud--e" fill="#f9edf1" opacity="0.46">
          <ellipse cx="1050" cy="740" rx="140" ry="40" />
          <ellipse cx="980" cy="722" rx="88" ry="46" />
        </g>

        <g className="pk-moon" transform="translate(1010 150)">
          <circle cx="0" cy="0" r="42" fill="#e4c68a" opacity="0.9" />
          <circle cx="16" cy="-9" r="40" fill="#c4d8ea" />
        </g>
      </svg>

      {/* The land: glow, castle, hills and flowers, anchored to the bottom. */}
      <div className="pk-land">
        <span className="pk-glow" />

        <svg className="pk-castle" viewBox="-170 -180 340 440" role="presentation">
          <defs>
            <linearGradient id="pk-tower" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fbf5ea" />
              <stop offset="100%" stopColor="#ecdfd0" />
            </linearGradient>
            <linearGradient id="pk-roof" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d9c6ea" />
              <stop offset="100%" stopColor="#c0a8db" />
            </linearGradient>
            <linearGradient id="pk-roof-blush" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f3c9d4" />
              <stop offset="100%" stopColor="#e0a8b8" />
            </linearGradient>
          </defs>

          {/* Outer towers */}
          <rect x="-150" y="70" width="46" height="150" fill="url(#pk-tower)" />
          <path d="M-150 70 L-127 12 L-104 70 Z" fill="url(#pk-roof-blush)" />
          <rect x="104" y="70" width="46" height="150" fill="url(#pk-tower)" />
          <path d="M104 70 L127 12 L150 70 Z" fill="url(#pk-roof-blush)" />

          {/* Inner towers */}
          <rect x="-92" y="34" width="52" height="186" fill="url(#pk-tower)" />
          <path d="M-92 34 L-66 -32 L-40 34 Z" fill="url(#pk-roof)" />
          <rect x="40" y="34" width="52" height="186" fill="url(#pk-tower)" />
          <path d="M40 34 L66 -32 L92 34 Z" fill="url(#pk-roof)" />

          {/* Central keep, taller, with the gold finial and pennant. */}
          <rect x="-34" y="-30" width="68" height="250" fill="url(#pk-tower)" />
          <path d="M-34 -30 L0 -112 L34 -30 Z" fill="url(#pk-roof)" />
          <circle cx="0" cy="-122" r="6" fill="#e4c68a" />
          <path d="M0 -128 L0 -166" stroke="#e4c68a" strokeWidth="3" />
          <path d="M0 -166 L34 -156 L0 -146 Z" fill="#e4c68a" />

          {/* Curtain wall and the low arched bridge. */}
          <rect x="-104" y="150" width="208" height="70" fill="#f5ece0" />
          <path d="M-28 220 L-28 176 Q0 150 28 176 L28 220 Z" fill="#c9b8e4" opacity="0.75" />
          <path d="M-150 220 L150 220 L120 246 L-120 246 Z" fill="#efe4d6" />

          {/* Windows */}
          <g fill="#b9a3d6" opacity="0.8">
            <rect x="-78" y="70" width="12" height="26" rx="6" />
            <rect x="-56" y="70" width="12" height="26" rx="6" />
            <rect x="44" y="70" width="12" height="26" rx="6" />
            <rect x="66" y="70" width="12" height="26" rx="6" />
            <rect x="-8" y="10" width="16" height="34" rx="8" />
            <rect x="-136" y="108" width="12" height="26" rx="6" />
            <rect x="118" y="108" width="12" height="26" rx="6" />
          </g>
        </svg>

        {/* Hills stretch to fill the band; a stretched silhouette reads fine. */}
        <svg
          className="pk-hills"
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
          role="presentation"
        >
          <defs>
            <linearGradient id="pk-hill-far" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cfdcc9" />
              <stop offset="100%" stopColor="#bccdb6" />
            </linearGradient>
            <linearGradient id="pk-hill-mid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c3d3be" />
              <stop offset="100%" stopColor="#adc0a6" />
            </linearGradient>
            <linearGradient id="pk-hill-near" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b3c6ad" />
              <stop offset="100%" stopColor="#9bb195" />
            </linearGradient>
          </defs>

          <path
            d="M0 96 Q 180 34 400 66 T 820 54 Q 1030 32 1200 74 L1200 400 L0 400 Z"
            fill="url(#pk-hill-far)"
          />
          <path
            d="M0 178 Q 240 118 520 156 T 1000 142 Q 1120 126 1200 156 L1200 400 L0 400 Z"
            fill="url(#pk-hill-mid)"
          />
          <path
            d="M600 170 Q 556 250 664 320 T 620 400"
            fill="none"
            stroke="#e8d9b4"
            strokeWidth="38"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M0 286 Q 280 232 600 274 T 1200 262 L1200 400 L0 400 Z"
            fill="url(#pk-hill-near)"
          />
        </svg>

        {/* Foreground flowers, sized in CSS so they stay in proportion. */}
        <div className="pk-flowers">
          {FLOWERS.map((left, index) => (
            <svg
              key={left}
              className={`pk-flower pk-flower--${index % 4}`}
              style={{ left: `${left}%` }}
              viewBox="-12 -40 24 44"
              role="presentation"
            >
              <path d="M0 0 L0 -26" stroke="#8fa889" strokeWidth="3" />
              <circle cx="0" cy="-30" r="7.5" fill={index % 2 === 0 ? "#f3c9d4" : "#c9b8e4"} />
              <circle cx="0" cy="-30" r="2.8" fill="#e4c68a" />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
}
