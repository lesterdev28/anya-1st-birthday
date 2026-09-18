/**
 * Generates the "generate it on your own machine" hand-off from the art-direction canon.
 *
 * The API path in generate.ts bills Higgsfield API credits, which are separate from a
 * Higgsfield web subscription. When there is no API credit, the assets have to be made
 * from a machine that is signed in to the subscription instead — the CLI, or the web app.
 *
 * This script writes that hand-off so the prompts in it are the same strings buildPrompt()
 * would have sent. Editing a prompt still means editing art-direction.ts, then re-running
 * this; nothing here is hand-written per asset.
 *
 * Usage:
 *   npm run handoff
 *
 * Writes:
 *   docs/generate-on-your-machine.md   the guide, in order, with every setting
 *   tools/generate-on-windows.ps1      the same run as one PowerShell script
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SCENES, VIDEO_SCENES, buildPrompt, type Scene } from "./art-direction.js";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const GUIDE_PATH = resolve(REPO_ROOT, "docs/generate-on-your-machine.md");
const SCRIPT_PATH = resolve(REPO_ROOT, "tools/generate-on-windows.ps1");

/**
 * The CLI takes an aspect ratio, not a pixel size. Every size the canon uses maps onto
 * one of text2image_soul_v2's accepted ratios, so nothing has to be recomposed.
 */
const ASPECT_BY_SIZE: Record<string, string> = {
  "1152x2048": "9:16",
  "2048x1152": "16:9",
  "1536x2048": "3:4",
  "2048x1536": "4:3",
  "1536x1536": "1:1",
};

const IMAGE_MODEL = "text2image_soul_v2";
const IMAGE_QUALITY = "2k";
const VIDEO_MODEL = "seedance_2_0";
const VIDEO_RESOLUTION = "1080p";

function aspectFor(scene: Scene): string {
  const aspect = ASPECT_BY_SIZE[scene.size];
  if (!aspect) throw new Error(`No aspect ratio mapped for size ${scene.size} (${scene.id}).`);
  return aspect;
}

/** PowerShell single-quoted literal: the only escape inside one is a doubled quote. */
function psLiteral(value: string): string {
  return `'${value.split("'").join("''")}'`;
}

