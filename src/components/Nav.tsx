/**
 * The way back, and the way forward.
 *
 * Deliberately almost invisible: a short rail of dots down one side, one per part of the
 * journey, lit for the part the guest is in. An invitation with a navigation bar across
 * the top stops being an invitation, but a guest who has scrolled through the whole year
 * and wants to get back to the RSVP should not have to scroll back through it.
 */
import { SCENES, useActiveScene, type SceneId } from "../lib/scene";
import "./Nav.css";

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

  return (
    <nav className="nav" aria-label="Jump to a part of the invitation">
      <ul>
        {STOPS.map((stop) => (
          <li key={stop.scene}>
            <a
              href={stop.href}
              className={`nav__dot${lit === stop.scene ? " is-here" : ""}`}
              aria-current={lit === stop.scene ? "true" : undefined}
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
