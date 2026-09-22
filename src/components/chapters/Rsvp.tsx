/**
 * The fairy garden at the end of the path.
 *
 * There was a form here — name, coming or not, how many, a wish — and it is gone at
 * Lester's asking. It was always a form with nowhere to send to: this site has no
 * backend, and no contact details had been given, so the panel said as much rather than
 * swallowing a guest's reply. An invitation that asks a question it cannot receive an
 * answer to is worse than one that simply invites, so this is now the invitation.
 *
 * Replies come back to Lester the way they already were: by message, in the group the
 * invitation was shared into.
 */
import { Chapter } from "../../lib/scene";
import { CloudLayer } from "../world/Clouds";
import { Drifters } from "../world/Drifters";
import { Butterflies } from "../world/Butterflies";
import { Meadow } from "../world/Meadow";
import { Painted } from "../world/Painted";
import { Reveal } from "../world/Reveal";
import { story } from "../../data/party";
import "./Rsvp.css";

export function Rsvp() {
  return (
    <Chapter scene="rsvp" id="rsvp" className="rsvp" label="Will you join the magic?">
      <CloudLayer depth="far" count={3} seed={33} className="rsvp__clouds" />
      <Drifters kind="fireflies" count={18} className="rsvp__air" />
      <Butterflies count={5} seed={41} className="rsvp__butterflies" />

      <div className="rsvp__inner">
        <Reveal as="h2" className="rsvp__heading gilt" amount={0.4}>
          {story.rsvpHeading}
        </Reveal>
        <Reveal as="p" className="rsvp__body" delay={0.12} amount={0.4}>
          {story.rsvpBody}
        </Reveal>
        <Reveal className="rsvp__rule" delay={0.24} amount={0.4}>
          <span />
        </Reveal>
        <Reveal as="p" className="rsvp__wish" delay={0.32} amount={0.4}>
          {story.rsvpReply}
        </Reveal>
      </div>

      {/* Somewhere to sit, in the garden the guest is being kept a place in. */}
      <Painted id="toadstool-bow" className="rsvp__toadstool" />

      <Meadow className="rsvp__meadow" seed={8} />
    </Chapter>
  );
}
