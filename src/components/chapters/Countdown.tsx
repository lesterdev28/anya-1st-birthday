/**
 * How long until the magic begins.
 *
 * The brief asks specifically for this not to look like a countdown widget, so the four
 * numbers are not in boxes: each one floats in its own soft cloud, bobbing on its own
 * cycle, with the label beneath it in small caps. The seconds tick, which is the only
 * thing on the page that moves without being scrolled — that is deliberate, because it
 * is the one part of the invitation that is actually happening right now.
 */
import { useEffect, useState } from "react";
import { Reveal } from "../world/Reveal";
import { party, story } from "../../data/party";
import "./Countdown.css";

interface Remaining {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  /** True once the party has started, so the copy can change rather than go negative. */
  readonly started: boolean;
  /** True on the day itself, before it begins. */
  readonly today: boolean;
}

function remainingFrom(target: Date, now: number): Remaining {
  const delta = target.getTime() - now;
  if (delta <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true, today: false };
  }

  const seconds = Math.floor(delta / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    started: false,
    today: seconds < 86400,
  };
}

function useCountdown(target: Date): Remaining {
  const [remaining, setRemaining] = useState(() => remainingFrom(target, Date.now()));

  useEffect(() => {
    const tick = () => setRemaining(remainingFrom(target, Date.now()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  return remaining;
}

export function Countdown() {
  const remaining = useCountdown(party.startsAt);

  const heading = remaining.started
    ? story.countdownPast
    : remaining.today
      ? story.countdownToday
      : story.countdownHeading;

  const units = [
    { key: "days", value: remaining.days, label: remaining.days === 1 ? "day" : "days" },
    { key: "hours", value: remaining.hours, label: "hours" },
    { key: "minutes", value: remaining.minutes, label: "minutes" },
    { key: "seconds", value: remaining.seconds, label: "seconds" },
  ];

  return (
    <Reveal className="countdown" amount={0.3}>
      <p className="script countdown__heading">{heading}</p>

      {!remaining.started && (
        <ul className="countdown__units">
          {units.map((unit, index) => (
            <li
              key={unit.key}
              className={`countdown__unit countdown__unit--${unit.key}`}
              style={{ "--i": index } as React.CSSProperties}
            >
              <span className="countdown__cloud" aria-hidden="true" />
              <span className="countdown__value">{String(unit.value).padStart(2, "0")}</span>
              <span className="countdown__label">{unit.label}</span>
            </li>
          ))}
        </ul>
      )}
    </Reveal>
  );
}
