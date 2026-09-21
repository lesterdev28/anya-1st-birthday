/**
 * The air the whole invitation is suspended in.
 *
 * One fixed element behind every chapter, rather than a background per section. That is
 * what makes the journey feel continuous: nothing ever "ends" and starts again, the
 * colour of the sky simply changes as the guest travels through it.
 *
 * The change is driven by `body[data-scene]` and CSS transitions on registered colour
 * custom properties, not by JavaScript recalculating a gradient every frame. The browser
 * interpolates the colours on the compositor and the cost is nil.
 */
import { CloudBand } from "./Clouds";
import { Drifters } from "./Drifters";
import "./Sky.css";

export function Sky() {
  return (
    <div className="sky" aria-hidden="true">
      <div className="sky__wash" />

      {/* Stars belong to the night end of the journey; they fade with the scene. */}
      <Drifters kind="stars" count={38} className="sky__stars" />

      {/*
        The far cloud bands live here rather than in any chapter, so they carry across
        the boundaries between chapters and hold the world together. They drift sideways
        only — scroll parallax is each chapter's own job.
      */}
      <CloudBand depth="far" count={5} className="sky__clouds sky__clouds--far" />
      <CloudBand depth="mid" count={4} className="sky__clouds sky__clouds--mid" />

      {/* A gentle vignette; keeps the middle of the screen the brightest thing. */}
      <div className="sky__vignette" />
    </div>
  );
}
