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

/**
 * Starts the music and keeps trying until it is allowed to.
 *
 * Every browser refuses to play sound on a page the guest has not touched yet, and it
 * refuses quietly, by rejecting the promise. So the first attempt is made immediately —
 * it succeeds where the guest has been here before, or has the site's autoplay
 * permission — and the same attempt is armed behind the first gesture of any kind, which
 * on this page is almost always "Enter Anya's Fairy Garden". The guest never sees a
 * prompt either way.
 *
 * Returns the teardown for the listeners it attached.
 */
export function startMusic(audio: HTMLAudioElement): () => void {
  /* The encode already sits at about -22 LUFS, so full volume is the right volume. */
  audio.volume = 1;
  audio.loop = true;

  let playing = false;

  /* Anything that counts as a gesture, plus the wheel and scroll that often come first. */
  const gestures = ["pointerdown", "touchstart", "keydown", "wheel", "scroll"] as const;

  const stopListening = () => {
    for (const event of gestures) window.removeEventListener(event, attempt);
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

  attempt();
  for (const event of gestures) {
    window.addEventListener(event, attempt, { passive: true });
  }

  return stopListening;
}
