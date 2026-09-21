/**
 * Chapters three to thirteen: the year, one month at a time.
 *
 * Each month is its own `Chapter`, which is what makes the journey scroll-driven rather
 * than scroll-triggered — every month owns a screen, knows how far through itself the
 * guest is, and moves its own layers accordingly. The photograph arrives from
 * alternating sides so the page never settles into a column, and the month's numeral
 * drifts behind it at a different speed, which is the depth the brief asks for.
 *
 * Month twelve is not here. It has no photograph and is written as the climax of the
 * story instead, in its own chapter.
 */
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { Chapter, Parallax, useChapterScroll } from "../../lib/scene";
import { CloudLayer } from "../world/Clouds";
import { Drifters } from "../world/Drifters";
import { Butterflies } from "../world/Butterflies";
import { Reveal } from "../world/Reveal";
import { MonthFrame } from "./MonthFrame";
import { monthChapters, story, type MonthChapter } from "../../data/party";
import "./MonthJourney.css";

export function MonthJourney() {
  const months = monthChapters.filter((chapter) => chapter.month < 12);

  return (
    <>
      <div className="journey__opening">
        <Reveal as="h2" className="journey__heading">
          {story.journeyLead}
        </Reveal>
        <div className="rule" aria-hidden="true">
          <span />
        </div>
      </div>

      {months.map((chapter) => (
        <MonthScene key={chapter.month} chapter={chapter} />
      ))}
    </>
  );
}

function MonthScene({ chapter }: { readonly chapter: MonthChapter }) {
  return (
    <Chapter
      scene="month-journey"
      className={`month month--${chapter.from} month--${chapter.frame}`}
      label={`${chapter.title}: ${chapter.caption}`}
    >
      <MonthContents chapter={chapter} />
    </Chapter>
  );
}

function MonthContents({ chapter }: { readonly chapter: MonthChapter }) {
  const { progress, inChapter } = useChapterScroll();
  const reduceMotion = useReducedMotion();
  const still = reduceMotion || !inChapter;

  /*
   * The frame rises and tips back to level as the guest scrolls it into the middle of
   * the screen, then drifts on past. Reading the whole chapter range rather than an
   * in-view trigger is what makes it feel attached to the scroll rather than played at
   * the guest.
   */
  const lift = useTransform(progress, [0, 0.5, 1], ["7%", "0%", "-9%"]);
  const tilt = useTransform(
    progress,
    [0, 0.5, 1],
    chapter.from === "left" ? [-4.5, 0, 3] : [4.5, 0, -3],
  );
  const slide = useTransform(
    progress,
    [0, 0.5],
    chapter.from === "left" ? ["-14%", "0%"] : ["14%", "0%"],
  );

  /* A firefly month and a petal month should not look alike, so the air changes too. */
  const drifter = chapter.month % 3 === 0 ? "petals" : chapter.month % 3 === 1 ? "dust" : "pollen";

  return (
    <>
      <CloudLayer
        depth="far"
        count={3}
        seed={chapter.month * 3}
        className="month__clouds month__clouds--far"
      />
      <CloudLayer
        depth="mid"
        count={2}
        seed={chapter.month * 7}
        className="month__clouds month__clouds--near"
      />
      <Drifters kind={drifter} count={14} className="month__air" />
      {chapter.month % 4 === 2 && (
        <Butterflies count={1} seed={chapter.month * 11} className="month__butterflies" />
      )}

      {/* The numeral, large and pale, travelling slower than everything in front of it. */}
      <Parallax depth={0.15} distance={420} className="month__numeral-layer">
        <span className="month__numeral">{String(chapter.month).padStart(2, "0")}</span>
      </Parallax>

      <div className="month__inner">
        <motion.div
          className="month__frame-holder"
          style={still ? undefined : { y: lift, rotate: tilt, x: slide }}
        >
          <MonthFrame
            frame={chapter.frame}
            photo={chapter.photo}
            month={chapter.month}
            alt={`Anya at ${chapter.title.toLowerCase()}`}
          />
        </motion.div>

        <div className="month__words">
          <Reveal as="h3" className="month__title" y={18}>
            {chapter.title}
          </Reveal>
          <Reveal as="p" className="month__caption" delay={0.15} y={14}>
            {chapter.caption}
          </Reveal>
        </div>
      </div>
    </>
  );
}
