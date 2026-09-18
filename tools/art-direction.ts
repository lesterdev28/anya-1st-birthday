/**
 * MASTER FAIRY-TALE ART DIRECTION
 *
 * This file is the single source of truth for every Higgsfield generation in this
 * project. Every scene prompt is assembled from the same canonical fragments below,
 * so the castle, landscape, sky, palette and lighting stay identical across the hero
 * artwork, the cinematic videos, the storybook pages and the decorative asset library.
 *
 * Rule: never write a one-off prompt. Add a scene to SCENES and let buildPrompt()
 * compose it, so a change to the world is a change in one place.
 *
 * The written version of this spec, for humans, is tools/art-direction.md.
 */

/** The rendering medium and finish. Applies to every image. */
export const STYLE_CORE =
  "Premium cinematic fairy-tale storybook illustration. Painterly digital artwork with " +
  "soft gouache and watercolour texture and fine paper grain. A completely original " +
  "invented world. Dreamy volumetric lighting, warm golden key light from the upper " +
  "right, luminous atmospheric haze, soft shallow depth of field with a gently blurred " +
  "background. Fine floating golden particles and tiny warm fireflies drifting through " +
  "the air. Delicate whimsical hand-illustrated detail, elegant and refined, tender and " +
  "gentle in mood.";

/** The palette, stated numerically so the model holds the same colours every time. */
export const PALETTE_CANON =
  "Strict pastel palette: lavender #C9B8E4, blush pink #F3C9D4, powder blue #BCD6EC, " +
  "warm ivory #FBF5EA, champagne gold #E4C68A, soft peach #F6D3BC, muted sage green " +
  "#C3D3BE. Low saturation, high luminosity, no strong or vivid colour anywhere.";

/** The castle. Reused verbatim so the same building appears in every asset. */
export const CASTLE_CANON =
  "The castle is a single original pastel fairy-tale castle: slender pale-ivory stone " +
  "towers with tall narrow arched windows, five conical spires roofed in pale lavender " +
  "and blush pink, one taller central keep crowned with a champagne-gold finial and a " +
  "small gold pennant, a low arched stone bridge at its base, and soft climbing vines " +
  "of tiny pale flowers on the lower walls. It stands on a green rolling hill. It is an " +
  "invented building, not modelled on any existing, historical or franchise castle.";

/** The land the castle sits in. */
export const LANDSCAPE_CANON =
  "Soft rolling hills in muted sage and pale mint, a winding pale-gold pathway curving " +
  "gently toward the castle, scattered clusters of small blush and lavender wildflowers, " +
  "a few slender birch-like trees with soft pastel foliage, pale butterflies drifting low.";

/** The sky. */
export const SKY_CANON =
  "The sky graduates from blush pink at the horizon, through lavender, to powder blue at " +
  "the top. Soft rounded cumulus clouds rimmed in warm gold light. Tiny golden stars and " +
  "a slim crescent moon high in the frame.";

/** Things that must never appear. */
export const NEGATIVE_CANON =
  "No text, no letters, no words, no numerals, no watermark, no logo, no signature. " +
  "No Disney characters, no recognisable or copyrighted princesses, no franchise or " +
  "theme-park castles. No cartoon outlines, no flat clip-art, no cheap vector look, no " +
  "harsh saturated colour, no photorealistic human faces, no modern objects.";

export type Category = "hero" | "backgrounds" | "storybook" | "decorations";

export interface Scene {
  /** Output filename stem, e.g. "fairytale-castle-hero-mobile". */
  readonly id: string;
  /** Which folder under public/invitation/higgsfield/ it belongs in. */
  readonly category: Category;
  /** One of the SoulSize values. */
  readonly size: string;
  /** The subject and composition. The canon fragments are appended automatically. */
  readonly subject: string;
  /** Canon fragments to include. Decorative isolated assets skip landscape and sky. */
  readonly canon?: ReadonlyArray<"castle" | "landscape" | "sky">;
  /** Extra composition notes appended after the canon. */
  readonly composition?: string;
}

/**
 * Every scene in the invitation, in generation order. The hero comes first because
 * the rest of the world is signed off against it.
 */
