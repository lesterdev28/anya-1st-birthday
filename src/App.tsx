/**
 * Anya's Enchanted First Year, assembled.
 *
 * One continuous journey rather than a set of sections: `SceneProvider` tracks which
 * chapter owns the screen, `Sky` paints the air behind all of them, and each chapter
 * contributes only its own foreground. Nothing here has a background of its own, which
 * is what lets the guest travel from a dawn sky, down into a meadow, through a year and
 * out into a sunset without ever crossing a visible seam.
 */
import { useCallback, useEffect } from "react";
import { SceneProvider } from "./lib/scene";
import { Sky } from "./components/world/Sky";
import { Loader } from "./components/Loader";
import { CloudOpening } from "./components/CloudOpening";
import { Nav } from "./components/Nav";
import { Music } from "./components/Music";
import { CloudKingdom } from "./components/chapters/CloudKingdom";
import { FairyGarden } from "./components/chapters/FairyGarden";
import { MonthJourney } from "./components/chapters/MonthJourney";
import { YearClimax } from "./components/chapters/YearClimax";
import { Invitation } from "./components/chapters/Invitation";
import { Gifts } from "./components/chapters/Gifts";
import { Rsvp } from "./components/chapters/Rsvp";
import { Finale } from "./components/chapters/Finale";
import { child, story } from "./data/party";

export function App() {
  /*
   * A reload must not drop the guest back where they left off: the page is locked at the
   * hero until they enter, and restoring them to the middle of the journey would lock
   * them there instead.
   */
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  /**
   * The one interaction the brief hangs the entrance on, and now the only way in: the
   * page is held still until this is pressed (see `data-gate` in global.css). Scrolling
   * to the meadow rather than jumping keeps the cloud gate parting visible, which is the
   * point of having it.
   *
   * It is also, for most guests, the first gesture on the page, so it is what lets a
   * browser that held the music back release it. `Music` watches for any gesture rather
   * than for this one, so the hero does not have to know that sound exists.
   */
  const enterGarden = useCallback(() => {
    /*
     * Straight onto the element rather than through React state. The lock has to be off
     * before the scroll is asked for — a smooth scroll requested while the root still
     * has `overflow: hidden` has nowhere to go and is simply dropped — and a state
     * change would not reach the DOM until after this handler has returned.
     */
    document.documentElement.dataset.gate = "open";
    requestAnimationFrame(() => {
      document.getElementById("garden")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <SceneProvider>
      <Loader />
      <CloudOpening />
      <Sky />

      <main>
        <CloudKingdom onEnter={enterGarden} />
        <FairyGarden />
        <MonthJourney />
        <YearClimax />
        <Invitation />
        <Gifts />
        <Rsvp />
        <Finale />
      </main>

      <Nav />
      <Music />

      {/*
        The story in plain words, for a screen reader or anyone who never sees the
        animation. The journey is told through movement; this makes sure it is also
        told in text.
      */}
      <section className="visually-hidden" aria-label="Anya's story">
        <p>{story.once}</p>
        {story.meadow.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <p>
          {child.name} is turning {child.turning}.
        </p>
      </section>
    </SceneProvider>
  );
}
