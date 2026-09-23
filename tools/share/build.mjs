/**
 * Renders the social share card to public/invitation/share/.
 *
 * Run it from the repo root with a built `dist` being served, then rebuild:
 *   npx vite build && npx vite preview --port 4321 &
 *   node tools/share/build.mjs
 *
 * It draws through Chromium rather than through an image library so the card uses the
 * site's own fonts, its gold gradient and its real photograph of Anya. The output is
 * JPEG at 1200x630, which is what Facebook, Messenger and iMessage want — several of
 * them will not read a WebP, and none of them will resolve a relative image URL.
 */
import { chromium } from "playwright";
import { mkdir, copyFile, unlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const SERVED = `${ROOT}/dist/share-card.html`;
const OUT_DIR = `${ROOT}/public/invitation/share`;

await copyFile(`${ROOT}/tools/share/card.html`, SERVED);
await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
});

const failed = [];
page.on("requestfailed", (request) => failed.push(request.url()));
page.on("response", (response) => {
  if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`);
});

await page.goto("http://localhost:4321/share-card.html", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

if (failed.length) {
  console.error("assets failed to load:\n" + failed.join("\n"));
  process.exit(1);
}

await page.screenshot({
  path: `${OUT_DIR}/anya-share.jpg`,
  type: "jpeg",
  quality: 88,
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});

await browser.close();
await unlink(SERVED);
console.log("wrote public/invitation/share/anya-share.jpg");