function buildGuide(): string {
  const lines: string[] = [];
  const push = (text = "") => lines.push(text);

  push("# Generating the invitation art on your own machine");
  push();
  push(
    "The generation tooling in `tools/` talks to the Higgsfield **API**, which bills its own " +
      "credit balance — separate from a Higgsfield web subscription. That balance is empty, so " +
      "the API path is blocked. This guide does the same job from a machine signed in to your " +
      "subscription instead, so you are not paying for the same thing twice."
  );
  push();
  push(
    "Nothing here is improvised. Every prompt below is the exact string the tooling would have " +
      "sent, composed from the canon in `tools/art-direction.ts`. That repetition is deliberate: " +
      "it is what keeps the castle the same castle in all seventeen assets. **Do not reword them.** " +
      "If something comes back wrong, change the canon and re-run `npm run handoff`, so the fix " +
      "reaches every asset at once."
  );
  push();
  push("The tooling stays where it is. If you ever add API credit, `npm run generate` still works.");
  push();

  push("## 1. Install and sign in (Windows)");
  push();
  push("In PowerShell:");
  push();
  push("```powershell");
  push("npm install -g @higgsfield/cli");
  push("higgsfield auth login");
  push("```");
  push();
  push(
    "`auth login` opens your browser and waits for you to approve. It has to be the browser on " +
      "the same machine as the CLI, which is exactly why this could not be done from our end."
  );
  push();
  push("Then confirm the model names on your account, since the catalogue moves:");
  push();
  push("```powershell");
  push("higgsfield model list");
  push("```");
  push();
  push(
    `This guide uses \`${IMAGE_MODEL}\` for images and \`${VIDEO_MODEL}\` for video. If \`model list\` ` +
      "shows a newer Seedance (the CLI's own quickstart mentions `seedance_2_5`), prefer the newest " +
      "one and keep every other setting the same."
  );
  push();

  push("## 2. The run");
  push();
  push(
    "Seventeen assets: fifteen images, then two video clips. **Generate the first one, " +
      "`fairytale-castle-hero-mobile`, and stop.** It establishes the look, and everything else is " +
      "judged against it. Send it over before running the rest."
  );
  push();
  push(
    "Each command blocks until the generation finishes and then prints a result URL. The CLI does " +
      "not save the file for you — download it from that URL and put it at the path given under " +
      "each command. **The filename matters**: the site looks each asset up by that exact name, and " +
      "an asset it cannot find falls back to the painted version instead."
  );
  push();
  push(
    "If pasting long prompts into PowerShell is awkward, `tools/generate-on-windows.ps1` runs the " +
      "whole thing in one go — see section 5."
  );
  push();

  push("### Images");
  push();
  for (const [index, scene] of SCENES.entries()) {
    push(`#### ${index + 1}. \`${scene.id}\``);
    push();
    push(
      `Save to \`public/invitation/higgsfield/${scene.category}/${scene.id}.png\` · ` +
        `${aspectFor(scene)} · was ${scene.size} on the API`
    );
    push();
    push("```powershell");
    push(`higgsfield generate create ${IMAGE_MODEL} \``);
    push(`  --aspect_ratio ${aspectFor(scene)} --quality ${IMAGE_QUALITY} --wait \``);
    push(`  --prompt ${psLiteral(buildPrompt(scene))}`);
    push("```");
    push();
  }

  push("### Video");
  push();
  push(
    "Both clips are slow and gentle on purpose, and both end on a composition that matches the " +
      "hero art so the site can cut from clip to still without a visible jump."
  );
  push();
  for (const [index, scene] of VIDEO_SCENES.entries()) {
    push(`#### ${index + 16}. \`${scene.id}\``);
    push();
    push(
      `Save to \`public/invitation/higgsfield/video/${scene.id}-raw.mp4\` · ` +
        `${scene.aspectRatio} · ${scene.duration}s`
    );
    push();
    push("```powershell");
    push(`higgsfield generate create ${VIDEO_MODEL} \``);
    push(
      `  --aspect_ratio ${scene.aspectRatio} --duration ${scene.duration} ` +
        `--resolution ${VIDEO_RESOLUTION} --wait \``
    );
    push(`  --prompt ${psLiteral(scene.prompt)}`);
    push("```");
    push();
  }

  push("## 3. Where everything goes");
  push();
  push("```");
  push("public/invitation/higgsfield/");
  const byCategory = new Map<string, Scene[]>();
  for (const scene of SCENES) {
    const list = byCategory.get(scene.category) ?? [];
    list.push(scene);
    byCategory.set(scene.category, list);
  }
  for (const [category, scenes] of byCategory) {
    push(`  ${category}/`);
    for (const scene of scenes) push(`    ${scene.id}.png`);
  }
  push("  video/");
  for (const scene of VIDEO_SCENES) push(`    ${scene.id}-raw.mp4`);
  push("```");
  push();
  push(
    "Keep the `-raw` suffix on the clips. It marks them as the untouched download, so the " +
      "compression step below never overwrites your original."
  );
  push();

  push("## 4. After the files are in");
  push();
  push("From the repo root:");
  push();
  push("```powershell");
  push("cd tools");
  push("npm install");
  push("npm run optimize");
  push("```");
  push();
  push(
    "That builds the WebP and AVIF sizes the site actually loads, writes a blurred placeholder " +
      "for each, and regenerates `src/data/media-manifest.json`. Your original PNGs are left " +
      "untouched. Commit the originals, the `optimized/` folders and the manifest together."
  );
  push();
  push(
    "The two clips need ffmpeg, which `optimize` does not do. The three commands per clip are in " +
      "`README.md` under **Videos** — an MP4, a WebM and a poster frame. The poster is required: " +
      "it is what a guest sees while the clip loads, and what stays if the clip never plays."
  );
  push();

  push("## 5. The whole run as one script");
  push();
  push(
    "`tools/generate-on-windows.ps1` holds every command above in order, downloads each result to " +
      "the right path, and skips anything already on disk, so you can stop and restart it. It " +
      "pauses after the hero for your sign-off."
  );
  push();
  push("```powershell");
  push("cd tools");
  push(".\\generate-on-windows.ps1");
  push("```");
  push();
  push(
    "It reads the result URL out of the CLI's `--json` output. That part is written against the " +
      "CLI's documented shape but has not been run against your account, so if a download comes " +
      "back empty, fall back to the individual commands in section 2 — those are the reliable path."
  );
  push();

  push("## 6. If you would rather use the web app");
  push();
  push(
    "The web app is signed in to the same subscription, and for some of these it is genuinely " +
      "easier. Paste the same prompt, set the same aspect ratio, and save the download to the same " +
      "filename — the site does not care which tool made the file."
  );
  push();
  push(
    "It is worth it for the **hero images** and the **five month backgrounds**, where you are " +
      "judging composition and will likely want to re-roll a few times. Seeing the result " +
      "immediately beats re-running a command."
  );
  push();
  push(
    "The **six decorations** are the opposite. Each one needs its subject isolated cleanly on a " +
      "plain flat field so the site can lift it out and reuse it, and that depends entirely on the " +
      "prompt being passed through exactly as written. Use the CLI for those."
  );
  push();
  push(
    "For the **two clips**, use whichever you prefer, but keep the duration at 5 seconds and the " +
      "ratio at 9:16."
  );
  push();

  push("---");
  push();
  push(
    "_Generated by `tools/handoff.ts` from `tools/art-direction.ts`. Re-run `npm run handoff` " +
      "after changing the canon._"
  );
  push();

  return lines.join("\n");
}

