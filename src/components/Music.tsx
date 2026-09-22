/**
 * The soundtrack, mounted once for the whole page.
 *
 * There is no control: the brief for this version asks for the music simply to be
 * playing when the invitation opens. The element is hidden rather than given browser
 * controls, and a guest who wants silence has their device's own mute — which is what
 * they reach for anyway.
 */
import { useEffect, useRef } from "react";
import { MUSIC_SOURCES } from "../lib/assets";
import { startMusic } from "../lib/audio";

export function Music() {
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;
    return startMusic(audio);
  }, []);

  return (
    /*
      Two sources rather than a runtime `canPlayType` probe: the browser picks the first
      it can decode, and only fetches that one. Opus is a fifth smaller than the AAC.
    */
    <audio ref={ref} loop preload="auto" aria-hidden="true" tabIndex={-1}>
      <source src={MUSIC_SOURCES.webm} type="audio/webm" />
      <source src={MUSIC_SOURCES.mp4} type="audio/mp4" />
    </audio>
  );
}
