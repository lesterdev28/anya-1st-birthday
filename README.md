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

Two are done and in the repo:

- `fairytale-castle-hero-mobile` — the hero artwork, 9:16, 2K
- `fairytale-opening` — the cinematic, 1080×1920, six seconds

Everything else (the wide hero, the storybook, the decoration set, the twelve month
illustrations) is still a painted fallback, which is a complete and usable state.

**The CLI route does not work from a Claude Code session on this repo.** The
environment's egress policy answers HTTP 403 to `clerk.higgsfield.ai` (OAuth) and
`fnf-api-gw.higgsfield.ai` (the API), so `higgsfield auth login` fails at the token
exchange, and `tools/generate.ts` cannot reach the API either. The assets above were
generated through the **Higgsfield MCP connector** instead (`https://mcp.higgsfield.ai/mcp`,
added under Customize → Connectors), which runs outside the sandbox and is unaffected.

Note that `@higgsfield/client` reports *every* HTTP 403 as
`NotEnoughCreditsError: Not enough credits`, including the proxy's blocked-host denial.
If you see that error, check the raw HTTP response before concluding anything about the
account balance.

The result CDN (`d8j0ntlcm91z4.cloudfront.net`) is blocked too, so generated files
cannot be downloaded from inside a session — they have to be fetched in a browser and
added to the repo by hand.

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
npm run generate -- --videos                          # the cinematic clip
```

Generation needs `HF_CREDENTIALS` (format `key-id:key-secret`) in the environment or in
`tools/.env.local`. It is never logged or committed.

Raw output lands in `public/invitation/higgsfield/<category>/`. Then:

```bash
npm run optimize          # builds WebP/AVIF derivatives and rewrites the manifest
```

Originals are left untouched — the site only ever loads the derivatives.

### Videos

`optimize.ts` handles images only. There is **one** clip, not two: it is generated with
the hero artwork as its `end_image`, so the push-in through the clouds lands on exactly
the still the invitation then holds, and a separate castle-reveal clip would only repeat
that. The intro's `reveal` beat shows the hero image instead.

Higgsfield returns HEVC in an MP4, which Chrome and Firefox frequently cannot play, so
transcoding is not optional:

```bash
cd public/invitation/higgsfield/video

ffmpeg -i raw.mp4 -an -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 27 \
  -preset slow -movflags +faststart fairytale-opening.mp4
ffmpeg -i raw.mp4 -an -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 \
  fairytale-opening.webm
ffmpeg -i raw.mp4 -vframes 1 -vf "scale=720:-2" fairytale-opening-poster.webp
```

That also takes the 6-second clip from ~9.8 MB to under 1 MB, which matters on the phone
connections most guests will open this on. A poster is required — the video component
shows it while the clip loads and keeps it if the clip never plays.

If the intro beat length and the clip length drift apart, the cut happens before the
clip reaches the hero frame and the handover becomes visible. The `opening` beat in
`IntroSequence.tsx` is set to the clip's duration for that reason.

### The music

`public/invitation/audio/music-box-lullaby.*` is an original piece, rendered by
`tools/musicbox.py` rather than licensed from anywhere. An invitation gets forwarded
around a family; a track with someone else's terms attached does not belong in it.

It is a 38-second seamless loop — the reverb tail that runs past the end is folded back
over the opening, so the join is inaudible. To replace it, drop in any pair of files and
point `AUDIO_SOURCES` in `src/lib/assets.ts` at them; Opus in WebM plus AAC in MP4 covers
every browser.

```bash
python3 tools/musicbox.py     # writes a wav, no dependencies
ffmpeg -i lullaby.wav -c:a libopus -b:a 64k music-box-lullaby.webm
ffmpeg -i lullaby.wav -c:a aac -b:a 88k -movflags +faststart music-box-lullaby.m4a
```

No browser will play audio before the visitor has done something, so the music starts at
the first tap, click, key or scroll rather than on load. Silencing it is remembered in
localStorage and is never overridden. `sound` in `src/data/party.ts` holds the volume and
can switch the auto-start off entirely.

## Layout

```
public/invitation/
  higgsfield/
    video/          the cinematic clip, plus its poster
    hero/           hero artwork, mobile and desktop
    backgrounds/    the twelve-month chapter banners
    storybook/      cover and parchment pages
    decorations/    the reusable isolated elements
  photos/           Anya's real photographs (originals + optimized/)
  audio/            the music-box lullaby
src/
  components/       the invitation's sections and media primitives
  data/party.ts     every editable detail: date, venue, RSVP, the twelve chapters
  lib/assets.ts     the manifest bridge
tools/
  art-direction.md  the written specification — read this first
  art-direction.ts  the canon and every scene, in code
  generate.ts       the Higgsfield CLI
  optimize.ts       derivatives and manifest
  musicbox.py       renders the background music from scratch
```

## Things a human still needs to do

- **RSVP details** are not filled in. Set `rsvp` in `src/data/party.ts`; until
  `contactName` and `contactNumber` are set, the RSVP section renders an obvious
  "to be confirmed" state rather than inventing a number.
- **The twelve-month photo journey** places the seven supplied photographs in a
  plausible order, but the actual month each was taken is a guess. Correct the `photo`
  fields in `src/data/party.ts` and drop further photos into
  `public/invitation/photos/`.