export const SCENES: readonly Scene[] = [
  {
    id: "fairytale-castle-hero-mobile",
    category: "hero",
    size: "1152x2048",
    subject:
      "A breathtaking enchanted fairy-tale kingdom, seen as a wide establishing view. " +
      "The castle stands small in the distance on the horizon, above soft rolling hills. " +
      "Dreamy clouds gather around and behind it. The foreground holds delicate " +
      "wildflowers, pale butterflies and tiny glowing fireflies. Small golden stars and " +
      "magical particles float throughout. Warm golden sunlight.",
    canon: ["castle", "landscape", "sky"],
    composition:
      "Vertical 9:16 composition. Critically important: leave a large area of calm, " +
      "uncluttered negative space across the centre and upper-centre of the frame — soft " +
      "open sky with only faint haze and a few tiny particles there, no detail, nothing " +
      "busy — because invitation typography will be laid over that area. Push all detail " +
      "to the lower third and the outer edges. The castle sits low, near the horizon line " +
      "in the lower-middle of the frame.",
  },
  {
    id: "fairytale-castle-hero-desktop",
    category: "hero",
    size: "2048x1152",
    subject:
      "The same enchanted fairy-tale kingdom as the mobile hero, recomposed wide. The " +
      "castle stands in the distance, slightly right of centre, above soft rolling hills. " +
      "Dreamy clouds surround it. The foreground spreads with delicate wildflowers, pale " +
      "butterflies and tiny glowing fireflies. Golden stars and magical particles drift " +
      "through the air. Warm golden sunlight.",
    canon: ["castle", "landscape", "sky"],
    composition:
      "Wide 16:9 cinematic composition. Leave calm, uncluttered negative space across the " +
      "centre and upper-centre — soft open sky with no detail there — for typography. " +
      "Detail lives in the lower third and the left and right edges.",
  },
  {
    id: "storybook-cover",
    category: "storybook",
    size: "1536x2048",
    subject:
      "An antique magical storybook lying closed, seen straight on from above. The cover " +
      "is soft blush-and-ivory cloth with a wide ornate champagne-gold border embossed " +
      "around its edge, a delicate gold crown emblem centred on the cover, fine floral " +
      "fairy-tale ornamentation in the corners, and a scatter of tiny gold stars. Warm " +
      "gold light catches the embossing.",
    canon: [],
    composition:
      "The book fills the frame, centred, on a plain soft lavender backdrop. Leave the " +
      "centre of the cover below the crown emblem clear for typography. Flat straight-on " +
      "view, no perspective distortion.",
  },
  {
    id: "storybook-pages",
    category: "storybook",
    size: "2048x1536",
    subject:
      "The interior of the same antique storybook, opened flat to two blank facing pages " +
      "of warm ivory parchment with soft deckled edges and a faint aged texture. A slim " +
      "champagne-gold rule and a delicate floral vine ornament run around the outer " +
      "margin of each page. A few tiny gold stars in the corners.",
    canon: [],
    composition:
      "Straight-on view of the open spread, filling the frame. Both pages are completely " +
      "blank in their centres — empty parchment, no text, no illustration there — so the " +
      "website can lay content over them.",
  },
  {
    id: "cloud-bank",
    category: "decorations",
    size: "2048x1152",
    subject:
      "A soft bank of rounded pastel cumulus clouds in blush pink, lavender and ivory, " +
      "rimmed with warm gold light, with a few tiny golden particles drifting among them.",
    canon: [],
    composition:
      "The clouds sit across the lower half of the frame against a plain flat powder-blue " +
      "field, so the asset can be cut out and layered. No horizon, no ground, no castle.",
  },
  {
    id: "golden-crown",
    category: "decorations",
    size: "1536x1536",
    subject:
      "A small delicate champagne-gold crown for a baby's first birthday: five slender " +
      "points each tipped with a tiny pearl, a fine band set with two small blush-pink " +
      "and lavender gems, soft warm gold glow and a few sparkles around it.",
    canon: [],
    composition:
      "The crown alone, centred, on a plain flat pale-lavender background with no scene " +
      "and no shadow, so it can be isolated cleanly. Straight-on view.",
  },
  {
    id: "butterflies-and-flowers",
    category: "decorations",
    size: "1536x1536",
    subject:
      "A small cluster of delicate pale butterflies in blush pink, lavender and powder " +
      "blue with faint gold edging on their wings, together with a few small wildflowers " +
      "and slender leaves in the same pastels, and a scatter of golden sparkles.",
    canon: [],
    composition:
      "The cluster alone, centred, on a plain flat warm-ivory background with no scene, " +
      "so the elements can be isolated and reused separately.",
  },
  {
    id: "castle-silhouette",
    category: "decorations",
    size: "2048x1152",
    subject:
      "A soft distant silhouette of the castle and its hill, rendered as a pale flat " +
      "lavender shape with a faint warm-gold rim of light along its upper edges, as if " +
      "seen far away through morning haze.",
    canon: ["castle"],
    composition:
      "The silhouette sits along the bottom of the frame against a plain flat ivory field, " +
      "with nothing else in the image, so it can be used as a page footer band.",
  },
  {
    id: "crescent-moon-and-stars",
    category: "decorations",
    size: "1536x1536",
    subject:
      "A slim champagne-gold crescent moon with a soft luminous halo, surrounded by a " +
      "loose scatter of tiny gold stars of varying sizes and a few drifting sparkles.",
    canon: [],
    composition:
      "The moon and stars alone, centred, on a plain flat deep-lavender background so the " +
      "asset can be isolated. No landscape, no clouds.",
  },
  {
    id: "gold-ornamental-border",
    category: "decorations",
    size: "1536x2048",
    subject:
      "An ornate champagne-gold decorative border frame in a delicate fairy-tale style: " +
      "fine scrollwork, small flowers, slender leaves and tiny stars woven through it, " +
      "with a soft warm glow.",
    canon: [],
    composition:
      "The border runs around the outer edge of the frame only. The entire centre is " +
      "plain flat warm ivory and completely empty, so content can sit inside it.",
  },
  {
    id: "month-clouds-and-stars",
    category: "backgrounds",
    size: "2048x1152",
    subject:
      "A very soft, quiet dawn sky of pale clouds with a few tiny golden stars — the " +
      "gentlest and emptiest scene in the series, almost bare.",
    canon: ["sky"],
    composition:
      "Wide banner composition, extremely simple and low-contrast, with a large empty " +
      "area in the middle. This is the first and least decorated chapter background.",
  },
  {
    id: "month-magical-garden",
    category: "backgrounds",
    size: "2048x1152",
    subject:
      "A small enchanted garden of pastel wildflowers and soft grasses, with a few " +
      "fireflies and golden particles beginning to appear among them.",
    canon: ["landscape"],
    composition:
      "Wide banner composition. Detail along the lower edge, the upper two thirds soft " +
      "and open. Slightly more decorated than the clouds chapter.",
  },
  {
    id: "month-butterflies-and-blossoms",
    category: "backgrounds",
    size: "2048x1152",
    subject:
      "A drift of pale butterflies moving through flowering branches and soft blossoms, " +
      "with golden particles and a warmer, richer glow than the earlier chapters.",
    canon: ["landscape"],
    composition:
      "Wide banner composition. Detail along the lower edge and upper corners, the centre " +
      "left open.",
  },
  {
    id: "month-enchanted-forest",
    category: "backgrounds",
    size: "2048x1152",
    subject:
      "A gentle enchanted forest of slender pastel trees with light falling between them " +
      "in warm golden shafts, fireflies through the trunks, and a soft mist along the " +
      "ground. Richer and deeper than the earlier chapters.",
    canon: ["landscape"],
    composition: "Wide banner composition, with the centre of the frame left open and hazy.",
  },
  {
    id: "month-castle-finale",
    category: "backgrounds",
    size: "2048x1152",
    subject:
      "The full enchanted kingdom at its most radiant: the castle clear on its hill, " +
      "flowers, butterflies, fireflies, golden particles and warm light everywhere. The " +
      "richest and most celebratory scene of the series.",
    canon: ["castle", "landscape", "sky"],
    composition:
      "Wide banner composition. The castle sits right of centre, with the centre-left " +
      "left open for typography.",
  },
];

