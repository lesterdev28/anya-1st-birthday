/**
 * Twelve Months of Magic — the photo journey.
 *
 * Real photographs carry it; the generated art is only the decoration behind each
 * chapter, and it deliberately grows richer as the year goes on, ending at the castle
 * for "One Year of Magic".
 *
 * Chapters without a photograph yet are not hidden — they render as an empty gilded
 * frame, which reads as a page waiting for a picture rather than as something broken.
 */
import { motion } from "framer-motion";
import { FairyImage } from "./FairyImage";
import { ParticleField } from "./ParticleField";
import { GoldCrown } from "./GoldCrown";
import { monthChapters, type MonthChapter } from "../data/party";
import "./MonthsOfMagic.css";

export function MonthsOfMagic() {
  return (
    <section className="months section" id="journey" aria-label="Twelve months of magic">
      <ParticleField kind="fireflies" count={22} className="months__fireflies" />

      <div className="section__inner">
        <p className="eyebrow">The first chapter</p>
        <h2 className="section-title">Twelve Months of Magic</h2>
        <div className="rule" aria-hidden="true">
          <span />
        </div>
      </div>

      <ol className="months__list">
        {monthChapters.map((chapter, index) => (
          <Chapter key={chapter.month} chapter={chapter} index={index} />
        ))}
      </ol>

      <motion.div
        className="months__finale"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <GoldCrown className="months__finale-crown" />
        <p className="months__finale-text">One Year of Magic</p>
      </motion.div>
    </section>
  );
}

function Chapter({ chapter, index }: { readonly chapter: MonthChapter; readonly index: number }) {
  // Alternating sides give the journey a gentle rhythm as you scroll.
  const fromLeft = index % 2 === 0;

  /*
   * A month with no photograph yet is rendered as a slim centred verse rather than as an
   * empty picture frame. An empty frame reads as a broken image; a line of text between
   * two pictures reads as the story breathing. It also means dropping a photo in later
   * upgrades the chapter rather than fixing something that looked wrong.
   */
  if (!chapter.photo) {
    return (
      <motion.li
        className="months__chapter months__chapter--verse"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <p className="months__number">{String(chapter.month).padStart(2, "0")}</p>
        <h3 className="months__title months__title--verse">{chapter.title}</h3>
        <p className="months__text months__text--verse">{chapter.caption}</p>
        <span className="months__verse-mark" aria-hidden="true" />
      </motion.li>
    );
  }

  return (
    <motion.li
      className={`months__chapter${fromLeft ? "" : " months__chapter--right"}`}
      initial={{ opacity: 0, y: 34, x: fromLeft ? -18 : 18 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.85, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {/* The generated chapter decoration, behind the frame. */}
      <FairyImage
        id={chapter.background}
        alt=""
        className="months__backdrop"
        sizes="(max-width: 760px) 100vw, 760px"
        fallback={null}
      />

      <div className="months__frame">
        <FairyImage
          id={chapter.photo}
          alt={`Anya at ${chapter.month} month${chapter.month === 1 ? "" : "s"} old`}
          sizes="(max-width: 620px) 74vw, 320px"
        />
      </div>

      <div className="months__caption">
        <p className="months__number">{String(chapter.month).padStart(2, "0")}</p>
        <h3 className="months__title">{chapter.title}</h3>
        <p className="months__text">{chapter.caption}</p>
      </div>
    </motion.li>
  );
}
