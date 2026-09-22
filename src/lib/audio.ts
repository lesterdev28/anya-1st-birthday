/**
 * The invitation's music.
 *
 * One track, looping, for the whole journey — the piece Lester chose rather than
 * anything generated here. It replaces the earlier three-bed engine: a scored piece
 * carries its own shape, and cross-fading between edits of it would only fight the
 * arrangement.
 *
 * It is an <audio> element rather than a Web Audio graph on purpose. The track is five
 * minutes long, and Web Audio's `decodeAudioData` must hold the entire file before it
 * can make a sound; an element streams, so the first bar lands while the rest is still
 * arriving. The playback level is baked into the encode instead of set with a gain, so
 * the invitation sounds the same on an iPhone — where `.volume` is read-only and every
 * JavaScript fade is silently ignored — as it does anywhere else.
 */
import { MUSIC_SOURCES } from "./assets";

/**
 * Starts the music and keeps trying until it is allowed to.
 *
 * Every browser refuses to play sound on a page the guest has not touched yet, and it
 * refuses quietly, by rejecting the promise. There is no way around that and no way to
 * ask. So the first attempt is made immediately — it succeeds where the guest has been
 * here before, or has the site's autoplay permission — and the same attempt is armed on
 * the document in the capture phase, so the very first press, key or scroll starts it
 * before anything else on the page has had a chance to act on that gesture. On this page
 * that press is almost always "Enter Anya's Fairy Garden". The guest never sees a prompt
 * either way, and never a control.
 *
 * Returns the teardown for the listeners it attached.
 */
export function startMusic(audio: HTMLAudioElement): () => void {
  claimPlaybackSession();

  /* The encode already sits at about -22 LUFS, so full volume is the right volume. */
  audio.volume = 1;
  audio.loop = true;

  let playing = false;

  /* Anything that counts as a gesture, plus the wheel and scroll that often come first. */
  const gestures = ["pointerdown", "touchstart", "mousedown", "click", "keydown", "wheel"] as const;

  /*
   * On the document, in the capture phase, so this runs before any handler the page has
   * of its own — the first press on this page is the entrance button, and the music
   * should start on the press itself rather than after whatever the button does.
   */
  const options = { capture: true, passive: true } as const;

  const stopListening = () => {
    for (const event of gestures) document.removeEventListener(event, attempt, options);
    window.removeEventListener("scroll", attempt);
  };

  function attempt(): void {
    if (playing) return;
    audio
      .play()
      .then(() => {
        playing = true;
        stopListening();
      })
      .catch(() => {
        /* Not allowed yet. The listeners below will ask again on the next gesture. */
      });
  }

  /*
   * A browser can also reject because it has no data yet rather than because it is not
   * allowed to play, so the first moment there is something to play is worth one more
   * try. And if the chosen source turns out to be undecodable after all, fall back to
   * the AAC by hand: <source> selection happens once, and a browser that has committed
   * to a file never reconsiders.
   */
  audio.addEventListener("canplay", attempt);
  audio.addEventListener("error", fallBackToAac);

  attempt();
  for (const event of gestures) {
    document.addEventListener(event, attempt, options);
  }
  /* Scroll only fires on the window (or the scrolling element), never on the document. */
  window.addEventListener("scroll", attempt, { passive: true });

  return () => {
    stopListening();
    audio.removeEventListener("canplay", attempt);
    audio.removeEventListener("error", fallBackToAac);
  };

  function fallBackToAac(): void {
    if (audio.src.endsWith(".mp4")) return;
    audio.src = MUSIC_SOURCES.mp4;
    audio.load();
  }
}

/**
 * Asks iOS for a playback audio session.
 *
 * Without one, an <audio> element on an iPhone is silenced by the hardware ring/silent
 * switch — so an invitation opened on a phone that lives on silent, which is most of
 * them, plays nothing at all and looks broken rather than muted. Safari 16.4 and later
 * expose this; everything else ignores it.
 */
function claimPlaybackSession(): void {
  const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
  if (!session) return;
  try {
    session.type = "playback";
  } catch {
    /* Read-only on some versions. Nothing else to do about it. */
  }
}
