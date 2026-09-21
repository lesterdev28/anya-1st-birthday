/**
 * The machinery that makes the invitation one continuous world rather than a stack of
 * sections.
 *
 * Two pieces of shared state, and nothing else:
 *
 * `SceneProvider` tracks which chapter currently owns the middle of the screen and
 * writes it to `document.body[data-scene]`. The sky, the clouds and the audio all read
 * that one value, so the air changes colour and the music changes layer at the same
 * moment, without any of them knowing about each other.
 *
 * `Chapter` measures its own scroll progress — 0 as it enters the viewport, 1 as it
 * leaves — and hands it down. `Parallax` children consume it. Progress is deliberately
 * per-chapter rather than page-wide: a single page-long scroll value multiplied by a
 * depth factor sends far layers thousands of pixels off screen by the finale, whereas a
 * chapter's own 0-to-1 keeps every layer inside its frame no matter how long the page
 * grows.
 */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

/** The chapters of the journey, in scroll order. Also the audio engine's scene ids. */
export const SCENES = [
  "intro",
  "fairy-garden",
  "month-journey",
  "month-12",
  "invitation",
  "rsvp",
  "finale",
] as const;

export type SceneId = (typeof SCENES)[number];

const ActiveSceneContext = createContext<SceneId>("intro");

/** Which chapter currently owns the screen. */
export function useActiveScene(): SceneId {
  return useContext(ActiveSceneContext);
}

interface SceneRegistration {
  readonly register: (element: Element, scene: SceneId) => () => void;
}

const RegistryContext = createContext<SceneRegistration | null>(null);

export function SceneProvider({ children }: { readonly children: ReactNode }) {
  const [active, setActive] = useState<SceneId>("intro");
  // Element -> scene, so the observer can answer "what is in the middle of the screen".
  const entries = useRef(new Map<Element, SceneId>());
  const visible = useRef(new Map<Element, number>());

  const observer = useRef<IntersectionObserver | null>(null);

  const registry = useMemo<SceneRegistration>(
    () => ({
      register(element, scene) {
        entries.current.set(element, scene);
        observer.current?.observe(element);
        return () => {
          observer.current?.unobserve(element);
          entries.current.delete(element);
          visible.current.delete(element);
        };
      },
    }),
    [],
  );

  useEffect(() => {
    // A band across the middle of the viewport. Whichever chapter fills more of that
    // band is the one the guest is looking at; the edges of the screen do not vote.
    const io = new IntersectionObserver(
      (records) => {
        records.forEach((record) => visible.current.set(record.target, record.intersectionRatio));

        let best: SceneId | null = null;
        let bestRatio = 0;
        visible.current.forEach((ratio, element) => {
          const scene = entries.current.get(element);
          if (scene && ratio > bestRatio) {
            best = scene;
            bestRatio = ratio;
          }
        });
        if (best) setActive(best);
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    observer.current = io;
    entries.current.forEach((_scene, element) => io.observe(element));

    return () => {
      io.disconnect();
      observer.current = null;
    };
  }, []);

  // One attribute on <body> so plain CSS can react to the scene without prop drilling.
  useEffect(() => {
    document.body.dataset.scene = active;
    return () => {
      delete document.body.dataset.scene;
    };
  }, [active]);

  return (
    <RegistryContext.Provider value={registry}>
      <ActiveSceneContext.Provider value={active}>{children}</ActiveSceneContext.Provider>
    </RegistryContext.Provider>
  );
}

/** 0 as this chapter enters the viewport, 1 as it leaves. */
const ProgressContext = createContext<MotionValue<number> | null>(null);

export function useChapterProgress(): MotionValue<number> | null {
  return useContext(ProgressContext);
}

/**
 * The chapter's progress, or a value frozen at zero outside one.
 *
 * Hooks cannot be called conditionally, and `useTransform` needs a real MotionValue to
 * subscribe to, so a component that animates on scroll would otherwise have to choose
 * between breaking the rules of hooks and breaking outside a Chapter. This gives it
 * something valid to bind to either way; the caller decides whether to apply the result.
 */
export function useChapterScroll(): { progress: MotionValue<number>; inChapter: boolean } {
  const provided = useContext(ProgressContext);
  const standin = useMotionValue(0);
  return { progress: provided ?? standin, inChapter: provided !== null };
}

interface ChapterProps {
  readonly scene: SceneId;
  readonly id?: string;
  readonly className?: string;
  readonly children: ReactNode;
  /** Announced to screen readers; chapters without one are decorative. */
  readonly label?: string;
}

export function Chapter({ scene, id, className, children, label }: ChapterProps) {
  const ref = useRef<HTMLElement>(null);
  const registry = useContext(RegistryContext);

  useEffect(() => {
    const element = ref.current;
    if (!element || !registry) return;
    return registry.register(element, scene);
  }, [registry, scene]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <ProgressContext.Provider value={scrollYProgress}>
      <section
        ref={ref}
        id={id}
        className={`chapter${className ? ` ${className}` : ""}`}
        aria-label={label}
      >
        {children}
      </section>
    </ProgressContext.Provider>
  );
}

interface ParallaxProps {
  /**
   * How fast this layer travels against the page, from the brief's own scale:
   * 0.15 for the far distance, 0.35 for the middle, 0.65 for the foreground.
   * Larger numbers move further, which reads as nearer.
   */
  readonly depth: number;
  /** Pixels of travel at depth 1. The layer moves `depth * distance` in total. */
  readonly distance?: number;
  readonly className?: string;
  readonly children: ReactNode;
  readonly style?: React.CSSProperties;
}

/**
 * One plane of the scene. Travels vertically against the page as its chapter scrolls
 * past, and does nothing at all under reduced motion.
 */
export function Parallax({ depth, distance = 260, className, children, style }: ParallaxProps) {
  const { progress, inChapter } = useChapterScroll();
  const reduceMotion = useReducedMotion();
  const travel = depth * distance;
  const y = useTransform(progress, [0, 1], [travel / 2, -travel / 2]);

  return (
    <motion.div
      className={className}
      style={reduceMotion || !inChapter ? style : { ...style, y }}
      aria-hidden="true"
    >
      {children}
    </motion.div>
  );
}
