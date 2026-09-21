/**
 * The music-box lullaby, and the one control that silences it.
 *
 * Browsers will not let a page make noise before the visitor has done something, so
 * there is no question of the music simply starting: it waits for the first tap, click,
 * key or scroll and begins then. That is also the right behaviour for an invitation,
 * which is often opened in a room with other people in it — hence a control that is
 * visible from the first frame rather than hidden at the bottom of the page.
 *
 * The choice is remembered. Someone who silences it once never hears it start again,
 * on any visit, which matters more than the music does.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { AUDIO_SOURCES } from "../lib/assets";
import { sound } from "../data/party";
import "./SoundToggle.css";

const STORAGE_KEY = "anya-sound";

/** localStorage throws in some private-browsing modes, so every access is guarded. */
function storedChoice(): "on" | "off" | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "on" || value === "off" ? value : null;
  } catch {
    return null;
  }
}

function remember(choice: "on" | "off"): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* Not being able to remember is not a reason to fail. */
  }
}

export function SoundToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const fadeRef = useRef<number | null>(null);

  /** Ramps the volume rather than cutting it in, which would land as a thump. */
  const fadeTo = useCallback((target: number, done?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeRef.current !== null) window.clearInterval(fadeRef.current);

    const step = (target - audio.volume) / 24;
    fadeRef.current = window.setInterval(() => {
      const next = audio.volume + step;
      const finished = step > 0 ? next >= target : next <= target;
      audio.volume = Math.min(1, Math.max(0, finished ? target : next));
      if (finished) {
        if (fadeRef.current !== null) window.clearInterval(fadeRef.current);
        fadeRef.current = null;
        done?.();
      }
    }, 50);
  }, []);

  const start = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0;
    void audio
      .play()
      .then(() => {
        setPlaying(true);
        fadeTo(sound.volume);
      })
      .catch(() => {
        // Refused by the browser. Leave the control showing "off" and say nothing;
        // the visitor can press it themselves, which always counts as a gesture.
        setPlaying(false);
      });
  }, [fadeTo]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setPlaying(false);
    fadeTo(0, () => audio.pause());
  }, [fadeTo]);

  // Waits for the first gesture of any kind, then gets out of the way.
  useEffect(() => {
    if (!sound.autoStart || storedChoice() === "off") return;

    const events = ["pointerdown", "keydown", "touchstart", "wheel", "scroll"] as const;
    const begin = () => {
      events.forEach((event) => window.removeEventListener(event, begin));
      start();
    };
    events.forEach((event) => window.addEventListener(event, begin, { once: true, passive: true }));

    return () => events.forEach((event) => window.removeEventListener(event, begin));
  }, [start]);

  useEffect(() => () => {
    if (fadeRef.current !== null) window.clearInterval(fadeRef.current);
  }, []);

  const toggle = () => {
    if (playing) {
      remember("off");
      stop();
    } else {
      remember("on");
      start();
    }
  };

  return (
    <>
      <audio ref={audioRef} loop preload="auto">
        <source src={AUDIO_SOURCES.lullaby.webm} type="audio/webm" />
        <source src={AUDIO_SOURCES.lullaby.m4a} type="audio/mp4" />
      </audio>

      <button
        type="button"
        className={`sound-toggle${playing ? " is-playing" : ""}`}
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Turn the music off" : "Turn the music on"}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 9.5h3L12 6v12l-4-3.5H5z" />
            {playing ? (
              <>
                <path d="M15.6 9.3a3.6 3.6 0 0 1 0 5.4" />
                <path d="M18 7a7 7 0 0 1 0 10" />
              </>
            ) : (
              <path d="M16 9.5l4.5 5M20.5 9.5l-4.5 5" />
            )}
          </g>
        </svg>
      </button>
    </>
  );
}
