/**
 * Anya's Enchanted First Year, assembled.
 *
 * One continuous journey rather than a set of sections: `SceneProvider` tracks which
 * chapter owns the screen, `Sky` paints the air behind all of them, and each chapter
 * contributes only its own foreground. Nothing here has a background of its own, which
 * is what lets the guest travel from a dawn sky, down into a meadow, through a year and
 * out into a sunset without ever crossing a visible seam.
 */
import { useCallback } from "react";
import { SceneProvider } from "./lib/scene";
import { Sky } from "./components/world/Sky";
import { Loader } from "./components/Loader";
import { Nav } from "./components/Nav";
import { Music } from "./components/Music";
import { CloudKingdom } from "./components/chapters/CloudKingdom";
import { FairyGarden } from "./components/chapters/FairyGarden";
import { MonthJourney } from "./components/chapters/MonthJourney";
import { YearClimax } from "./components/chapters/YearClimax";
import { Invitation } from "./components/chapters/Invitation";
import { Rsvp } from "./components/chapters/Rsvp";
import { Finale } from "./components/chapters/Finale";
import { child, story } from "./data/party";

export function App() {
  /**
   * The one interaction the brief hangs the entrance on. Scrolling to the meadow rather
   * than jumping keeps the cloud gate parting visible, which is the point of having it.
   *
   * It is also, for most guests, the first gesture on the page, so it is what lets a
   * browser that held the music back release it. `Music` watches for any gesture rather
   * than for this one, so the hero does not have to know that sound exists.
   */
  const enterGarden = useCallback(() => {
    document.getElementById("garden")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <SceneProvider>
      <Loader />
      <Sky />

      <main>
        <CloudKingdom onEnter={enterGarden} />
        <FairyGarden />
        <MonthJourney />
        <YearClimax />
        <Invitation />
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
