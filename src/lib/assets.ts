/**
 * The bridge between generated media on disk and the components that display it.
 *
 * `tools/optimize.ts` writes src/data/media-manifest.json listing every asset that has
 * actually been built, with only the widths that exist. Components ask this module for
 * an asset; if it is not in the manifest it has not been generated yet, and the caller
 * renders its painted fallback instead. That way a missing Higgsfield asset is a known
 * state rather than a broken image.
 */
import manifest from "../data/media-manifest.json";

export interface ManifestEntry {
  readonly base: string;
  readonly widths: readonly number[];
  readonly aspectRatio: number;
  readonly placeholder: string;
}

const assets = manifest as Record<string, ManifestEntry>;

/** Every art id the invitation expects, so a missing one is obvious in one place. */
export const ART_IDS = [
  "fairytale-castle-hero-mobile",
  "fairytale-castle-hero-desktop",
  "storybook-cover",
  "storybook-pages",
  "cloud-bank",
  "golden-crown",
  "butterflies-and-flowers",
  "castle-silhouette",
  "crescent-moon-and-stars",
  "gold-ornamental-border",
  "month-clouds-and-stars",
  "month-magical-garden",
  "month-butterflies-and-blossoms",
  "month-enchanted-forest",
  "month-castle-finale",
] as const;

export type ArtId = (typeof ART_IDS)[number];

/**
 * The cinematic clip, served straight from public/ rather than the manifest.
 *
 * There is one clip rather than two: it is generated with the hero artwork as its
 * final frame, so the push-in through the clouds arrives on exactly the still the
 * invitation then holds. A separate castle-reveal clip would only repeat that.
 */
export const VIDEO_SOURCES = {
  "fairytale-opening": {
    webm: "/invitation/higgsfield/video/fairytale-opening.webm",
    mp4: "/invitation/higgsfield/video/fairytale-opening.mp4",
    poster: "/invitation/higgsfield/video/fairytale-opening-poster.webp",
  },
} as const;

export type VideoId = keyof typeof VIDEO_SOURCES;

/**
 * The background music, served straight from public/ like the cinematic.
 *
 * Opus first and AAC second: every browser plays one of the two, and Opus is the
 * smaller of them for anything this sparse.
 */
export const AUDIO_SOURCES = {
  /* The three music beds. One key, one tempo, so any two can cross-fade mid-bar. */
  lullaby: {
    webm: "/invitation/audio/music-box-lullaby.webm",
    /* AAC, in a plain .mp4 container: some static hosts refuse to serve .m4a. */
    mp4: "/invitation/audio/music-box-lullaby.mp4",
  },
  sky: {
    webm: "/invitation/audio/sky-ambience.webm",
    mp4: "/invitation/audio/sky-ambience.mp4",
  },
  shimmer: {
    webm: "/invitation/audio/shimmer.webm",
    mp4: "/invitation/audio/shimmer.mp4",
  },

  /* One-shots. */
  enter: {
    webm: "/invitation/audio/sfx-enter.webm",
    mp4: "/invitation/audio/sfx-enter.mp4",
  },
  chime: {
    webm: "/invitation/audio/sfx-chime.webm",
    mp4: "/invitation/audio/sfx-chime.mp4",
  },
  sparkle: {
    webm: "/invitation/audio/sfx-sparkle.webm",
    mp4: "/invitation/audio/sfx-sparkle.mp4",
  },
  bloom: {
    webm: "/invitation/audio/sfx-bloom.webm",
    mp4: "/invitation/audio/sfx-bloom.mp4",
  },
} as const;

export type SoundId = keyof typeof AUDIO_SOURCES;

export function getAsset(id: string): ManifestEntry | null {
  return assets[id] ?? null;
}

export function hasAsset(id: string): boolean {
  return id in assets;
}

/** Which of the expected art assets are still missing. Surfaced by the dev banner. */
export function missingArt(): ArtId[] {
  return ART_IDS.filter((id) => !hasAsset(id));
}

export interface ResponsiveImage {
  readonly src: string;
  readonly srcSet: string;
  readonly avifSrcSet: string;
  readonly placeholder: string;
  readonly aspectRatio: number;
}

/**
 * Builds the <picture> sources for an asset. Returns null when the asset has not been
 * generated, so callers can branch once rather than rendering a broken image.
 */
export function responsiveImage(id: string): ResponsiveImage | null {
  const entry = getAsset(id);
  if (!entry) return null;

  const widths = [...entry.widths].sort((a, b) => a - b);
  return {
    // The widest built file is the sensible default for a browser ignoring srcset.
    src: `${entry.base}-${widths[widths.length - 1]}.webp`,
    srcSet: widths.map((width) => `${entry.base}-${width}.webp ${width}w`).join(", "),
    avifSrcSet: widths.map((width) => `${entry.base}-${width}.avif ${width}w`).join(", "),
    placeholder: entry.placeholder,
    aspectRatio: entry.aspectRatio,
  };
}
