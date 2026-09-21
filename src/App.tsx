/**
 * The invitation, assembled.
 *
 * The intro plays once per browser session and then lifts away. A guest who has
 * already seen it — coming back to check the date, which is the common case — lands
 * straight on the invitation rather than sitting through the cinematic again.
 */
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { IntroSequence, hasSeenIntro } from "./components/IntroSequence";
import { Hero } from "./components/Hero";
import { Countdown } from "./components/Countdown";
import { PhotoJourney } from "./components/PhotoJourney";
import { PartyDetails } from "./components/PartyDetails";
import { Rsvp } from "./components/Rsvp";
import { SoundToggle } from "./components/SoundToggle";
import { child, introLines } from "./data/party";

export function App() {
  // Decided once on mount: reading sessionStorage during render would be a side effect.
  const [introOpen, setIntroOpen] = useState(() => !hasSeenIntro());

  const closeIntro = useCallback(() => setIntroOpen(false), []);

  // The page underneath must not scroll while the overlay is up.
  useEffect(() => {
    document.body.dataset.introOpen = String(introOpen);
    return () => {
      delete document.body.dataset.introOpen;
    };
  }, [introOpen]);

  return (
    <>
      {/* Outside the intro so the music carries across it and into the invitation. */}
      <SoundToggle />

      <AnimatePresence>{introOpen && <IntroSequence onFinish={closeIntro} />}</AnimatePresence>

      {/*
        The story beats are spoken by the intro, which is decorative and skippable.
        Repeating them here means the invitation still reads as a story for anyone
        using a screen reader or arriving with the intro already dismissed.
      */}
      <section className="visually-hidden" id="story" aria-label="Once upon a time">
        {introLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <p>{child.name} is turning {child.turning}.</p>
      </section>

      <main>
        <Hero />
        <Countdown />
        <PhotoJourney />
        <PartyDetails />
        <Rsvp />
      </main>
    </>
  );
}
