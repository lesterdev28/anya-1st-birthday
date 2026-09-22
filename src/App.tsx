import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { IntroSequence, hasSeenIntro } from "./components/IntroSequence";
import { Hero } from "./components/Hero";
import { StorybookOpening } from "./components/StorybookOpening";
import { Details } from "./components/Details";
import { MonthsOfMagic } from "./components/MonthsOfMagic";
import { Rsvp } from "./components/Rsvp";
import { child, party } from "./data/party";
import "./App.css";

export function App() {
  // A guest who already watched the opening this visit goes straight to the invitation.
  const [introPlaying, setIntroPlaying] = useState(() => !hasSeenIntro());

  // The page behind the intro must not scroll while it plays. The CSS keys off this
  // attribute rather than the component setting overflow directly.
  useEffect(() => {
    document.body.dataset.introOpen = introPlaying ? "true" : "false";
    return () => {
      delete document.body.dataset.introOpen;
    };
  }, [introPlaying]);

  return (
    <>
      <AnimatePresence>
        {introPlaying && <IntroSequence key="intro" onFinish={() => setIntroPlaying(false)} />}
      </AnimatePresence>

      <main>
        <Hero />
        <StorybookOpening />
        <Details />
        <MonthsOfMagic />
        <Rsvp />
      </main>

      <footer className="footer">
        <p className="footer__line">
          {child.name} &middot; {party.dateLabel}
        </p>
        <p className="footer__small">With love, from her family.</p>
      </footer>
    </>
  );
}
