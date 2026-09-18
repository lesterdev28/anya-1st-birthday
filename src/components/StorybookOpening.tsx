/**
 * The storybook that opens into the kingdom.
 *
 * The book-opening itself is a web animation, as the brief specifies — a CSS 3D cover
 * swinging back on its spine. The artwork on the cover and the parchment inside are
 * Higgsfield assets (`storybook-cover`, `storybook-pages`); until those exist, the
 * painted cover below stands in so the interaction still works.
 *
 * It opens on scroll rather than on a click, so a guest scrolling the invitation never
 * hits a dead end waiting for something to press — but the cover is also a button, for
 * anyone who reaches for it.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FairyImage } from "./FairyImage";
import { GoldCrown } from "./GoldCrown";
import { ParticleField } from "./ParticleField";
import "./StorybookOpening.css";

export function StorybookOpening() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.55 });
  const [open, setOpen] = useState(false);

  // A short pause after it scrolls into view, so the opening reads as deliberate
  // rather than as something that happened while the guest was still scrolling.
  useEffect(() => {
    if (!inView || open) return;
    const timer = window.setTimeout(() => setOpen(true), 650);
    return () => window.clearTimeout(timer);
  }, [inView, open]);

  return (
    <section className="storybook section" ref={containerRef} aria-label="The storybook opens">
      <ParticleField kind="sparkles" count={26} className="storybook__sparkles" />

      <div className="storybook__stage">
        <div className={`storybook__book${open ? " is-open" : ""}`}>
          {/* The parchment spread revealed underneath the cover. */}
          <div className="storybook__pages">
            <FairyImage
              id="storybook-pages"
              alt=""
              sizes="(max-width: 700px) 92vw, 640px"
              fallback={<div className="storybook__pages-painted" aria-hidden="true" />}
            />
            <motion.div
              className="storybook__pages-content"
              initial={false}
              animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.9, delay: open ? 0.7 : 0, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <p className="storybook__once">Once upon a time&hellip;</p>
              <p className="storybook__body">
                in a kingdom of soft clouds and golden light, a little girl arrived and turned an
                ordinary year into a story worth telling.
              </p>
              <p className="storybook__body storybook__body--last">
                And her first chapter ends with a party.
              </p>
            </motion.div>
          </div>

          {/* The cover, hinged on its left edge. */}
          <button
            type="button"
            className="storybook__cover"
            onClick={() => setOpen(true)}
            aria-expanded={open}
          >
            <span className="visually-hidden">Open the storybook</span>
            <FairyImage
              id="storybook-cover"
              alt=""
              sizes="(max-width: 700px) 92vw, 640px"
              fallback={
                <span className="storybook__cover-painted" aria-hidden="true">
                  <span className="storybook__cover-border">
                    <span className="storybook__cover-crown">
                      <GoldCrown />
                    </span>
                  </span>
                </span>
              }
            />
          </button>
        </div>
      </div>
    </section>
  );
}
