/**
 * Twelve months of Anya, one chapter at a time.
 *
 * The photographs are the point; the generated artwork is decoration behind them and
 * deliberately grows richer as the year goes on, ending at the castle. A chapter with
 * no photo yet is not hidden — it keeps its place in the year and shows its month, so
 * the journey reads as twelve months rather than however many photos exist today.
 */
import { motion } from "framer-motion";
import { FairyImage } from "./FairyImage";
import { ParticleField } from "./ParticleField";
import { monthChapters, type MonthChapter } from "../data/party";
import "./PhotoJourney.css";

export function PhotoJourney() {
  return (
    <section className="section journey" id="journey" aria-labelledby="journey-title">
      <div className="section__inner">
        <p className="eyebrow">Twelve months of magic</p>
        <h2 className="section-title" id="journey-title">
          Anya&rsquo;s first year
        </h2>
        <span className="rule">
          <span />
        </span>
      </div>

      <ol className="journey__list">
        {monthChapters.map((chapter, index) => (
          <Chapter key={chapter.month} chapter={chapter} index={index} />
        ))}
      </ol>

      <p className="journey__finale">One year of magic</p>
    </section>
  );
}

function Chapter({ chapter, index }: { readonly chapter: MonthChapter; readonly index: number }) {
  // Alternating sides give the column some rhythm on wide screens.
  const side = index % 2 === 0 ? "start" : "end";

  return (
    <motion.li
      className={`journey__chapter journey__chapter--${side}`}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <div className="journey__frame">
        {/* Decoration sits behind the photo and never competes with it. */}
        <FairyImage
          id={chapter.background}
          alt=""
          sizes="(min-width: 700px) 420px, 88vw"
          className="journey__decoration"
        />

        {chapter.photo ? (
          <FairyImage
            id={chapter.photo}
            alt={`Anya at ${chapter.title.toLowerCase()}`}
            sizes="(min-width: 700px) 380px, 78vw"
            className="journey__photo"
          />
        ) : (
          <div className="journey__placeholder">
            <span className="journey__placeholder-number">{chapter.month}</span>
            <ParticleField kind="stars" count={8} className="journey__placeholder-stars" />
          </div>
        )}
      </div>

      <div className="journey__caption">
        <h3 className="journey__month">{chapter.title}</h3>
        <p className="journey__line">{chapter.caption}</p>
      </div>
    </motion.li>
  );
}