function buildScript(): string {
  const lines: string[] = [];
  const push = (text = "") => lines.push(text);

  push("# Generates every invitation asset through the Higgsfield CLI, in canon order.");
  push("#");
  push("# Generated by tools/handoff.ts from tools/art-direction.ts -- do not edit by hand.");
  push("# Re-run `npm run handoff` after changing the canon.");
  push("#");
  push("# Prerequisites:  npm install -g @higgsfield/cli  &&  higgsfield auth login");
  push("# Run from the tools/ directory:  .\\generate-on-windows.ps1");
  push();
  push("$ErrorActionPreference = 'Stop'");
  push("$repoRoot = Split-Path -Parent $PSScriptRoot");
  push("$mediaRoot = Join-Path $repoRoot 'public/invitation/higgsfield'");
  push();
  push("function Invoke-Asset {");
  push("    param(");
  push("        [string]$Id,");
  push("        [string]$Destination,");
  push("        [string[]]$CliArgs");
  push("    )");
  push();
  push("    if (Test-Path $Destination) {");
  push("        Write-Host \"skip   $Id (already on disk)\" -ForegroundColor DarkGray");
  push("        return");
  push("    }");
  push();
  push("    Write-Host \"generate  $Id\" -ForegroundColor Cyan");
  push("    $raw = & higgsfield @CliArgs --json");
  push("    if ($LASTEXITCODE -ne 0) {");
  push("        Write-Host \"  the CLI reported an error for $Id; stopping\" -ForegroundColor Red");
  push("        exit 1");
  push("    }");
  push();
  push("    # Pull the first URL out of the response, whatever key the CLI wraps it in.");
  push("    $url = $null");
  push("    try {");
  push("        $parsed = $raw | ConvertFrom-Json");
  push("        foreach ($key in @('result_url', 'url', 'output_url')) {");
  push("            if ($parsed.PSObject.Properties.Name -contains $key -and $parsed.$key) {");
  push("                $url = $parsed.$key; break");
  push("            }");
  push("        }");
  push("    } catch { }");
  push("    if (-not $url) {");
  push("        $match = [regex]::Match([string]$raw, 'https://[^\"\\s]+\\.(png|jpg|jpeg|webp|mp4)')");
  push("        if ($match.Success) { $url = $match.Value }");
  push("    }");
  push();
  push("    if (-not $url) {");
  push("        Write-Host \"  finished, but no download URL was found in the response.\" -ForegroundColor Yellow");
  push("        Write-Host \"  save it manually to: $Destination\" -ForegroundColor Yellow");
  push("        Write-Host $raw");
  push("        return");
  push("    }");
  push();
  push("    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Destination) | Out-Null");
  push("    Invoke-WebRequest -Uri $url -OutFile $Destination");
  push("    Write-Host \"  saved  $Destination\" -ForegroundColor Green");
  push("}");
  push();

  const [hero, ...rest] = SCENES;

  push("# --- The hero comes first and alone: everything else is judged against it. ---");
  push();
  push(...imageCall(hero));
  push();
  push("Write-Host ''");
  push("Write-Host 'The hero is done. Send it over for sign-off before generating the rest.' -ForegroundColor Yellow");
  push("$answer = Read-Host 'Continue with the remaining 16 assets now? (y/N)'");
  push("if ($answer -ne 'y') { Write-Host 'Stopped. Re-run this script to pick up where it left off.'; exit 0 }");
  push();
  push("# --- The remaining images ---");
  push();
  for (const scene of rest) {
    push(...imageCall(scene));
    push();
  }

  push("# --- The two cinematic clips ---");
  push();
  for (const scene of VIDEO_SCENES) {
    push(`Invoke-Asset -Id ${psLiteral(scene.id)} \``);
    push(`    -Destination (Join-Path $mediaRoot 'video/${scene.id}-raw.mp4') \``);
    push("    -CliArgs @(");
    push("        'generate', 'create',");
    push(`        ${psLiteral(VIDEO_MODEL)},`);
    push(`        '--aspect_ratio', ${psLiteral(scene.aspectRatio)},`);
    push(`        '--duration', ${psLiteral(String(scene.duration))},`);
    push(`        '--resolution', ${psLiteral(VIDEO_RESOLUTION)},`);
    push("        '--wait',");
    push(`        '--prompt', ${psLiteral(scene.prompt)}`);
    push("    )");
    push();
  }

  push("Write-Host ''");
  push("Write-Host 'All assets generated.' -ForegroundColor Green");
  push("Write-Host 'Next: npm run optimize, then the ffmpeg commands in README.md for the clips.'");
  push();

  return lines.join("\n");
}

