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
 */
import "./PaintedKingdom.css";

interface Props {
  /** "full" paints sky, hills and castle. "sky" paints only the graduated sky. */
  readonly variant?: "full" | "sky";
  readonly className?: string;
}

export function PaintedKingdom({ variant = "full", className }: Props) {
  return (
    <div className={`painted-kingdom${className ? ` ${className}` : ""}`} aria-hidden="true">
      <svg
        className="painted-kingdom__svg"
        viewBox="0 0 1200 2000"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
      >
        <defs>
          <linearGradient id="pk-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bcd6ec" />
            <stop offset="42%" stopColor="#c9b8e4" />
            <stop offset="72%" stopColor="#f3c9d4" />
            <stop offset="100%" stopColor="#f6d3bc" />
          </linearGradient>

          {/* The warm glow that sits behind the castle, matching the art direction's
              "golden light rising from behind the castle". */}
          <radialGradient id="pk-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#f7e2b4" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#e4c68a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#e4c68a" stopOpacity="0" />
          </radialGradient>

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

        <rect width="1200" height="2000" fill="url(#pk-sky)" />

        {variant === "full" && (
          <>
            {/* Golden light behind the castle. */}
            <ellipse cx="600" cy="1355" rx="430" ry="300" fill="url(#pk-glow)" />

            {/* Clouds. Kept soft and rounded, per the canon. */}
            <g className="pk-clouds" opacity="0.85">
              <g className="pk-cloud pk-cloud--a" fill="#fbf5ea" opacity="0.78">
                <ellipse cx="250" cy="520" rx="130" ry="46" />
                <ellipse cx="330" cy="496" rx="92" ry="54" />
                <ellipse cx="180" cy="502" rx="78" ry="40" />
              </g>
              <g className="pk-cloud pk-cloud--b" fill="#f8e9ee" opacity="0.7">
                <ellipse cx="950" cy="700" rx="150" ry="50" />
                <ellipse cx="880" cy="676" rx="96" ry="56" />
                <ellipse cx="1040" cy="684" rx="82" ry="42" />
              </g>
              <g className="pk-cloud pk-cloud--c" fill="#fbf5ea" opacity="0.6">
                <ellipse cx="560" cy="330" rx="112" ry="38" />
                <ellipse cx="620" cy="312" rx="76" ry="44" />
              </g>
              <g className="pk-cloud pk-cloud--d" fill="#f4eaf6" opacity="0.66">
                <ellipse cx="180" cy="1080" rx="160" ry="44" />
                <ellipse cx="260" cy="1062" rx="100" ry="50" />
              </g>
              <g className="pk-cloud pk-cloud--e" fill="#f9edf1" opacity="0.6">
                <ellipse cx="1030" cy="1130" rx="140" ry="40" />
                <ellipse cx="960" cy="1112" rx="88" ry="46" />
              </g>
            </g>

            {/* Crescent moon, high in the frame as the canon specifies. */}
            <g className="pk-moon" transform="translate(940 250)">
              <circle cx="0" cy="0" r="42" fill="#e4c68a" opacity="0.9" />
              <circle cx="16" cy="-9" r="40" fill="#bcd6ec" />
            </g>

            {/* Far hills. */}
            <path d="M0 1500 Q 180 1392 400 1450 T 820 1428 Q 1030 1392 1200 1462 L1200 2000 L0 2000 Z" fill="url(#pk-hill-far)" />

            {/* The castle, sitting low near the horizon with open sky above it. */}
            <g className="pk-castle" transform="translate(600 1180) scale(1.18)">
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
            </g>

            {/* Middle hills, in front of the castle's base. */}
            <path d="M0 1590 Q 240 1500 520 1560 T 1000 1540 Q 1120 1516 1200 1560 L1200 2000 L0 2000 Z" fill="url(#pk-hill-mid)" />

            {/* The winding pale-gold pathway. */}
            <path
              d="M600 1580 Q 560 1700 660 1790 T 620 2000"
              fill="none"
              stroke="#e8d9b4"
              strokeWidth="46"
              strokeLinecap="round"
              opacity="0.72"
            />

            {/* Near hill, framing the foreground. */}
            <path d="M0 1760 Q 280 1676 600 1740 T 1200 1720 L1200 2000 L0 2000 Z" fill="url(#pk-hill-near)" />

            {/* Foreground wildflowers. */}
            <g className="pk-flowers">
              {[
                [70, 1880], [150, 1922], [244, 1868], [330, 1930], [430, 1892],
                [780, 1898], [880, 1936], [962, 1874], [1060, 1926], [1140, 1884],
              ].map(([x, y], index) => (
                <g key={`${x}-${y}`} transform={`translate(${x} ${y})`} className={`pk-flower pk-flower--${index % 4}`}>
                  <path d="M0 0 L0 -26" stroke="#9bb195" strokeWidth="3" />
                  <circle cx="0" cy="-30" r="7" fill={index % 2 === 0 ? "#f3c9d4" : "#c9b8e4"} />
                  <circle cx="0" cy="-30" r="2.6" fill="#e4c68a" />
                </g>
              ))}
            </g>
          </>
        )}
      </svg>
    </div>
  );
}
