/**
 * The last scene: the sky again, lower and warmer.
 *
 * The journey began looking up into a dawn and ends looking out over a sunset, which is
 * the whole shape of it in one line. Anya's portrait is here rather than in the hero —
 * the Cloud Kingdom the brief asks for is a scene made of type and weather, and her face
 * belongs at the end of her own year, where the story has earned it.
 */
import { Chapter } from "../../lib/scene";
import { CloudLayer } from "../world/Clouds";
import { Drifters } from "../world/Drifters";
import { Meadow } from "../world/Meadow";
import { Reveal } from "../world/Reveal";
import { PortraitMedallion } from "../PortraitMedallion";
import { child, story } from "../../data/party";
import "./Finale.css";

export function Finale() {
  return (
    <Chapter scene="finale" className="finale" label="Thank you">
      <CloudLayer depth="far" count={4} seed={53} className="finale__clouds finale__clouds--far" />
      <CloudLayer depth="mid" count={2} seed={59} className="finale__clouds finale__clouds--near" />
      <Drifters kind="fireflies" count={20} className="finale__air" />

      <div className="finale__inner">
        <Reveal className="finale__portrait" amount={0.3}>
          <PortraitMedallion photoId={child.finalePortrait} alt={`${child.name}`} />
        </Reveal>

        <Reveal as="p" className="finale__thanks" delay={0.14} amount={0.4}>
          {story.finaleThanks}
        </Reveal>

        <Reveal as="p" className="script finale__see" delay={0.26} amount={0.4}>
          {story.finaleSee}
        </Reveal>

        <div className="rule" aria-hidden="true">
          <span />
        </div>

        <Reveal as="p" className="finale__signoff" delay={0.38} amount={0.4}>
          {story.finaleSignOff}
        </Reveal>
      </div>

      <Meadow className="finale__meadow" bands={["far", "mid"]} seed={12} />
    </Chapter>
  );
}
