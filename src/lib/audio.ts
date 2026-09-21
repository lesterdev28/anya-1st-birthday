/**
 * The invitation's sound, as one engine rather than as an <audio> tag.
 *
 * The brief asks for the music to change with the scene and to cross-fade rather than
 * cut, which an <audio> element cannot do: two elements fading against each other drift
 * apart, and setting `.volume` on iOS does nothing at all. Web Audio gives real gain
 * ramps on the audio thread, so a fade is exact and free.
 *
 * Three rules the whole file exists to keep:
 *
 *   - Nothing is fetched until it is needed. The beds are a megabyte between them, and a
 *     guest who mutes the page on the first screen should never pay for any of it.
 *   - Nothing makes a sound before the guest has asked for one. Browsers enforce this
 *     anyway; the engine treats it as the design rather than as an obstacle to work
 *     around, so the first note lands on the "Enter" button and not on a stray scroll.
 *   - Every failure is silent. No network error, decode failure or blocked context ever
 *     surfaces to a guest: this is the background music of an invitation, and an
 *     invitation that shows an error about its soundtrack has failed at being one.
 */
import { AUDIO_SOURCES, type SoundId } from "./assets";
import type { SceneId } from "./scene";
import { sound } from "../data/party";

export type BedId = Extract<SoundId, "lullaby" | "sky" | "shimmer">;
export type SfxId = Extract<SoundId, "enter" | "chime" | "sparkle" | "bloom">;

/**
 * Which bed plays where.
 *
 * The lullaby carries the story itself. The sky bed is almost formless and belongs to
 * the two ends of the journey, where the guest is looking at weather. The shimmer is
 * the lullaby with the lights on, for the year adding up and the invitation.
 */
const BED_FOR_SCENE: Record<SceneId, BedId> = {
  intro: "sky",
  "fairy-garden": "lullaby",
  "month-journey": "lullaby",
  "month-12": "shimmer",
  invitation: "shimmer",
  rsvp: "lullaby",
  finale: "sky",
};

export function bedForScene(scene: SceneId): BedId {
  return BED_FOR_SCENE[scene];
}

/** How loud each one-shot is against the bed. */
const SFX_GAIN: Record<SfxId, number> = {
  enter: 0.55,
  chime: 0.4,
  sparkle: 0.34,
  bloom: 0.5,
};

type Ctx = AudioContext & { readonly state: AudioContextState };

interface Playing {
  readonly bed: BedId;
  readonly source: AudioBufferSourceNode;
  readonly gain: GainNode;
}

let ctx: Ctx | null = null;
let master: GainNode | null = null;
let current: Playing | null = null;
let wanted: BedId | null = null;
let muted = false;

const buffers = new Map<SoundId, AudioBuffer>();
const loading = new Map<SoundId, Promise<AudioBuffer | null>>();

/** Opus where it is supported, AAC everywhere else. Decided once. */
function sourceFor(id: SoundId): string {
  const set = AUDIO_SOURCES[id];
  const probe = document.createElement("audio");
  return probe.canPlayType('audio/webm; codecs="opus"') ? set.webm : set.mp4;
}

function load(id: SoundId): Promise<AudioBuffer | null> {
  const ready = buffers.get(id);
  if (ready) return Promise.resolve(ready);

  const inFlight = loading.get(id);
  if (inFlight) return inFlight;

  const job = (async () => {
    try {
      const response = await fetch(sourceFor(id));
      if (!response.ok) return null;
      const bytes = await response.arrayBuffer();
      const engine = ctx;
      if (!engine) return null;
      const decoded = await engine.decodeAudioData(bytes);
      buffers.set(id, decoded);
      return decoded;
    } catch {
      /* No sound is an acceptable outcome; a broken page is not. */
      return null;
    } finally {
      loading.delete(id);
    }
  })();

  loading.set(id, job);
  return job;
}

/**
 * Brings the engine up. Must be called from inside a real user gesture, which is why it
 * is exported rather than done on first import.
 */
export function unlock(): void {
  if (ctx) {
    void ctx.resume();
    return;
  }

  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ?? (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return;

  ctx = new Ctor() as Ctx;
  master = ctx.createGain();
  master.gain.value = muted ? 0 : sound.volume;
  master.connect(ctx.destination);

  if (wanted) void setBed(wanted);
}

export function isRunning(): boolean {
  return ctx !== null && !muted;
}

function ramp(gain: GainNode, to: number, seconds: number): void {
  if (!ctx) return;
  const now = ctx.currentTime;
  // Pin the current value first, or the ramp starts from whatever was scheduled before.
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.linearRampToValueAtTime(to, now + seconds);
}

/**
 * Cross-fades to a bed, loading it if this is the first time it is asked for.
 *
 * Remembering the request before the fetch matters: a guest can cross two scenes while
 * a bed is still downloading, and the one that arrives must not be allowed to override
 * the one that was asked for last.
 */
export async function setBed(bed: BedId): Promise<void> {
  wanted = bed;
  if (!ctx || !master) return;
  if (current?.bed === bed) return;

  const buffer = await load(bed);
  if (!buffer || !ctx || !master) return;
  // Something else was asked for while this was downloading.
  if (wanted !== bed) return;
  if (current?.bed === bed) return;

  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.connect(master);

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.connect(gain);
  source.start();

  ramp(gain, 1, sound.fadeSeconds);

  const leaving = current;
  current = { bed, source, gain };

  if (leaving) {
    ramp(leaving.gain, 0, sound.fadeSeconds);
    window.setTimeout(() => {
      try {
        leaving.source.stop();
        leaving.source.disconnect();
        leaving.gain.disconnect();
      } catch {
        /* Already stopped. */
      }
    }, sound.fadeSeconds * 1000 + 200);
  }
}

/** A one-shot over whatever is playing. Does nothing if the engine is not up. */
export async function playSfx(id: SfxId): Promise<void> {
  if (!ctx || !master || muted) return;

  const buffer = await load(id);
  if (!buffer || !ctx || !master || muted) return;

  const gain = ctx.createGain();
  gain.gain.value = SFX_GAIN[id];
  gain.connect(master);

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(gain);
  source.onended = () => {
    source.disconnect();
    gain.disconnect();
  };
  source.start();
}

export function setMuted(next: boolean): void {
  muted = next;
  if (!ctx || !master) return;
  ramp(master, next ? 0 : sound.volume, next ? 0.6 : sound.fadeSeconds);
  if (!next) void ctx.resume();
}

export function isMuted(): boolean {
  return muted;
}