/** Composes a full prompt for one scene from the shared canon. */
export function buildPrompt(scene: Scene): string {
  const canon = scene.canon ?? [];
  const parts = [
    scene.subject,
    canon.includes("castle") ? CASTLE_CANON : "",
    canon.includes("landscape") ? LANDSCAPE_CANON : "",
    canon.includes("sky") ? SKY_CANON : "",
    scene.composition ?? "",
    STYLE_CORE,
    PALETTE_CANON,
    NEGATIVE_CANON,
  ];
  return parts.filter(Boolean).join(" ");
}

/** The two cinematic video shots. Both describe the same world as the images. */
export interface VideoScene {
  readonly id: string;
  readonly prompt: string;
  readonly duration: 5 | 10;
  readonly aspectRatio: string;
}

export const VIDEO_SCENES: readonly VideoScene[] = [
  {
    id: "fairytale-opening",
    duration: 5,
    aspectRatio: "9:16",
    prompt:
      "A slow, elegant cinematic push-in. The shot begins high above a bank of soft " +
      "pastel clouds in blush pink, lavender and ivory, with tiny golden stars twinkling " +
      "in the distance. The camera drifts gently forward through the clouds. A single " +
      "glowing shooting star traces softly across the sky. The clouds part to reveal an " +
      "enchanted pastel castle below. Warm golden light begins to rise from behind the " +
      "castle. Tiny magical particles and fireflies drift toward the camera. The camera " +
      "continues its gentle push toward the castle and settles with the castle clearly " +
      "visible in the lower-middle of the frame and calm open sky above it. " +
      CASTLE_CANON +
      " " +
      SKY_CANON +
      " " +
      STYLE_CORE +
      " " +
      PALETTE_CANON +
      " Camera movement is slow, smooth and graceful throughout — no rapid zoom, no " +
      "shake, no whip pan, no chaotic particle bursts. " +
      NEGATIVE_CANON,
  },
  {
    id: "castle-reveal",
    duration: 5,
    aspectRatio: "9:16",
    prompt:
      "Soft pastel clouds fill the frame, obscuring an enchanted castle behind them. The " +
      "clouds slowly and gently drift apart. Golden particles begin to glow and rise. The " +
      "castle gradually emerges into view. A subtle ray of warm golden light falls across " +
      "its tallest tower. A few pale butterflies drift through the foreground. The shot " +
      "ends holding on the castle on its hill, framed by soft open sky above it. " +
      CASTLE_CANON +
      " " +
      LANDSCAPE_CANON +
      " " +
      SKY_CANON +
      " " +
      STYLE_CORE +
      " " +
      PALETTE_CANON +
      " The camera barely moves — a very slow, almost imperceptible push in. No rapid " +
      "zoom, no shake, no chaotic motion. " +
      NEGATIVE_CANON,
  },
];
