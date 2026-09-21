/**
 * The one control for the invitation's sound, and the thing that drives the engine.
 *
 * Two jobs. It watches which chapter the guest is in and asks the engine for that
 * chapter's music bed, which is what makes the soundtrack follow the journey. And it is
 * the button: one tap silences everything, and the choice is remembered, because an
 * invitation is often opened in a room with other people in it and someone who silences
 * it once should never have it start on them again.
 *
 * Nothing makes a sound before the guest presses "Enter Anya's Fairy Garden". Browsers
 * would refuse anyway, but the point is that the entrance is where the music belongs.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { bedForScene, playSfx, setBed, setMuted, unlock } from "../lib/audio";
import { useActiveScene } from "../lib/scene";
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

/** The one-shot that belongs to arriving in a chapter, where one does. */
const ARRIVAL_SFX = {
  "month-12": "sparkle",
  invitation: "chime",
} as const;

export function SoundToggle() {
  const scene = useActiveScene();
  const [on, setOn] = useState(false);
  const started = useRef(false);

  const start = useCallback(() => {
    if (started.current) return;
    started.current = true;
    unlock();
    setMuted(false);
    void setBed(bedForScene(scene));
    setOn(true);
    remember("on");
  }, [scene]);

  /*
   * The entrance button is the gesture the whole soundtrack hangs on. It fires an event
   * rather than calling in here directly so the hero does not have to know that sound
   * exists at all.
   */
  useEffect(() => {
    const begin = () => {
      if (storedChoice() === "off") return;
      start();
      void playSfx("enter");
    };
    window.addEventListener("anya:enter", begin);
    return () => window.removeEventListener("anya:enter", begin);
  }, [start]);

  /* Follow the journey. Does nothing at all until the engine has been unlocked. */
  useEffect(() => {
    if (!on) return;
    void setBed(bedForScene(scene));

    const arrival = ARRIVAL_SFX[scene as keyof typeof ARRIVAL_SFX];
    if (arrival) void playSfx(arrival);
  }, [on, scene]);

  const toggle = () => {
    if (on) {
      remember("off");
      setMuted(true);
      setOn(false);
      return;
    }

    if (started.current) {
      remember("on");
      setMuted(false);
      setOn(true);
      return;
    }

    start();
  };

  return (
    <button
      type="button"
      className={`sound-toggle${on ? " is-playing" : ""}`}
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn the music off" : "Turn the music on"}
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
          {on ? (
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
  );
}
