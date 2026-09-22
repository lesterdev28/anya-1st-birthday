/**
 * Turns raw media into the web-delivery derivatives the site actually loads.
 *
 * Photos (public/invitation/photos/*.jpg) and raw Higgsfield PNGs
 * (public/invitation/higgsfield/<category>/*.png) both go through here. The originals
 * are left untouched on disk so we never lose quality; the site only ever references
 * the generated .webp and .avif files.
 *
 * Videos are not handled here — they need ffmpeg. See README for the two commands.
 *
 * Usage:
 *   npm run optimize             everything that has no up-to-date derivative
 *   npm run optimize -- --force  rebuild every derivative
 */
import { readdir, readFile, stat, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const INVITATION_ROOT = resolve(REPO_ROOT, "public/invitation");
const MANIFEST_PATH = resolve(REPO_ROOT, "src/data/media-manifest.json");

/**
 * Responsive widths. A source narrower than a width is not upscaled.
 *
 * Photos stop at 960 on purpose. The frame asks for 62vw on a phone and 22rem on a
 * desktop, so even a 3x phone picks 960; a 1440 file is weight almost nobody downloads,
 * and with forty-odd photographs in the journey that weight is the whole page.
 */
const PHOTO_WIDTHS = [480, 960];
const ART_WIDTHS = [640, 1280, 1920];
/**
 * The cut-out watercolour pieces in public/invitation/art.
 *
 * Small on purpose: the largest any of them is drawn is about 320 CSS pixels, so 640
 * already covers a 2x screen. They keep their alpha — webp and avif both carry it — and
 * a higher quality than the photographs, because a flat wash shows banding where a
 * photograph hides it.
 */
const DECOR_WIDTHS = [320, 640];

interface Job {
  readonly source: string;
  readonly widths: readonly number[];
  /** Art keeps its alpha-free flat look; photos get a touch more compression. */
  readonly quality: number;
}

async function collect(directory: string, extensions: string[]): Promise<string[]> {
  if (!existsSync(directory)) return [];
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collect(full, extensions)));
    } else if (extensions.includes(extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

/** True when the derivative is missing or older than its source. */
async function isStale(source: string, derivative: string): Promise<boolean> {
  if (!existsSync(derivative)) return true;
  const [sourceStat, derivativeStat] = await Promise.all([stat(source), stat(derivative)]);
  return sourceStat.mtimeMs > derivativeStat.mtimeMs;
}

/**
 * What the site needs to know about one optimized asset. Written into
 * src/data/media-manifest.json so components never guess at a URL: an asset absent
 * from the manifest simply has not been generated yet, and its component falls back.
 */
export interface ManifestEntry {
  /** Public URL prefix, e.g. "/invitation/photos/optimized/anya-smile-01". */
  readonly base: string;
  /** Only the widths that were actually written — no 404s in a srcset. */
  readonly widths: number[];
  readonly aspectRatio: number;
  /** Inline data URI of the tiny blurred preview. */
  readonly placeholder: string;
}

async function buildDerivatives(
  job: Job,
  force: boolean
): Promise<{ written: number; stem: string; entry: ManifestEntry }> {
  const stem = basename(job.source, extname(job.source));
  const outputDirectory = join(dirname(job.source), "optimized");
  await mkdir(outputDirectory, { recursive: true });

  const metadata = await sharp(job.source).metadata();
  const sourceWidth = metadata.width ?? Math.max(...job.widths);
  const sourceHeight = metadata.height ?? sourceWidth;
  let written = 0;
  const availableWidths: number[] = [];

  for (const width of job.widths) {
    if (width > sourceWidth) continue;
    availableWidths.push(width);
    for (const format of ["webp", "avif"] as const) {
      const derivative = join(outputDirectory, `${stem}-${width}.${format}`);
      if (!force && !(await isStale(job.source, derivative))) continue;

      const pipeline = sharp(job.source).resize({ width, withoutEnlargement: true });
      await (format === "webp"
        ? pipeline.webp({ quality: job.quality })
        : pipeline.avif({ quality: job.quality - 5 })
      ).toFile(derivative);
      written += 1;
    }
  }

  // Nothing matched a target width (a very small source): keep the native width.
  if (availableWidths.length === 0) {
    availableWidths.push(sourceWidth);
    for (const format of ["webp", "avif"] as const) {
      const derivative = join(outputDirectory, `${stem}-${sourceWidth}.${format}`);
      const pipeline = sharp(job.source);
      await (format === "webp"
        ? pipeline.webp({ quality: job.quality })
        : pipeline.avif({ quality: job.quality - 5 })
      ).toFile(derivative);
      written += 1;
    }
  }

  // A small blurred placeholder, inlined by the site as the low-quality preview.
  const placeholderPath = join(outputDirectory, `${stem}-placeholder.webp`);
  if (force || (await isStale(job.source, placeholderPath))) {
    await sharp(job.source).resize({ width: 24 }).blur(1.2).webp({ quality: 40 }).toFile(placeholderPath);
    written += 1;
  }

  const placeholderBytes = await readFile(placeholderPath);
  const publicBase = join(dirname(job.source), "optimized", stem)
    .replace(resolve(REPO_ROOT, "public"), "")
    .split("\\")
    .join("/");

  return {
    written,
    stem,
    entry: {
      base: publicBase,
      widths: availableWidths,
      aspectRatio: Number((sourceWidth / sourceHeight).toFixed(4)),
      placeholder: `data:image/webp;base64,${placeholderBytes.toString("base64")}`,
    },
  };
}

async function main(): Promise<void> {
  const force = process.argv.includes("--force");

  const photos = await collect(join(INVITATION_ROOT, "photos"), [".jpg", ".jpeg", ".png"]);
  const art = await collect(join(INVITATION_ROOT, "higgsfield"), [".png", ".jpg"]);
  const decor = await collect(join(INVITATION_ROOT, "art"), [".png"]);

  const jobs: Job[] = [
    ...photos
      .filter((file) => !file.includes("/optimized/"))
      .map((source) => ({ source, widths: PHOTO_WIDTHS, quality: 78 })),
    ...art
      .filter((file) => !file.includes("/optimized/"))
      .map((source) => ({ source, widths: ART_WIDTHS, quality: 82 })),
    ...decor
      .filter((file) => !file.includes("/optimized/"))
      .map((source) => ({ source, widths: DECOR_WIDTHS, quality: 88 })),
  ];

  if (jobs.length === 0) {
    console.log("Nothing to optimize. Add photos or generate Higgsfield art first.");
    return;
  }

  let total = 0;
  const manifest: Record<string, ManifestEntry> = {};

  for (const job of jobs) {
    const { written, stem, entry } = await buildDerivatives(job, force);
    total += written;
    manifest[stem] = entry;
    console.log(`${written > 0 ? "built" : "up to date"}  ${job.source.replace(`${REPO_ROOT}/`, "")}`);
  }

  // Sorted so the committed manifest has a stable diff.
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await mkdir(dirname(MANIFEST_PATH), { recursive: true });
  await writeFile(MANIFEST_PATH, `${JSON.stringify(sorted, null, 2)}\n`);

  console.log(`\n${total} derivative${total === 1 ? "" : "s"} written.`);
  console.log(`Manifest: ${Object.keys(sorted).length} assets -> ${MANIFEST_PATH.replace(`${REPO_ROOT}/`, "")}`);
}

main().catch((err) => {
  console.error("Optimization failed:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
