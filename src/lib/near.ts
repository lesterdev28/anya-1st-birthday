import { useEffect, useRef, useState } from "react";

/**
 * Is this element anywhere near the screen?
 *
 * Every decorative system on this page — the drifting particles, the clouds, the grass,
 * the fairies — runs on an infinite CSS animation, and a page this long holds a few
 * hundred of them while showing at most two chapters' worth. An animation that nobody
 * can see still costs a style recalculation on every frame, and on a phone that shows up
 * as a scroll that stutters and then catches up in a jump.
 *
 * So each group watches itself and only runs while it is close. The margin is generous
 * on purpose: a chapter's scenery has to already be moving by the time it arrives, or
 * the guest sees it start.
 *
 * Pausing preserves an animation's own clock, so a cloud two thirds of the way across
 * the sky resumes two thirds of the way across rather than jumping back to the edge.
 */
export function useNearViewport<T extends Element>(margin = "50%"): {
  readonly ref: React.RefObject<T>;
  readonly near: boolean;
} {
  // `useRef<T>(null)` is the ref a JSX `ref=` prop wants; the cast is only to say so.
  const ref = useRef<T | null>(null) as React.RefObject<T>;
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const watcher = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      rootMargin: `${margin} 0px ${margin} 0px`,
    });
    watcher.observe(element);
    return () => watcher.disconnect();
  }, [margin]);

  return { ref, near };
}
