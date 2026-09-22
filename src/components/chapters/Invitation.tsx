/**
 * The invitation itself, and the countdown to it.
 *
 * After the year adds up, this is the turn outward: the story stops being about what has
 * happened and becomes an ask. It is the one place on the page where the information has
 * to be unambiguous, so the decoration steps back and the date, the time and the place
 * are plainly set — the magic here is in the frame around them, not in the words.
 */
import { Chapter } from "../../lib/scene";
import { CloudLayer } from "../world/Clouds";
import { Drifters } from "../world/Drifters";
import { Butterflies } from "../world/Butterflies";
import { Reveal } from "../world/Reveal";
import { GoldCrown } from "../GoldCrown";
import { Painted } from "../world/Painted";
import { Countdown } from "./Countdown";
import { child, party, story } from "../../data/party";
import "./Invitation.css";

export function Invitation() {
  return (
    <Chapter scene="invitation" id="invitation" className="invite" label="The invitation">
      <CloudLayer depth="far" count={3} seed={19} className="invite__clouds" />
      <Drifters kind="dust" count={16} className="invite__air" />
      <Butterflies count={5} seed={27} className="invite__butterflies" />

      <Reveal className="invite__card" amount={0.3}>
        {/*
          One painting used twice, at opposite corners and mirrored, which is how a
          printed invitation would do it — the eye reads a pair, not a repeat.
        */}
        <Painted id="magnolia-spray" className="invite__bloom invite__bloom--top" />
        <Painted id="magnolia-spray" className="invite__bloom invite__bloom--bottom" />

        <div className="invite__crown">
          <GoldCrown />
        </div>

        <p className="eyebrow invite__eyebrow">{story.inviteEyebrow}</p>

        <h2 className="invite__title gilt">{story.inviteTitle}</h2>

        <div className="rule" aria-hidden="true">
          <span />
        </div>

        <p className="invite__body">{story.inviteBody}</p>

        <dl className="invite__details">
          <div className="invite__detail">
            <dt>When</dt>
            <dd>
              {party.dayLabel}, {party.dateLabel}
              <span className="invite__time">{party.timeLabel}</span>
            </dd>
          </div>

          <div className="invite__detail">
            <dt>Where</dt>
            <dd>
              {party.venue}
              {party.address && <span className="invite__time">{party.address}</span>}
            </dd>
          </div>

          {party.dressCode && (
            <div className="invite__detail">
              <dt>Wear</dt>
              <dd>{party.dressCode}</dd>
            </div>
          )}
        </dl>

        <p className="script invite__signoff">for {child.name}</p>
      </Reveal>

      <Countdown />
    </Chapter>
  );
}
