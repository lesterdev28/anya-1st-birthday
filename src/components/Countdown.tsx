/**
 * Counts down to the party.
 *
 * Ticks once a second, but only while the tab is visible — a backgrounded phone should
 * not be re-rendering this. Once the day arrives it says so instead of showing zeros,
 * and after the party it quietly says the day has passed rather than counting up.
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Countdown.css";

interface Props {
  readonly target: Date;
}

interface Remaining {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly past: boolean;
}

function remainingUntil(target: Date): Remaining {
  const milliseconds = target.getTime() - Date.now();
  if (milliseconds <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true };
  }
  const totalSeconds = Math.floor(milliseconds / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    past: false,
  };
}

export function Countdown({ target }: Props) {
  const [remaining, setRemaining] = useState(() => remainingUntil(target));

  useEffect(() => {
    let timer: number | undefined;

    function tick() {
      setRemaining(remainingUntil(target));
    }

    function start() {
      tick();
      timer = window.setInterval(tick, 1000);
    }

    function stop() {
      if (timer !== undefined) window.clearInterval(timer);
      timer = undefined;
    }

    function onVisibilityChange() {
      stop();
      if (!document.hidden) start();
    }

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [target]);

  if (remaining.past) {
    return <p className="countdown__past">The day has come. Thank you for celebrating with us.</p>;
  }

  const units = [
    { label: remaining.days === 1 ? "day" : "days", value: remaining.days },
    { label: remaining.hours === 1 ? "hour" : "hours", value: remaining.hours },
    { label: remaining.minutes === 1 ? "minute" : "minutes", value: remaining.minutes },
    { label: remaining.seconds === 1 ? "second" : "seconds", value: remaining.seconds },
  ];

  return (
    <motion.div
      className="countdown"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <p className="countdown__label">Until the magic begins</p>
      <div className="countdown__units">
        {units.map((unit) => (
          <div className="countdown__unit" key={unit.label}>
            <span className="countdown__value">{String(unit.value).padStart(2, "0")}</span>
            <span className="countdown__unit-label">{unit.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
