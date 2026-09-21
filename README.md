# Anya's first birthday invitation

One continuous scroll through a fairy kingdom in the clouds and down through Anya's
first year, ending at the RSVP. Anya's real photographs, everything around them drawn
in CSS and SVG, and an original soundtrack that follows the journey.

Her photographs are never altered — not tinted, restyled, generated over or cropped
into her face. All of the decoration goes around the opening they show through.

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

### The sound

Every note on this page was written for it. `tools/musicbox.py` renders the music-box
lullaby and `tools/soundscape.py` renders the other two beds and the four effects, both
in plain Python with no dependencies. An invitation gets forwarded around a family; a
track with someone else's terms attached does not belong in it.

Three beds, one key (F major) and one tempo, so any two can cross-fade mid-bar:

| bed | where it plays |
| --- | --- |
| `sky-ambience` | the cloud kingdom at the start, and the sunset at the end |
| `music-box-lullaby` | the meadow, the year, and the RSVP |
| `shimmer` | the twelfth month and the invitation |

Four effects: `sfx-enter` on the entrance button, `sfx-sparkle` when the clouds part on
the twelfth month, `sfx-chime` arriving at the invitation, `sfx-bloom` when an RSVP is
sent.

Every bed loops seamlessly by construction rather than by editing. Sustained voices are
tuned to a whole number of cycles per loop, so they arrive back at the start of their own
waveform exactly at the join; struck notes are allowed to ring past the end and the
overhang is folded back over the opening, so the decay of the last note is what plays
under the first. All three are normalised to -17 LUFS, so a cross-fade never changes how
loud the page is.

```bash
python3 tools/musicbox.py                  # writes lullaby.wav
python3 tools/soundscape.py                # writes the rest; name pieces to do one
ffmpeg -i sky-ambience.wav -c:a libopus -b:a 56k -vbr on sky-ambience.webm
ffmpeg -i sky-ambience.wav -c:a aac -b:a 96k -movflags +faststart sky-ambience.mp4
```

Opus in WebM plus AAC in MP4 covers every browser. The AAC files are named `.mp4` rather
than `.m4a` — same container, and some static hosts refuse to serve `.m4a` at all.

`src/lib/audio.ts` is the engine: Web Audio rather than `<audio>`, because an `<audio>`
element cannot cross-fade and on iOS cannot change its volume at all. Nothing is fetched
until the guest asks for sound, nothing plays before they press "Enter Anya's Fairy
Garden", and silencing it is remembered in localStorage and never overridden. `sound` in
`src/data/party.ts` holds the volume and the fade length.

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
  audio/            three music beds and four effects
src/
  components/
    world/          the sky, clouds, meadow, drifting particles and butterflies
    chapters/       one file per part of the journey, in scroll order
  data/party.ts     every editable detail: date, venue, RSVP, story copy, the twelve months
  lib/scene.tsx     which chapter owns the screen, and each chapter's scroll progress
  lib/audio.ts      the scene-based sound engine
  lib/assets.ts     the manifest bridge
tools/
  art-direction.md  the written specification — read this first
  art-direction.ts  the canon and every scene, in code
  generate.ts       the Higgsfield CLI
  optimize.ts       derivatives and manifest
  musicbox.py       renders the lullaby from scratch
  soundscape.py     renders the other beds and the effects
  artifact.sh       builds a relative-path bundle for publishing as a preview
```

## How the journey is put together

There are no sections with their own backgrounds. One fixed `Sky` sits behind the whole
page and changes colour as the guest travels, driven by `body[data-scene]`, which
`SceneProvider` sets from whichever chapter fills the middle of the screen. Each chapter
measures its own scroll progress — 0 as it enters the viewport, 1 as it leaves — and its
layers move against that, so nothing ever drifts thousands of pixels off screen however
long the page grows.

Month twelve has no photograph and is not getting one, so it is written as the climax:
the clouds part and the days of the year count up as the guest scrolls. The four other
months with no photograph get a keepsake page rather than an empty frame.

## Things a human still needs to do

- **RSVP details** are not filled in. Set `rsvp` in `src/data/party.ts`; until
  `contactName` and `contactNumber` are set, the RSVP section renders an obvious
  "to be confirmed" state rather than inventing a number.
- **The twelve-month journey** places the seven supplied photographs in a plausible
  order, but the actual month each was taken is a guess. Correct the `photo` fields in
  `src/data/party.ts` and drop further photos into `public/invitation/photos/`, then run
  `npm run optimize`. A month left at `photo: null` renders its keepsake page instead.
