/**
 * Counts down to the party.
 *
 * Ticks once a second, but only while the tab is visible — a countdown running in a
 * backgrounded tab is wasted battery on the phones most guests will use. It also
 * handles the two states past the deadline: the day itself, and afterwards.
 */
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ParticleField } from "./ParticleField";
import { party } from "../data/party";
import "./Countdown.css";

interface Remaining {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
}

type Phase = "before" | "during" | "after";

function phaseOf(now: number): Phase {
  if (now < party.startsAt.getTime()) return "before";
  if (now <= party.endsAt.getTime()) return "during";
  return "after";
}

function remainingFrom(now: number): Remaining {
  const ms = Math.max(0, party.startsAt.getTime() - now);
  const totalSeconds = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function Countdown() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let timer: number | undefined;

    function start() {
      stop();
      timer = window.setInterval(() => setNow(Date.now()), 1000);
    }
    function stop() {
      if (timer !== undefined) window.clearInterval(timer);
      timer = undefined;
    }

    function onVisibility() {
      if (document.hidden) {
        stop();
      } else {
        // Catch up immediately, then resume ticking.
        setNow(Date.now());
        start();
      }
    }

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const phase = phaseOf(now);
  const remaining = useMemo(() => remainingFrom(now), [now]);

  return (
    <section className="section countdown" aria-labelledby="countdown-title">
      <ParticleField kind="sparkles" count={14} className="countdown__sparkles" />

      <div className="section__inner">
        <p className="eyebrow">The magic begins in</p>
        <h2 className="section-title" id="countdown-title">
          {phase === "before" && "Counting the days"}
          {phase === "during" && "Today is the day"}
          {phase === "after" && "Thank you for celebrating"}
        </h2>
        <span className="rule">
          <span />
        </span>

        {phase === "before" && (
          <motion.ol
            className="countdown__grid"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <Unit value={remaining.days} label={remaining.days === 1 ? "day" : "days"} />
            <Unit value={remaining.hours} label={remaining.hours === 1 ? "hour" : "hours"} />
            <Unit value={remaining.minutes} label={remaining.minutes === 1 ? "minute" : "minutes"} />
            <Unit value={remaining.seconds} label={remaining.seconds === 1 ? "second" : "seconds"} />
          </motion.ol>
        )}

        {phase === "during" && (
          <p className="countdown__message">
            The kingdom is open. We are so glad you came.
          </p>
        )}

        {phase === "after" && (
          <p className="countdown__message">
            One year of magic, and a day we will not forget.
          </p>
        )}
      </div>
    </section>
  );
}

function Unit({ value, label }: { readonly value: number; readonly label: string }) {
  return (
    <li className="countdown__unit">
      {/* Padded for a stable width so the row does not jitter as the numbers tick. */}
      <span className="countdown__value">{String(value).padStart(2, "0")}</span>
      <span className="countdown__label">{label}</span>
    </li>
  );
}
