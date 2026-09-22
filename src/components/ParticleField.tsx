/**
 * The floating stars, sparkles and fireflies.
 *
 * The brief is explicit that these belong to the web layer rather than to generated
 * video, so they are plain DOM elements animated with CSS keyframes — cheap enough to
 * run over the whole page on a phone, and they stop entirely under reduced motion.
 *
 * Positions are generated once from a fixed seed so the layout is stable across renders
 * and identical between reloads (a random scatter that jumps on every re-render reads as
 * a glitch rather than as magic).
 */
import { useMemo } from "react";
import "./ParticleField.css";

type Kind = "stars" | "fireflies" | "sparkles";

interface Props {
  readonly kind: Kind;
  readonly count?: number;
  readonly className?: string;
}

/** A small deterministic PRNG, so the scatter is fixed but does not look regular. */
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const SEEDS: Record<Kind, number> = { stars: 20261010, fireflies: 77211, sparkles: 31459 };

export function ParticleField({ kind, count = 40, className }: Props) {
  const particles = useMemo(() => {
    const random = seeded(SEEDS[kind]);
    return Array.from({ length: count }, (_, index) => ({
      key: index,
      left: random() * 100,
      top: random() * 100,
      // Fireflies read better larger and softer; stars stay small and crisp.
      size: kind === "fireflies" ? 3 + random() * 5 : 1.5 + random() * 2.5,
      duration: 4 + random() * 9,
      delay: -random() * 12,
      drift: (random() - 0.5) * 40,
    }));
  }, [kind, count]);

  return (
    <div
      className={`particles particles--${kind}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <span
          key={particle.key}
          className="particles__dot"
          style={
            {
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              "--drift": `${particle.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
