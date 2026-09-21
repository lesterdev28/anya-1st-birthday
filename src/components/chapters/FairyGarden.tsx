/**
 * Chapter two: the meadow the guest lands in after stepping out of the clouds.
 *
 * This is the calm after the entrance. The sky has warmed, the ground has arrived, and
 * the three lines of the story are told one at a time as the guest scrolls down through
 * them — which is the point of putting them here rather than in the hero: they are the
 * premise of the year that follows, and they need their own quiet screen.
 */
import { Chapter } from "../../lib/scene";
import { CloudLayer } from "../world/Clouds";
import { Drifters } from "../world/Drifters";
import { Butterflies } from "../world/Butterflies";
import { Meadow } from "../world/Meadow";
import { Reveal, RevealWords } from "../world/Reveal";
import { story } from "../../data/party";
import "./FairyGarden.css";

export function FairyGarden() {
  return (
    <Chapter scene="fairy-garden" id="garden" className="garden" label="Anya's fairy garden">
      <CloudLayer depth="far" count={3} seed={6} className="garden__clouds" />
      <Drifters kind="pollen" count={22} className="garden__pollen" />
      <Butterflies count={3} seed={14} className="garden__butterflies" />

      <div className="garden__copy">
        {story.meadow.map((line, index) => (
          <RevealWords key={line} text={line} className="garden__line" delay={index * 0.1} />
        ))}

        <Reveal as="p" className="garden__lead" delay={0.25} amount={0.6}>
          {story.journeyLead}
        </Reveal>

        <Reveal className="garden__scroll-hint" delay={0.45} amount={0.6}>
          <span className="garden__hint-word">Scroll</span>
          <span className="garden__hint-trail" aria-hidden="true" />
        </Reveal>
      </div>

      <Meadow className="garden__meadow" seed={3} />
    </Chapter>
  );
}
