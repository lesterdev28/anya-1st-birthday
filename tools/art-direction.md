# Master fairy-tale art direction

Every Higgsfield generation for this invitation is made against this one specification.
Nothing is prompted independently. `art-direction.ts` holds the machine-readable version
of exactly what is written here, and `generate.ts` composes every prompt from it, so the
castle in the opening video is the same castle as the one in the hero image.

**If you are generating these assets: do not write your own prompts.** Run
`npm run generate` and let it assemble them. Editing a prompt means editing
`art-direction.ts`, so the change applies everywhere at once.

## The world

An original enchanted kingdom, invented for this invitation. Nothing in it is drawn from
an existing story, film, franchise or theme park. There are no characters in it — it is a
landscape, and the only figure who ever appears on the site is Anya, in her real
photographs.

## Medium and finish

Premium cinematic fairy-tale storybook illustration. Painterly digital artwork with soft
gouache and watercolour texture and a fine paper grain. Dreamy volumetric lighting, warm
golden key light from the upper right, luminous atmospheric haze, soft shallow depth of
field. Fine floating golden particles and tiny warm fireflies. Delicate hand-illustrated
detail — elegant and refined, tender in mood, never cartoonish and never clip-art.

## Palette

Stated numerically in the prompts so the model holds the same colours across scenes.

| Colour | Hex |
| --- | --- |
| Pastel lavender | `#C9B8E4` |
| Blush pink | `#F3C9D4` |
| Powder blue | `#BCD6EC` |
| Warm ivory | `#FBF5EA` |
| Champagne gold | `#E4C68A` |
| Soft peach | `#F6D3BC` |
| Muted sage | `#C3D3BE` |

Low saturation, high luminosity. No strong or vivid colour anywhere. These are the same
tokens the site's CSS uses (`src/styles/global.css`), so the painted layers and the
generated art sit in one world.

## The castle (canon — reused verbatim in every prompt)

A single original pastel fairy-tale castle: slender pale-ivory stone towers with tall
narrow arched windows; five conical spires roofed in pale lavender and blush pink; one
taller central keep crowned with a champagne-gold finial and a small gold pennant; a low
arched stone bridge at its base; soft climbing vines of tiny pale flowers on the lower
walls. It stands on a green rolling hill.

This paragraph is pasted into every prompt that shows the castle. That repetition is the
mechanism that keeps the building consistent — do not paraphrase it.

## The landscape (canon)

Soft rolling hills in muted sage and pale mint. A winding pale-gold pathway curving
gently toward the castle. Scattered clusters of small blush and lavender wildflowers. A
few slender birch-like trees with soft pastel foliage. Pale butterflies drifting low.

## The sky (canon)

Graduating from blush pink at the horizon, through lavender, to powder blue at the top.
Soft rounded cumulus clouds rimmed in warm gold. Tiny golden stars and a slim crescent
moon high in the frame.

## Never

No text, letters, words, numerals, watermarks, logos or signatures in any generated
asset — **all invitation typography is rendered by the website in HTML/CSS** so that
spelling, dates and RSVP details stay exact and editable. No Disney characters, no
recognisable or copyrighted princesses, no franchise or theme-park castles. No cartoon
outlines, no flat vector look, no harsh saturated colour, no photorealistic human faces,
no modern objects.

## Negative space

The hero images and the chapter banners must leave a calm, uncluttered area across the
centre and upper-centre — soft open sky with no detail — because the invitation
typography is laid over it. Detail belongs in the lower third and at the outer edges.

## The asset library

Small and coherent on purpose; the brief asks for no unnecessary variations.

**Hero** — `fairytale-castle-hero-mobile` (1152×2048, the 9:16 primary),
`fairytale-castle-hero-desktop` (2048×1152).

**Video** — `fairytale-opening` (the cinematic introduction, ~5s) and `castle-reveal`
(the clouds parting, ~5s). Both are slow, gentle push-ins: no rapid zoom, no shake, no
chaotic particles. Both end on a composition that matches the hero artwork, so the site
can cut from video to castle reveal to static hero without a visible mismatch.

**Storybook** — `storybook-cover` (antique cover, gold border, crown emblem, floral
ornament) and `storybook-pages` (blank parchment spread). The page-turn itself is a web
animation; these are only the artwork it animates.

**Decorations** — `cloud-bank`, `golden-crown`, `butterflies-and-flowers`,
`castle-silhouette`, `crescent-moon-and-stars`, `gold-ornamental-border`. Each is
composed on a plain flat field so it can be isolated and reused across the page.

**Chapter backgrounds** — `month-clouds-and-stars`, `month-magical-garden`,
`month-butterflies-and-blossoms`, `month-enchanted-forest`, `month-castle-finale`. The
decoration deliberately grows richer through the twelve months, ending at the castle for
"One Year of Magic".

## Order of work

1. Generate `fairytale-castle-hero-mobile` first and get it signed off. It establishes
   the look.
2. Generate the rest against it. If the hero comes back wrong, fix the canon in
   `art-direction.ts` before generating anything else — that is the whole point of
   keeping the prompts in one file.

## What is not generated

The CSS/SVG painted kingdom in `src/components/PaintedKingdom.tsx` is the site's fallback
layer, not artwork standing in for a Higgsfield asset. It exists so a guest whose
connection cannot load the video never sees a loading screen, and so the page reads as
whole while assets are still pending. No stock imagery is used anywhere in this project.