function imageCall(scene: Scene): string[] {
  return [
    `Invoke-Asset -Id ${psLiteral(scene.id)} \``,
    `    -Destination (Join-Path $mediaRoot '${scene.category}/${scene.id}.png') \``,
    "    -CliArgs @(",
    "        'generate', 'create',",
    `        ${psLiteral(IMAGE_MODEL)},`,
    `        '--aspect_ratio', ${psLiteral(aspectFor(scene))},`,
    `        '--quality', ${psLiteral(IMAGE_QUALITY)},`,
    "        '--wait',",
    `        '--prompt', ${psLiteral(buildPrompt(scene))}`,
    "    )",
  ];
}

async function main(): Promise<void> {
  await mkdir(dirname(GUIDE_PATH), { recursive: true });
  await writeFile(GUIDE_PATH, buildGuide());
  // UTF-8 BOM: Windows PowerShell 5.1 reads a BOM-less file as ANSI, which would mangle
  // the em-dashes and accented characters that appear in every prompt. PowerShell 7 and
  // every editor handle the BOM fine, so it is the safe default for a script we cannot
  // test on the target machine.
  await writeFile(SCRIPT_PATH, `\uFEFF${buildScript()}`);
  console.log(`wrote ${GUIDE_PATH.replace(`${REPO_ROOT}/`, "")}`);
  console.log(`wrote ${SCRIPT_PATH.replace(`${REPO_ROOT}/`, "")}`);
  console.log(`${SCENES.length} images + ${VIDEO_SCENES.length} videos`);
}

main().catch((err) => {
  console.error("Hand-off generation failed:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
