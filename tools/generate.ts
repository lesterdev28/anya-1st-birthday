/**
 * Higgsfield generation CLI for the invitation's media.
 *
 * Every prompt is composed from the shared canon in art-direction.ts so the whole
 * asset library stays inside one visual universe. Nothing here invents a prompt.
 *
 * Credentials come from HF_CREDENTIALS (format key-id:key-secret) in the environment,
 * or from .env.local. The value is never logged.
 *
 * Usage:
 *   npm run generate -- --list                 show every scene id
 *   npm run generate -- --scene <id> [...]     generate specific image scenes
 *   npm run generate -- --images               generate every image scene
 *   npm run generate -- --video <id>           generate a video scene
 *   npm run generate -- --dry-run --scene <id> print the composed prompt, call nothing
 *
 * Output lands in public/invitation/higgsfield/<category>/<id>.png (raw generation).
 * Run `npm run optimize` afterwards to produce the WebP/AVIF derivatives the site uses.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import {
  config as configureHiggsfield,
  higgsfield,
  HiggsfieldError,
  type V2Response,
} from "@higgsfield/client/v2";
import { SCENES, VIDEO_SCENES, buildPrompt, type Scene, type VideoScene } from "./art-direction.js";

loadEnv({ path: ".env.local" });

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MEDIA_ROOT = resolve(REPO_ROOT, "public/invitation/higgsfield");

const IMAGE_ENDPOINT = "/v1/text2image/soul";
const VIDEO_MODEL = "bytedance/seedance-2.5/text-to-video";

function describeFailure(response: V2Response): string {
  switch (response.status) {
    case "nsfw":
      return "rejected by content moderation (nsfw); credits were refunded";
    case "failed":
      return "generation failed on the server; credits were refunded";
    case "queued":
    case "in_progress":
      return `did not finish before polling stopped (status: ${response.status})`;
    default:
      return `ended in an unexpected status: ${response.status}`;
  }
}

async function download(url: string, destination: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Downloading ${destination} failed: HTTP ${response.status}`);
  }
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

async function generateImage(scene: Scene, dryRun: boolean): Promise<void> {
  const prompt = buildPrompt(scene);
  if (dryRun) {
    console.log(`\n--- ${scene.id} (${scene.size}) ---\n${prompt}\n`);
    return;
  }

  console.log(`Generating image ${scene.id} at ${scene.size} (billable)...`);
  const response = await higgsfield.subscribe(IMAGE_ENDPOINT, {
    input: {
      prompt,
      width_and_height: scene.size,
      quality: "1080p",
      batch_size: 1,
      enhance_prompt: false,
    },
    withPolling: true,
  });

  const url = response.status === "completed" ? response.images?.[0]?.url : undefined;
  if (!url) {
    throw new Error(
      `Request ${response.request_id} produced no image: ${describeFailure(response)}.`,
    );
  }

  const destination = resolve(MEDIA_ROOT, scene.category, `${scene.id}.png`);
  await download(url, destination);
  console.log(`  saved ${destination} (request ${response.request_id})`);
}

async function generateVideo(scene: VideoScene, dryRun: boolean): Promise<void> {
  if (dryRun) {
    console.log(
      `\n--- ${scene.id} (${scene.aspectRatio}, ${scene.duration}s) ---\n${scene.prompt}\n`,
    );
    return;
  }

  console.log(`Generating video ${scene.id} (billable)...`);
  const response = await higgsfield.subscribe(VIDEO_MODEL, {
    input: {
      prompt: scene.prompt,
      duration: scene.duration,
      resolution: "1080p",
      aspect_ratio: scene.aspectRatio,
    },
    withPolling: true,
  });

  if (response.status !== "completed" || !response.video?.url) {
    throw new Error(
      `Request ${response.request_id} produced no video: ${describeFailure(response)}.`,
    );
  }

  const destination = resolve(MEDIA_ROOT, "video", `${scene.id}-raw.mp4`);
  await download(response.video.url, destination);
  console.log(`  saved ${destination} (request ${response.request_id})`);
}

function parseArgs(argv: string[]) {
  const sceneIds: string[] = [];
  const videoIds: string[] = [];
  let allImages = false;
  let allVideos = false;
  let list = false;
  let dryRun = false;

  for (let i = 0; i < argv.length; i += 1) {
    switch (argv[i]) {
      case "--scene":
        sceneIds.push(argv[++i]);
        break;
      case "--video":
        videoIds.push(argv[++i]);
        break;
      case "--images":
        allImages = true;
        break;
      case "--videos":
        allVideos = true;
        break;
      case "--list":
        list = true;
        break;
      case "--dry-run":
        dryRun = true;
        break;
      default:
        throw new Error(`Unknown argument: ${argv[i]}`);
    }
  }
  return { sceneIds, videoIds, allImages, allVideos, list, dryRun };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.list) {
    console.log("Image scenes:");
    for (const scene of SCENES)
      console.log(`  ${scene.id.padEnd(34)} ${scene.category}/${scene.size}`);
    console.log("Video scenes:");
    for (const scene of VIDEO_SCENES)
      console.log(`  ${scene.id.padEnd(34)} ${scene.aspectRatio}/${scene.duration}s`);
    return;
  }

  const images = args.allImages
    ? [...SCENES]
    : args.sceneIds.map((id) => {
        const scene = SCENES.find((candidate) => candidate.id === id);
        if (!scene) throw new Error(`No image scene named "${id}". Run with --list.`);
        return scene;
      });

  const videos = args.allVideos
    ? [...VIDEO_SCENES]
    : args.videoIds.map((id) => {
        const scene = VIDEO_SCENES.find((candidate) => candidate.id === id);
        if (!scene) throw new Error(`No video scene named "${id}". Run with --list.`);
        return scene;
      });

  if (images.length === 0 && videos.length === 0) {
    throw new Error(
      "Nothing to do. Pass --scene <id>, --video <id>, --images, --videos or --list.",
    );
  }

  if (!args.dryRun) {
    const credentials = process.env.HF_CREDENTIALS;
    if (!credentials || !credentials.includes(":")) {
      throw new Error(
        "HF_CREDENTIALS is not set (expected format key-id:key-secret). Set it in the " +
          "environment or in tools/.env.local before running this script.",
      );
    }
    configureHiggsfield({ credentials });
  }

  // Sequential on purpose: one failure should not burn credits on the rest of the batch.
  for (const scene of images) await generateImage(scene, args.dryRun);
  for (const scene of videos) await generateVideo(scene, args.dryRun);
}

main().catch((err) => {
  if (err instanceof HiggsfieldError) {
    console.error(`Generation did not succeed (${err.constructor.name}):`, err.message);
  } else {
    console.error("Generation did not succeed:", err instanceof Error ? err.message : err);
  }
  process.exitCode = 1;
});
