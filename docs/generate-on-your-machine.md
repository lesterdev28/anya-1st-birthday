# Generating the invitation art on your own machine

The generation tooling in `tools/` talks to the Higgsfield **API**, which bills its own credit balance — separate from a Higgsfield web subscription. That balance is empty, so the API path is blocked. This guide does the same job from a machine signed in to your subscription instead, so you are not paying for the same thing twice.

Nothing here is improvised. Every prompt below is the exact string the tooling would have sent, composed from the canon in `tools/art-direction.ts`. That repetition is deliberate: it is what keeps the castle the same castle in all seventeen assets. **Do not reword them.** If something comes back wrong, change the canon and re-run `npm run handoff`, so the fix reaches every asset at once.

The tooling stays where it is. If you ever add API credit, `npm run generate` still works.

## 1. Install and sign in (Windows)

In PowerShell:

```powershell
npm install -g @higgsfield/cli
higgsfield auth login
```

`auth login` opens your browser and waits for you to approve. It has to be the browser on the same machine as the CLI, which is exactly why this could not be done from our end.

Then confirm the model names on your account, since the catalogue moves:

```powershell
higgsfield model list
```

This guide uses `text2image_soul_v2` for images and `seedance_2_0` for video. If `model list` shows a newer Seedance (the CLI's own quickstart mentions `seedance_2_5`), prefer the newest one and keep every other setting the same.

## 2. The run

Seventeen assets: fifteen images, then two video clips. **Generate the first one, `fairytale-castle-hero-mobile`, and stop.** It establishes the look, and everything else is judged against it. Send it over before running the rest.

Each command blocks until the generation finishes and then prints a result URL. The CLI does not save the file for you — download it from that URL and put it at the path given under each command. **The filename matters**: the site looks each asset up by that exact name, and an asset it cannot find falls back to the painted version instead.

If pasting long prompts into PowerShell is awkward, `tools/generate-on-windows.ps1` runs the whole thing in one go — see section 5.

### Images

#### 1. `fairytale-castle-hero-mobile`

Save to `public/invitation/higgsfield/hero/fairytale-castle-hero-mobile.png` · 9:16 · was 1152x2048 on the API

```powershell
higgsfield generate create text2image_soul_v2 `
  --aspect_ratio 9:16 --quality 2k --wait `
  --prompt 'A breathtaking enchanted fairy-tale kingdom, seen as a wide establishing view. The castle stands small in the distance on the horizon, above soft rolling hills. Dreamy clouds gather around and behind it. The foreground holds delicate wildflowers, pale butterflies and tiny glowing fireflies. Small golden stars and magical particles float throughout. Warm golden sunlight. The castle is a single original pastel fairy-tale castle: slender pale-ivory stone towers with tall narrow arched windows, five conical spires roofed in pale lavender and blush pink, one taller central keep crowned with a champagne-gold finial and a small gold pennant, a low arched stone bridge at its base, and soft climbing vines of tiny pale flowers on the lower walls. It stands on a green rolling hill. It is an invented building, not modelled on any existing, historical or franchise castle. Soft rolling hills in muted sage and pale mint, a winding pale-gold pathway curving gently toward the castle, scattered clusters of small blush and lavender wildflowers, a few slender birch-like trees with soft pastel foliage, pale butterflies drifting low. The sky graduates from blush pink at the horizon, through lavender, to powder blue at the top. Soft rounded cumulus clouds rimmed in warm gold light. Tiny golden stars and a slim crescent moon high in the frame. Vertical 9:16 composition. Critically important: leave a large area of calm, uncluttered negative space across the centre and upper-centre of the frame — soft open sky with only faint haze and a few tiny particles there, no detail, nothing busy — because invitation typography will be laid over that area. Push all detail to the lower third and the outer edges. The castle sits low, near the horizon line in the lower-middle of the frame. Premium cinematic fairy-tale storybook illustration. Painterly digital artwork with soft gouache and watercolour texture and fine paper grain. A completely original invented world. Dreamy volumetric lighting, warm golden key light from the upper right, luminous atmospheric haze, soft shallow depth of field with a gently blurred background. Fine floating golden particles and tiny warm fireflies drifting through the air. Delicate whimsical hand-illustrated detail, elegant and refined, tender and gentle in mood. Strict pastel palette: lavender #C9B8E4, blush pink #F3C9D4, powder blue #BCD6EC, warm ivory #FBF5EA, champagne gold #E4C68A, soft peach #F6D3BC, muted sage green #C3D3BE. Low saturation, high luminosity, no strong or vivid colour anywhere. No text, no letters, no words, no numerals, no watermark, no logo, no signature. No Disney characters, no recognisable or copyrighted princesses, no franchise or theme-park castles. No cartoon outlines, no flat clip-art, no cheap vector look, no harsh saturated colour, no photorealistic human faces, no modern objects.'
```

#### 2. `fairytale-castle-hero-desktop`

Save to `public/invitation/higgsfield/hero/fairytale-castle-hero-desktop.png` · 16:9 · was 2048x1152 on the API

```powershell
higgsfield generate create text2image_soul_v2 `
  --aspect_ratio 16:9 --quality 2k --wait `
  --prompt 'The same enchanted fairy-tale kingdom as the mobile hero, recomposed wide. The castle stands in the distance, slightly right of centre, above soft rolling hills. Dreamy clouds surround it. The foreground spreads with delicate wildflowers, pale butterflies and tiny glowing fireflies. Golden stars and magical particles drift through the air. Warm golden sunlight. The castle is a single original pastel fairy-tale castle: slender pale-ivory stone towers with tall narrow arched windows, five conical spires roofed in pale lavender and blush pink, one taller central keep crowned with a champagne-gold finial and a small gold pennant, a low arched stone bridge at its base, and soft climbing vines of tiny pale flowers on the lower walls. It stands on a green rolling hill. It is an invented building, not modelled on any existing, historical or franchise castle. Soft rolling hills in muted sage and pale mint, a winding pale-gold pathway curving gently toward the castle, scattered clusters of small blush and lavender wildflowers, a few slender birch-like trees with soft pastel foliage, pale butterflies drifting low. The sky graduates from blush pink at the horizon, through lavender, to powder blue at the top. Soft rounded cumulus clouds rimmed in warm gold light. Tiny golden stars and a slim crescent moon high in the frame. Wide 16:9 cinematic composition. Leave calm, uncluttered negative space across the centre and upper-centre — soft open sky with no detail there — for typography. Detail lives in the lower third and the left and right edges. Premium cinematic fairy-tale storybook illustration. Painterly digital artwork with soft gouache and watercolour texture and fine paper grain. A completely original invented world. Dreamy volumetric lighting, warm golden key light from the upper right, luminous atmospheric haze, soft shallow depth of field with a gently blurred background. Fine floating golden particles and tiny warm fireflies drifting through the air. Delicate whimsical hand-illustrated detail, elegant and refined, tender and gentle in mood. Strict pastel palette: lavender #C9B8E4, blush pink #F3C9D4, powder blue #BCD6EC, warm ivory #FBF5EA, champagne gold #E4C68A, soft peach #F6D3BC, muted sage green #C3D3BE. Low saturation, high luminosity, no strong or vivid colour anywhere. No text, no letters, no words, no numerals, no watermark, no logo, no signature. No Disney characters, no recognisable or copyrighted princesses, no franchise or theme-park castles. No cartoon outlines, no flat clip-art, no cheap vector look, no harsh saturated colour, no photorealistic human faces, no modern objects.'
```

#### 3. `storybook-cover`

Save to `public/invitation/higgsfield/storybook/storybook-cover.png` · 3:4 · was 1536x2048 on the API

```powershell
higgsfield generate create text2image_soul_v2 `
  --aspect_ratio 3:4 --quality 2k --wait `
  --prompt 'An antique magical storybook lying closed, seen straight on from above. The cover is soft blush-and-ivory cloth with a wide ornate champagne-gold border embossed around its edge, a delicate gold crown emblem centred on the cover, fine floral fairy-tale ornamentation in the corners, and a scatter of tiny gold stars. Warm gold light catches the embossing. The book fills the frame, centred, on a plain soft lavender backdrop. Leave the centre of the cover below the crown emblem clear for typography. Flat straight-on view, no perspective distortion. Premium cinematic fairy-tale storybook illustration. Painterly digital artwork with soft gouache and watercolour texture and fine paper grain. A completely original invented world. Dreamy volumetric lighting, warm golden key light from the upper right, luminous atmospheric haze, soft shallow depth of field with a gently blurred background. Fine floating golden particles and tiny warm fireflies drifting through the air. Delicate whimsical hand-illustrated detail, elegant and refined, tender and gentle in mood. Strict pastel palette: lavender #C9B8E4, blush pink #F3C9D4, powder blue #BCD6EC, warm ivory #FBF5EA, champagne gold #E4C68A, soft peach #F6D3BC, muted sage green #C3D3BE. Low saturation, high luminosity, no strong or vivid colour anywhere. No text, no letters, no words, no numerals, no watermark, no logo, no signature. No Disney characters, no recognisable or copyrighted princesses, no franchise or theme-park castles. No cartoon outlines, no flat clip-art, no cheap vector look, no harsh saturated colour, no photorealistic human faces, no modern objects.'
```

#### 4. `storybook-pages`

Save to `public/invitation/higgsfield/storybook/storybook-pages.png` · 4:3 · was 2048x1536 on the API

```powershell
higgsfield generate create text2image_soul_v2 `
  --aspect_ratio 4:3 --quality 2k --wait `
  --prompt 'The interior of the same antique storybook, opened flat to two blank facing pages of warm ivory parchment with soft deckled edges and a faint aged texture. A slim champagne-gold rule and a delicate floral vine ornament run around the outer margin of each page. A few tiny gold stars in the corners. Straight-on view of the open spread, filling the frame. Both pages are completely blank in their centres — empty parchment, no text, no illustration there — so the website can lay content over them. Premium cinematic fairy-tale storybook illustration. Painterly digital artwork with soft gouache and watercolour texture and fine paper grain. A completely original invented world. Dreamy volumetric lighting, warm golden key light from the upper right, luminous atmospheric haze, soft shallow depth of field with a gently blurred background. Fine floating golden particles and tiny warm fireflies drifting through the air. Delicate whimsical hand-illustrated detail, elegant and refined, tender and gentle in mood. Strict pastel palette: lavender #C9B8E4, blush pink #F3C9D4, powder blue #BCD6EC, warm ivory #FBF5EA, champagne gold #E4C68A, soft peach #F6D3BC, muted sage green #C3D3BE. Low saturation, high luminosity, no strong or vivid colour anywhere. No text, no letters, no words, no numerals, no watermark, no logo, no signature. No Disney characters, no recognisable or copyrighted princesses, no franchise or theme-park castles. No cartoon outlines, no flat clip-art, no cheap vector look, no harsh saturated colour, no photorealistic human faces, no modern objects.'
```

#### 5. `cloud-bank`

Save to `public/invitation/higgsfield/decorations/cloud-bank.png` · 16:9 · was 2048x1152 on the API

```powershell
higgsfield generate create text2image_soul_v2 `
  --aspect_ratio 16:9 --quality 2k --wait `
  --prompt 'A soft bank of rounded pastel cumulus clouds in blush pink, lavender and ivory, rimmed with warm gold light, with a few tiny golden particles drifting among them. The clouds sit across the lower half of the frame against a plain flat powder-blue field, so the asset can be cut out and layered. No horizon, no ground, no castle. Premium cinematic fairy-tale storybook illustration. Painterly digital artwork with soft gouache and watercolour texture and fine paper grain. A completely original invented world. Dreamy volumetric lighting, warm golden key light from the upper right, luminous atmospheric haze, soft shallow depth of field with a gently blurred background. Fine floating golden particles and tiny warm fireflies drifting through the air. Delicate whimsical hand-illustrated detail, elegant and refined, tender and gentle in mood. Strict pastel palette: lavender #C9B8E4, blush pink #F3C9D4, powder blue #BCD6EC, warm ivory #FBF5EA, champagne gold #E4C68A, soft peach #F6D3BC, muted sage green #C3D3BE. Low saturation, high luminosity, no strong or vivid colour anywhere. No text, no letters, no words, no numerals, no watermark, no logo, no signature. No Disney characters, no recognisable or copyrighted princesses, no franchise or theme-park castles. No cartoon outlines, no flat clip-art, no cheap vector look, no harsh saturated colour, no photorealistic human faces, no modern objects.'
```

#### 6. `golden-crown`

Save to `public/invitation/higgsfield/decorations/golden-crown.png` · 1:1 · was 1536x1536 on the API

```powershell
higgsfield generate create text2image_soul_v2 `
  --aspect_ratio 1:1 --quality 2k --wait `
  --prompt 'A small delicate champagne-gold crown for a baby''s first birthday: five slender points each tipped with a tiny pearl, a fine band set with two small blush-pink and lavender gems, soft warm gold glow and a few sparkles around it. The crown alone, centred, on a plain flat pale-lavender background with no scene and no shadow, so it can be isolated cleanly. Straight-on view. Premium cinematic fairy-tale storybook illustration. Painterly digital artwork with soft gouache and watercolour texture and fine paper grain. A completely original invented world. Dreamy volumetric lighting, warm golden key light from the upper right, luminous atmospheric haze, soft shallow depth of field with a gently blurred background. Fine floating golden particles and tiny warm fireflies drifting through the air. Delicate whimsical hand-illustrated detail, elegant and refined, tender and gentle in mood. Strict pastel palette: lavender #C9B8E4, blush pink #F3C9D4, powder blue #BCD6EC, warm ivory #FBF5EA, champagne gold #E4C68A, soft peach #F6D3BC, muted sage green #C3D3BE. Low saturation, high luminosity, no strong or vivid colour anywhere. No text, no letters, no words, no numerals, no watermark, no logo, no signature. No Disney characters, no recognisable or copyrighted princesses, no franchise or theme-park castles. No cartoon outlines, no flat clip-art, no cheap vector look, no harsh saturated colour, no photorealistic human faces, no modern objects.'
```

#### 7. `butterflies-and-flowers`

Save to `public/invitation/higgsfield/decorations/butterflies-and-flowers.png` · 1:1 · was 1536x1536 on the API

```powershell
higgsfield generate create text2image_soul_v2 `
  --aspect_ratio 1:1 --quality 2k --wait `
  --prompt 'A small cluster of delicate pale butterflies in blush pink, lavender and powder blue with faint gold edging on their wings, together with a few small wildflowers and slender leaves in the same pastels, and a scatter of golden sparkles. The cluster alone, centred, on a plain flat warm-ivory background with no scene, so the elements can be isolated and reused separately. Premium cinematic fairy-tale storybook illustration. Painterly digital artwork with soft gouache and watercolour texture and fine paper grain. A completely original invented world. Dreamy volumetric lighting, warm golden key light from the upper right, luminous atmospheric haze, soft shallow depth of field with a gently blurred background. Fine floating golden particles and tiny warm fireflies drifting through the air. Delicate whimsical hand-illustrated detail, elegant and refined, tender and gentle in mood. Strict pastel palette: lavender #C9B8E4, blush pink #F3C9D4, powder blue #BCD6EC, warm ivory #FBF5EA, champagne gold #E4C68A, soft peach #F6D3BC, muted sage green #C3D3BE. Low saturation, high luminosity, no strong or vivid colour anywhere. No text, no letters, no words, no numerals, no watermark, no logo, no signature. No Disney characters, no recognisable or copyrighted princesses, no franchise or theme-park castles. No cartoon outlines, no flat clip-art, no cheap vector look, no harsh saturated colour, no photorealistic human faces, no modern objects.'
```

#### 8. `castle-silhouette`

Save to `public/invitation/higgsfield/decorations/castle-silhouette.png` · 16:9 · was 2048x1152 on the API

```powershell
higgsfield generate create text2image_soul_v2 `
  --aspect_ratio 16:9 --quality 2k --wait `
  --prompt 'A soft distant silhouette of the castle and its hill, rendered as a pale flat lavender shape with a faint warm-gold rim of light along its upper edges, as if seen far away through morning haze. The castle is a single original pastel fairy-tale castle: slender pale-ivory stone towers with tall narrow arched windows, five conical spires roofed in pale lavender and blush pink, one taller central keep crowned with a champagne-gold finial and a small gold pennant, a low arched stone bridge at its base, and soft climbing vines of tiny pale flowers on the lower walls. It stands on a green rolling hill. It is an invented building, not modelled on any existing, historical or franchise castle. The silhouette sits along the bottom of the frame against a plain flat ivory field, with nothing else in the image, so it can be used as a page footer band. Premium cinematic fairy-tale storybook illustration. Painterly digital artwork with soft gouache and watercolour texture and fine paper grain. A completely original invented world. Dreamy volumetric lighting, warm golden key light from the upper right, luminous atmospheric haze, soft shallow depth of field with a gently blurred background. Fine floating golden particles and tiny warm fireflies drifting through the air. Delicate whimsical hand-illustrated detail, elegant and refined, tender and gentle in mood. Strict pastel palette: lavender #C9B8E4, blush pink #F3C9D4, powder blue #BCD6EC, warm ivory #FBF5EA, champagne gold #E4C68A, soft peach #F6D3BC, muted sage green #C3D3BE. Low saturation, high luminosity, no strong or vivid colour anywhere. No text, no letters, no words, no numerals, no watermark, no logo, no signature. No Disney characters, no recognisable or copyrighted princesses, no franchise or theme-park castles. No cartoon outlines, no flat clip-art, no cheap vector look, no harsh saturated colour, no photorealistic human faces, no modern objects.'
```

#### 9. `crescent-moon-and-stars`

Save to `public/invitation/higgsfield/decorations/crescent-moon-and-stars.png` · 1:1 · was 1536x1536 on the API

```powershell
higgsfield generate create text2image_soul_v2 `
  --aspect_ratio 1:1 --quality 2k --wait `
  --prompt 'A slim champagne-gold crescent moon with a soft luminous halo, surrounded by a loose scatter of tiny gold stars of varying sizes and a few drifting sparkles. The moon and stars alone, centred, on a plain flat deep-lavender background so the asset can be isolated. No landscape, no clouds. Premium cinematic fairy-tale storybook illustration. Painterly digital artwork with soft gouache and watercolour texture and fine paper grain. A completely original invented world. Dreamy volumetric lighting, warm golden key light from the upper right, luminous atmospheric haze, soft shallow depth of field with a gently blurred background. Fine floating golden particles and tiny warm fireflies drifting through the air. Delicate whimsical hand-illustrated detail, elegant and refined, tender and gentle in mood. Strict pastel palette: lavender #C9B8E4, blush pink #F3C9D4, powder blue #BCD6EC, warm ivory #FBF5EA, champagne gold #E4C68A, soft peach #F6D3BC, muted sage green #C3D3BE. Low saturation, high luminosity, no strong or vivid colour anywhere. No text, no letters, no words, no numerals, no watermark, no logo, no signature. No Disney characters, no recognisable or copyrighted princesses, no franchise or theme-park castles. No cartoon outlines, no flat clip-art, no cheap vector look, no harsh saturated colour, no photorealistic human faces, no modern objects.'
```

#### 10. `gold-ornamental-border`

Save to `public/invitation/higgsfield/decorations/gold-ornamental-border.png` · 3:4 · was 1536x2048 on the API

```powershell
higgsfield generate create text2image_soul_v2 `
  --aspect_ratio 3:4 --quality 2k --wait `
  --prompt 'An ornate champagne-gold decorative border frame in a delicate fairy-tale style: fine scrollwork, small flowers, slender leaves and tiny stars woven through it, with a soft warm glow. The border runs around the outer edge of the frame only. The entire centre is plain flat warm ivory and completely empty, so content can sit inside it. Premium cinematic fairy-tale storybook illustration. Painterly digital artwork with soft gouache and watercolour texture and fine paper grain. A completely original invented world. Dreamy volumetric lighting, warm golden key light from the upper right, luminous atmospheric haze, soft shallow depth of field with a gently blurred background. Fine floating golden particles and tiny warm fireflies drifting through the air. Delicate whimsical hand-illustrated detail, elegant and refined, tender and gentle in mood. Strict pastel palette: lavender #C9B8E4, blush pink #F3C9D4, powder blue #BCD6EC, warm ivory #FBF5EA, champagne gold #E4C68A, soft peach #F6D3BC, muted sage green #C3D3BE. Low saturation, high luminosity, no strong or vivid colour anywhere. No text, no letters, no words, no numerals, no watermark, no logo, no signature. No Disney characters, no recognisable or copyrighted princesses, no franchise or theme-park castles. No cartoon outlines, no flat clip-art, no cheap vector look, no harsh saturated colour, no photorealistic human faces, no modern objects.'
```

#### 11. `month-clouds-and-stars`

Save to `public/invitation/higgsfield/backgrounds/month-clouds-and-stars.png` · 16:9 · was 2048x1152 on the API

```powershell
higgsfield generate create text2image_soul_v2 `
  --aspect_ratio 16:9 --quality 2k --wait `
  --prompt 'A very soft, quiet dawn sky of pale clouds with a few tiny golden stars — the gentlest and emptiest scene in the series, almost bare. The sky graduates from blush pink at the horizon, through lavender, to powder blue at the top. Soft rounded cumulus clouds rimmed in warm gold light. Tiny golden stars and a slim crescent moon high in the frame. Wide banner composition, extremely simple and low-contrast, with a large empty area in the middle. This is the first and least decorated chapter background. Premium cinematic fairy-tale storybook illustration. Painterly digital artwork with soft gouache and watercolour texture and fine paper grain. A completely original invented world. Dreamy volumetric lighting, warm golden key light from the upper right, luminous atmospheric haze, soft shallow depth of field with a gently blurred background. Fine floating golden particles and tiny warm fireflies drifting through the air. Delicate whimsical hand-illustrated detail, elegant and refined, tender and gentle in mood. Strict pastel palette: lavender #C9B8E4, blush pink #F3C9D4, powder blue #BCD6EC, warm ivory #FBF5EA, champagne gold #E4C68A, soft peach #F6D3BC, muted sage green #C3D3BE. Low saturation, high luminosity, no strong or vivid colour anywhere. No text, no letters, no words, no numerals, no watermark, no logo, no signature. No Disney characters, no recognisable or copyrighted princesses, no franchise or theme-park castles. No cartoon outlines, no flat clip-art, no cheap vector look, no harsh saturated colour, no photorealistic human faces, no modern objects.'
```

#### 12. `month-magical-garden`

Save to `public/invitation/higgsfield/backgrounds/month-magical-garden.png` · 16:9 · was 2048x1152 on the API

```powershell
higgsfield generate create text2image_soul_v2 `
  --aspect_ratio 16:9 --quality 2k --wait `
  --prompt 'A small enchanted garden of pastel wildflowers and soft grasses, with a few fireflies and golden particles beginning to appear among them. Soft rolling hills in muted sage and pale mint, a winding pale-gold pathway curving gently toward the castle, scattered clusters of small blush and lavender wildflowers, a few slender birch-like trees with soft pastel foliage, pale butterflies drifting low. Wide banner composition. Detail along the lower edge, the upper two thirds soft and open. Slightly more decorated than the clouds chapter. Premium cinematic fairy-tale storybook illustration. Painterly digital artwork with soft gouache and watercolour texture and fine paper grain. A completely original invented world. Dreamy volumetric lighting, warm golden key light from the upper right, luminous atmospheric haze, soft shallow depth of field with a gently blurred background. Fine floating golden particles and tiny warm fireflies drifting through the air. Delicate whimsical hand-illustrated detail, elegant and refined, tender and gentle in mood. Strict pastel palette: lavender #C9B8E4, blush pink #F3C9D4, powder blue #BCD6EC, warm ivory #FBF5EA, champagne gold #E4C68A, soft peach #F6D3BC, muted sage green #C3D3BE. Low saturation, high luminosity, no strong or vivid colour anywhere. No text, no letters, no words, no numerals, no watermark, no logo, no signature. No Disney characters, no recognisable or copyrighted princesses, no franchise or theme-park castles. No cartoon outlines, no flat clip-art, no cheap vector look, no harsh saturated colour, no photorealistic human faces, no modern objects.'
```

#### 13. `month-butterflies-and-blossoms`

Save to `public/invitation/higgsfield/backgrounds/month-butterflies-and-blossoms.png` · 16:9 · was 2048x1152 on the API

```powershell
higgsfield generate create text2image_soul_v2 `
  --aspect_ratio 16:9 --quality 2k --wait `
  --prompt 'A drift of pale butterflies moving through flowering branches and soft blossoms, with golden particles and a warmer, richer glow than the earlier chapters. Soft rolling hills in muted sage and pale mint, a winding pale-gold pathway curving gently toward the castle, scattered clusters of small blush and lavender wildflowers, a few slender birch-like trees with soft pastel foliage, pale butterflies drifting low. Wide banner composition. Detail along the lower edge and upper corners, the centre left open. Premium cinematic fairy-tale storybook illustration. Painterly digital artwork with soft gouache and watercolour texture and fine paper grain. A completely original invented world. Dreamy volumetric lighting, warm golden key light from the upper right, luminous atmospheric haze, soft shallow depth of field with a gently blurred background. Fine floating golden particles and tiny warm fireflies drifting through the air. Delicate whimsical hand-illustrated detail, elegant and refined, tender and gentle in mood. Strict pastel palette: lavender #C9B8E4, blush pink #F3C9D4, powder blue #BCD6EC, warm ivory #FBF5EA, champagne gold #E4C68A, soft peach #F6D3BC, muted sage green #C3D3BE. Low saturation, high luminosity, no strong or vivid colour anywhere. No text, no letters, no words, no numerals, no watermark, no logo, no signature. No Disney characters, no recognisable or copyrighted princesses, no franchise or theme-park castles. No cartoon outlines, no flat clip-art, no cheap vector look, no harsh saturated colour, no photorealistic human faces, no modern objects.'
```

#### 14. `month-enchanted-forest`

Save to `public/invitation/higgsfield/backgrounds/month-enchanted-forest.png` · 16:9 · was 2048x1152 on the API

```powershell
higgsfield generate create text2image_soul_v2 `
  --aspect_ratio 16:9 --quality 2k --wait `
  --prompt 'A gentle enchanted forest of slender pastel trees with light falling between them in warm golden shafts, fireflies through the trunks, and a soft mist along the ground. Richer and deeper than the earlier chapters. Soft rolling hills in muted sage and pale mint, a winding pale-gold pathway curving gently toward the castle, scattered clusters of small blush and lavender wildflowers, a few slender birch-like trees with soft pastel foliage, pale butterflies drifting low. Wide banner composition, with the centre of the frame left open and hazy. Premium cinematic fairy-tale storybook illustration. Painterly digital artwork with soft gouache and watercolour texture and fine paper grain. A completely original invented world. Dreamy volumetric lighting, warm golden key light from the upper right, luminous atmospheric haze, soft shallow depth of field with a gently blurred background. Fine floating golden particles and tiny warm fireflies drifting through the air. Delicate whimsical hand-illustrated detail, elegant and refined, tender and gentle in mood. Strict pastel palette: lavender #C9B8E4, blush pink #F3C9D4, powder blue #BCD6EC, warm ivory #FBF5EA, champagne gold #E4C68A, soft peach #F6D3BC, muted sage green #C3D3BE. Low saturation, high luminosity, no strong or vivid colour anywhere. No text, no letters, no words, no numerals, no watermark, no logo, no signature. No Disney characters, no recognisable or copyrighted princesses, no franchise or theme-park castles. No cartoon outlines, no flat clip-art, no cheap vector look, no harsh saturated colour, no photorealistic human faces, no modern objects.'
```

#### 15. `month-castle-finale`

Save to `public/invitation/higgsfield/backgrounds/month-castle-finale.png` · 16:9 · was 2048x1152 on the API

```powershell
higgsfield generate create text2image_soul_v2 `
  --aspect_ratio 16:9 --quality 2k --wait `
  --prompt 'The full enchanted kingdom at its most radiant: the castle clear on its hill, flowers, butterflies, fireflies, golden particles and warm light everywhere. The richest and most celebratory scene of the series. The castle is a single original pastel fairy-tale castle: slender pale-ivory stone towers with tall narrow arched windows, five conical spires roofed in pale lavender and blush pink, one taller central keep crowned with a champagne-gold finial and a small gold pennant, a low arched stone bridge at its base, and soft climbing vines of tiny pale flowers on the lower walls. It stands on a green rolling hill. It is an invented building, not modelled on any existing, historical or franchise castle. Soft rolling hills in muted sage and pale mint, a winding pale-gold pathway curving gently toward the castle, scattered clusters of small blush and lavender wildflowers, a few slender birch-like trees with soft pastel foliage, pale butterflies drifting low. The sky graduates from blush pink at the horizon, through lavender, to powder blue at the top. Soft rounded cumulus clouds rimmed in warm gold light. Tiny golden stars and a slim crescent moon high in the frame. Wide banner composition. The castle sits right of centre, with the centre-left left open for typography. Premium cinematic fairy-tale storybook illustration. Painterly digital artwork with soft gouache and watercolour texture and fine paper grain. A completely original invented world. Dreamy volumetric lighting, warm golden key light from the upper right, luminous atmospheric haze, soft shallow depth of field with a gently blurred background. Fine floating golden particles and tiny warm fireflies drifting through the air. Delicate whimsical hand-illustrated detail, elegant and refined, tender and gentle in mood. Strict pastel palette: lavender #C9B8E4, blush pink #F3C9D4, powder blue #BCD6EC, warm ivory #FBF5EA, champagne gold #E4C68A, soft peach #F6D3BC, muted sage green #C3D3BE. Low saturation, high luminosity, no strong or vivid colour anywhere. No text, no letters, no words, no numerals, no watermark, no logo, no signature. No Disney characters, no recognisable or copyrighted princesses, no franchise or theme-park castles. No cartoon outlines, no flat clip-art, no cheap vector look, no harsh saturated colour, no photorealistic human faces, no modern objects.'
```

### Video

Both clips are slow and gentle on purpose, and both end on a composition that matches the hero art so the site can cut from clip to still without a visible jump.

#### 16. `fairytale-opening`

Save to `public/invitation/higgsfield/video/fairytale-opening-raw.mp4` · 9:16 · 5s

```powershell
higgsfield generate create seedance_2_0 `
  --aspect_ratio 9:16 --duration 5 --resolution 1080p --wait `
  --prompt 'A slow, elegant cinematic push-in. The shot begins high above a bank of soft pastel clouds in blush pink, lavender and ivory, with tiny golden stars twinkling in the distance. The camera drifts gently forward through the clouds. A single glowing shooting star traces softly across the sky. The clouds part to reveal an enchanted pastel castle below. Warm golden light begins to rise from behind the castle. Tiny magical particles and fireflies drift toward the camera. The camera continues its gentle push toward the castle and settles with the castle clearly visible in the lower-middle of the frame and calm open sky above it. The castle is a single original pastel fairy-tale castle: slender pale-ivory stone towers with tall narrow arched windows, five conical spires roofed in pale lavender and blush pink, one taller central keep crowned with a champagne-gold finial and a small gold pennant, a low arched stone bridge at its base, and soft climbing vines of tiny pale flowers on the lower walls. It stands on a green rolling hill. It is an invented building, not modelled on any existing, historical or franchise castle. The sky graduates from blush pink at the horizon, through lavender, to powder blue at the top. Soft rounded cumulus clouds rimmed in warm gold light. Tiny golden stars and a slim crescent moon high in the frame. Premium cinematic fairy-tale storybook illustration. Painterly digital artwork with soft gouache and watercolour texture and fine paper grain. A completely original invented world. Dreamy volumetric lighting, warm golden key light from the upper right, luminous atmospheric haze, soft shallow depth of field with a gently blurred background. Fine floating golden particles and tiny warm fireflies drifting through the air. Delicate whimsical hand-illustrated detail, elegant and refined, tender and gentle in mood. Strict pastel palette: lavender #C9B8E4, blush pink #F3C9D4, powder blue #BCD6EC, warm ivory #FBF5EA, champagne gold #E4C68A, soft peach #F6D3BC, muted sage green #C3D3BE. Low saturation, high luminosity, no strong or vivid colour anywhere. Camera movement is slow, smooth and graceful throughout — no rapid zoom, no shake, no whip pan, no chaotic particle bursts. No text, no letters, no words, no numerals, no watermark, no logo, no signature. No Disney characters, no recognisable or copyrighted princesses, no franchise or theme-park castles. No cartoon outlines, no flat clip-art, no cheap vector look, no harsh saturated colour, no photorealistic human faces, no modern objects.'
```

#### 17. `castle-reveal`

Save to `public/invitation/higgsfield/video/castle-reveal-raw.mp4` · 9:16 · 5s

```powershell
higgsfield generate create seedance_2_0 `
  --aspect_ratio 9:16 --duration 5 --resolution 1080p --wait `
  --prompt 'Soft pastel clouds fill the frame, obscuring an enchanted castle behind them. The clouds slowly and gently drift apart. Golden particles begin to glow and rise. The castle gradually emerges into view. A subtle ray of warm golden light falls across its tallest tower. A few pale butterflies drift through the foreground. The shot ends holding on the castle on its hill, framed by soft open sky above it. The castle is a single original pastel fairy-tale castle: slender pale-ivory stone towers with tall narrow arched windows, five conical spires roofed in pale lavender and blush pink, one taller central keep crowned with a champagne-gold finial and a small gold pennant, a low arched stone bridge at its base, and soft climbing vines of tiny pale flowers on the lower walls. It stands on a green rolling hill. It is an invented building, not modelled on any existing, historical or franchise castle. Soft rolling hills in muted sage and pale mint, a winding pale-gold pathway curving gently toward the castle, scattered clusters of small blush and lavender wildflowers, a few slender birch-like trees with soft pastel foliage, pale butterflies drifting low. The sky graduates from blush pink at the horizon, through lavender, to powder blue at the top. Soft rounded cumulus clouds rimmed in warm gold light. Tiny golden stars and a slim crescent moon high in the frame. Premium cinematic fairy-tale storybook illustration. Painterly digital artwork with soft gouache and watercolour texture and fine paper grain. A completely original invented world. Dreamy volumetric lighting, warm golden key light from the upper right, luminous atmospheric haze, soft shallow depth of field with a gently blurred background. Fine floating golden particles and tiny warm fireflies drifting through the air. Delicate whimsical hand-illustrated detail, elegant and refined, tender and gentle in mood. Strict pastel palette: lavender #C9B8E4, blush pink #F3C9D4, powder blue #BCD6EC, warm ivory #FBF5EA, champagne gold #E4C68A, soft peach #F6D3BC, muted sage green #C3D3BE. Low saturation, high luminosity, no strong or vivid colour anywhere. The camera barely moves — a very slow, almost imperceptible push in. No rapid zoom, no shake, no chaotic motion. No text, no letters, no words, no numerals, no watermark, no logo, no signature. No Disney characters, no recognisable or copyrighted princesses, no franchise or theme-park castles. No cartoon outlines, no flat clip-art, no cheap vector look, no harsh saturated colour, no photorealistic human faces, no modern objects.'
```

## 3. Where everything goes

```
public/invitation/higgsfield/
  hero/
    fairytale-castle-hero-mobile.png
    fairytale-castle-hero-desktop.png
  storybook/
    storybook-cover.png
    storybook-pages.png
  decorations/
    cloud-bank.png
    golden-crown.png
    butterflies-and-flowers.png
    castle-silhouette.png
    crescent-moon-and-stars.png
    gold-ornamental-border.png
  backgrounds/
    month-clouds-and-stars.png
    month-magical-garden.png
    month-butterflies-and-blossoms.png
    month-enchanted-forest.png
    month-castle-finale.png
  video/
    fairytale-opening-raw.mp4
    castle-reveal-raw.mp4
```

Keep the `-raw` suffix on the clips. It marks them as the untouched download, so the compression step below never overwrites your original.

## 4. After the files are in

From the repo root:

```powershell
cd tools
npm install
npm run optimize
```

That builds the WebP and AVIF sizes the site actually loads, writes a blurred placeholder for each, and regenerates `src/data/media-manifest.json`. Your original PNGs are left untouched. Commit the originals, the `optimized/` folders and the manifest together.

The two clips need ffmpeg, which `optimize` does not do. The three commands per clip are in `README.md` under **Videos** — an MP4, a WebM and a poster frame. The poster is required: it is what a guest sees while the clip loads, and what stays if the clip never plays.

## 5. The whole run as one script

`tools/generate-on-windows.ps1` holds every command above in order, downloads each result to the right path, and skips anything already on disk, so you can stop and restart it. It pauses after the hero for your sign-off.

```powershell
cd tools
.\generate-on-windows.ps1
```

It reads the result URL out of the CLI's `--json` output. That part is written against the CLI's documented shape but has not been run against your account, so if a download comes back empty, fall back to the individual commands in section 2 — those are the reliable path.

## 6. If you would rather use the web app

The web app is signed in to the same subscription, and for some of these it is genuinely easier. Paste the same prompt, set the same aspect ratio, and save the download to the same filename — the site does not care which tool made the file.

It is worth it for the **hero images** and the **five month backgrounds**, where you are judging composition and will likely want to re-roll a few times. Seeing the result immediately beats re-running a command.

The **six decorations** are the opposite. Each one needs its subject isolated cleanly on a plain flat field so the site can lift it out and reuse it, and that depends entirely on the prompt being passed through exactly as written. Use the CLI for those.

For the **two clips**, use whichever you prefer, but keep the duration at 5 seconds and the ratio at 9:16.

---

_Generated by `tools/handoff.ts` from `tools/art-direction.ts`. Re-run `npm run handoff` after changing the canon._
