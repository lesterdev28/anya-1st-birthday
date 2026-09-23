/**
 * The dedication: a verse, and her parents' prayer for her.
 *
 * Lester wrote every word of this one, and none of it is mine to rephrase. It is also the
 * only place on the site that speaks to Anya rather than to a guest — "as you grow, you
 * will know Christ" — which is why it sits here, after the party has been arranged and
 * just before her face. A blessing closes things.
 *
 * Almost nothing moves. Every other chapter earns attention with weather and wings; this
 * one earns it by having none, so the words are the only thing on the screen.
 */
import { Chapter } from "../../lib/scene";
import { CloudLayer } from "../world/Clouds";
import { Drifters } from "../world/Drifters";
import { Painted } from "../world/Painted";
import { Reveal } from "../world/Reveal";
import { story } from "../../data/party";
import "./Blessing.css";

export function Blessing() {
  return (
    <Chapter scene="blessing" id="blessing" className="blessing" label="A prayer for Anya">
      <CloudLayer depth="far" count={3} seed={67} className="blessing__clouds" />
      <Drifters kind="dust" count={12} className="blessing__air" />

      <div className="blessing__inner">
        <Reveal className="blessing__rule" amount={0.4}>
          <span />
        </Reveal>

        <Reveal as="blockquote" className="blessing__verse" delay={0.1} amount={0.35}>
          <p>&ldquo;{story.blessingVerse}&rdquo;</p>
          <cite className="blessing__cite">{story.blessingCitation}</cite>
        </Reveal>

        <Reveal as="p" className="blessing__prayer" delay={0.24} amount={0.3}>
          {story.blessingPrayer}
        </Reveal>
      </div>

      {/* One bloom, low and to the side, so the page is quiet without being bare. */}
      <Painted id="magnolia-spray" className="blessing__bloom" />
    </Chapter>
  );
}
