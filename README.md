# Anya's first birthday invitation

An animated fairy-tale invitation: Higgsfield-generated cinematic artwork, Anya's real
photographs, and web animation for everything that does not need to be generated media.

**Saturday 10 October 2026 · 2:00–6:00 PM · Bantug Lake Ranch**

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck, then a production build into dist/
```

The site is a static build and can be served from any static host.

## How the media works

Generated art is never referenced by a hard-coded URL. `tools/optimize.ts` writes
`src/data/media-manifest.json` listing every asset that has actually been built, with
only the widths that exist on disk. Components ask `src/lib/assets.ts` for an asset:

- **present in the manifest** — rendered as an AVIF/WebP `<picture>` with a blurred
  placeholder and lazy loading
- **absent** — the component renders its painted fallback instead

So a Higgsfield asset that has not been generated yet is a known state, not a broken
image. Dropping the real files in and re-running `npm run optimize` is all it takes to
switch a slot over.

### Current status of the generated assets

**None of the Higgsfield assets have been generated yet.** Every art slot falls back to
the painted kingdom, and the site is complete and usable without them.

Two separate things blocked generation, in order:

1. **Network egress** — `api.higgsfield.ai` was not in the session environment's
   allowlist. Resolved; the host is reachable and the credentials authenticate.
2. **API credits** — the API bills a balance separate from a Higgsfield web
   subscription, and that balance is empty. This is the current blocker.
   `docs/generate-on-your-machine.md` is the way around it: it makes the same assets
   from the same canon, on a machine signed in to the subscription.

One trap worth knowing: `@higgsfield/client` maps *every* HTTP 403 to
`NotEnoughCreditsError: Not enough credits`, including an egress proxy's blocked-host
denial, which is what made the first problem look like the second. Check the raw HTTP
response before concluding anything about the balance.

## Generating the art

Read `tools/art-direction.md` first. Every prompt is composed from the shared canon in
`tools/art-direction.ts` — do not write one-off prompts.

```bash
cd tools
npm install

npm run generate -- --list                            # every scene id
npm run generate -- --dry-run --scene <id>            # print the prompt, call nothing
npm run generate -- --scene fairytale-castle-hero-mobile   # the hero, first
npm run generate -- --images                          # every image scene
npm run generate -- --videos                          # both cinematic clips
```

Generation needs `HF_CREDENTIALS` (format `key-id:key-secret`) in the environment or in
`tools/.env.local`. It is never logged or committed.

**This path bills Higgsfield API credits, which are a separate balance from a Higgsfield
web subscription.** If it fails with a credits error, that balance is the reason — see
`docs/generate-on-your-machine.md`, which covers making the same assets from a machine
signed in to the subscription, through the CLI or the web app. Regenerate that guide with
`npm run handoff` after any change to the canon; it is written from `art-direction.ts`,
never by hand.

Raw output lands in `public/invitation/higgsfield/<category>/`. Then:

```bash
npm run optimize          # builds WebP/AVIF derivatives and rewrites the manifest
```

Originals are left untouched — the site only ever loads the derivatives.

### Videos

`optimize.ts` handles images only. The clips come back as `<id>-raw.mp4`; compress them
and make a poster with ffmpeg:

```bash
cd public/invitation/higgsfield/video

ffmpeg -i fairytale-opening-raw.mp4 -vcodec libx264 -crf 28 -preset slow \
  -movflags +faststart -an fairytale-opening.mp4
ffmpeg -i fairytale-opening-raw.mp4 -c:v libvpx-vp9 -crf 36 -b:v 0 -an \
  fairytale-opening.webm
ffmpeg -i fairytale-opening-raw.mp4 -vf "select=eq(n\,0)" -vframes 1 \
  fairytale-opening-poster.webp
```

The same three commands for `castle-reveal`. A poster is required — the video component
shows it while the clip loads and keeps it if the clip never plays.

## Layout

```
public/invitation/
  higgsfield/
    video/          the two cinematic clips, plus posters
    hero/           hero artwork, mobile and desktop
    backgrounds/    the twelve-month chapter banners
    storybook/      cover and parchment pages
    decorations/    the reusable isolated elements
  photos/           Anya's real photographs (originals + optimized/)
  audio/            optional background audio
src/
  components/       the invitation's sections and media primitives
  data/party.ts     every editable detail: date, venue, RSVP, the twelve chapters
  lib/assets.ts     the manifest bridge
tools/
  art-direction.md  the written specification — read this first
  art-direction.ts  the canon and every scene, in code
  generate.ts       the Higgsfield API path
  handoff.ts        regenerates the local-generation guide from the canon
  optimize.ts       derivatives and manifest
docs/
  generate-on-your-machine.md   generating the same assets on a subscription
```

## Things a human still needs to do

- **RSVP details** are not filled in. Set `rsvp` in `src/data/party.ts`; until
  `contactName` and `contactNumber` are set, the RSVP section renders an obvious
  "to be confirmed" state rather than inventing a number.
- **The twelve-month photo journey** places the seven supplied photographs in a
  plausible order, but the actual month each was taken is a guess. Correct the `photo`
  fields in `src/data/party.ts` and drop further photos into
  `public/invitation/photos/`.
