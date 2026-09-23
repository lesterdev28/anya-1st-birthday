/**
 * The way back, and the way forward.
 *
 * Deliberately almost invisible: a short rail of dots down one side, one per part of the
 * journey, lit for the part the guest is in. An invitation with a navigation bar across
 * the top stops being an invitation, but a guest who has scrolled through the whole year
 * and wants to get back to the RSVP should not have to scroll back through it.
 */
import { useRef } from "react";
import { SCENES, useActiveScene, type SceneId } from "../lib/scene";
import "./Nav.css";

/** How far a pointer may travel between pressing and releasing and still count as a tap. */
const TAP_SLOP = 10;

/** Only the stops worth jumping to; the month chapters share one dot. */
const STOPS: readonly { readonly scene: SceneId; readonly href: string; readonly label: string }[] = [
  { scene: "intro", href: "#top", label: "The beginning" },
  { scene: "month-journey", href: "#garden", label: "Her first year" },
  { scene: "invitation", href: "#invitation", label: "The invitation" },
  { scene: "rsvp", href: "#rsvp", label: "Join the magic" },
];

/** Which dot to light for a scene that has no dot of its own. */
const STANDS_FOR: Partial<Record<SceneId, SceneId>> = {
  "fairy-garden": "month-journey",
  "month-12": "month-journey",
  gifts: "invitation",
  blessing: "rsvp",
  finale: "rsvp",
};

export function Nav() {
  const active = useActiveScene();
  const lit = STANDS_FOR[active] ?? active;

  /*
   * Where the pointer went down, so a swipe can be told from a tap.
   *
   * The rail is fixed to the middle of the right edge, which on a phone is exactly where
   * a right thumb scrolls. A finger dragged up the screen that happens to pass over a dot
   * ends its gesture there, the browser calls that a click on a link to another chapter,
   * and the page glides away to it — which is what a guest experiences as the scroll
   * jumping ahead of them. The rail is inert to touch now (see Nav.css), and this is the
   * same guard for a mouse or a stylus: a press that moved, or during which the page
   * scrolled, was a scroll and not a choice.
   */
  const pressed = useRef<{ x: number; y: number; scroll: number } | null>(null);

  return (
    <nav className="nav" aria-label="Jump to a part of the invitation">
      <ul>
        {STOPS.map((stop) => (
          <li key={stop.scene}>
            <a
              href={stop.href}
              className={`nav__dot${lit === stop.scene ? " is-here" : ""}`}
              aria-current={lit === stop.scene ? "true" : undefined}
              onPointerDown={(event) => {
                pressed.current = {
                  x: event.clientX,
                  y: event.clientY,
                  scroll: window.scrollY,
                };
              }}
              onClick={(event) => {
                const start = pressed.current;
                pressed.current = null;
                /*
                 * A keyboard activation is always meant. It reports a click count of
                 * zero and no coordinates, which is the only reliable way to tell it
                 * from a pointer — checking for a missing press instead would let a
                 * press left over from an earlier gesture veto it.
                 */
                if (event.detail === 0) return;
                if (!start) return;
                const travelled = Math.hypot(event.clientX - start.x, event.clientY - start.y);
                if (travelled > TAP_SLOP || Math.abs(window.scrollY - start.scroll) > 4) {
                  event.preventDefault();
                }
              }}
            >
              <span className="nav__mark" aria-hidden="true" />
              <span className="nav__label">{stop.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Kept beside the nav so the scene list and the stop list cannot drift apart. */
export const NAV_SCENES = SCENES;
