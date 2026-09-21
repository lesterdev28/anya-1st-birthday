/**
 * Text and panels that arrive as the guest reaches them.
 *
 * Everything on this page is reached by scrolling, so nothing should be sitting there
 * already when it comes into view — the brief asks for the words to appear as part of
 * the journey rather than to be waiting at the bottom of it.
 *
 * `once: true` is deliberate. A line that re-animates every time it is scrolled back
 * past stops reading as a memory being remembered and starts reading as a widget.
 */
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import "./Reveal.css";

/** The handful of tags a revealed block is ever going to be. */
type RevealTag = "div" | "p" | "h2" | "h3" | "li" | "figure" | "span";

interface RevealProps {
  readonly children: ReactNode;
  readonly className?: string;
  /** Seconds before this one starts, so a group can arrive in sequence. */
  readonly delay?: number;
  /** Pixels travelled on the way in. Negative lifts from above. */
  readonly y?: number;
  readonly as?: RevealTag;
  /** How much of the element must be on screen before it begins. */
  readonly amount?: number;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  as = "div",
  amount = 0.4,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as];

  if (reduceMotion) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1.1, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}

/**
 * One line of story, revealed a word at a time.
 *
 * Used only on the few short lines that carry the story — "One little fairy." and its
 * two companions. A whole paragraph drifting in word by word is unreadable; three words
 * arriving one after another reads like someone telling you something.
 */
const wordGroup: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const oneWord: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  shown: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.22, 0.61, 0.36, 1] },
  },
};

interface WordsProps {
  readonly text: string;
  readonly className?: string;
  readonly delay?: number;
}

export function RevealWords({ text, className, delay = 0 }: WordsProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (reduceMotion) return <p className={className}>{text}</p>;

  return (
    <motion.p
      className={className}
      variants={wordGroup}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.6 }}
      transition={{ delayChildren: delay }}
    >
      {words.map((word, index) => (
        <motion.span key={`${word}-${index}`} variants={oneWord} className="reveal-word">
          {word}
          {index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.p>
  );
}
