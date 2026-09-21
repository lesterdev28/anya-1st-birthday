/**
 * The fairy garden at the end of the path: the RSVP, and the wish that goes with it.
 *
 * This site has no backend, so the form is honest about where a reply goes. When contact
 * details are set it hands the guest a pre-filled message addressed to them and lets the
 * guest press send, which means the reply lands somewhere a human will actually see it.
 * When an endpoint is set it posts there instead. Until Lester has given either, the
 * fields are still here to be read, and the panel says plainly that the details are
 * being confirmed rather than swallowing a reply that would go nowhere.
 */
import { useState, type FormEvent } from "react";
import { playSfx } from "../../lib/audio";
import { Chapter } from "../../lib/scene";
import { CloudLayer } from "../world/Clouds";
import { Drifters } from "../world/Drifters";
import { Butterflies } from "../world/Butterflies";
import { Meadow } from "../world/Meadow";
import { Reveal } from "../world/Reveal";
import { child, isRsvpConfigured, rsvp, story } from "../../data/party";
import "./Rsvp.css";

type Attending = "yes" | "no";

export function Rsvp() {
  return (
    <Chapter scene="rsvp" id="rsvp" className="rsvp" label="RSVP">
      <CloudLayer depth="far" count={3} seed={33} className="rsvp__clouds" />
      <Drifters kind="fireflies" count={18} className="rsvp__air" />
      <Butterflies count={2} seed={41} className="rsvp__butterflies" />

      <div className="rsvp__inner">
        <Reveal as="h2" className="rsvp__heading" amount={0.4}>
          {story.rsvpHeading}
        </Reveal>
        <Reveal as="p" className="rsvp__body" delay={0.12} amount={0.4}>
          {story.rsvpBody}
        </Reveal>

        <Reveal className="rsvp__panel" delay={0.2} amount={0.25}>
          <RsvpForm />
        </Reveal>
      </div>

      <Meadow className="rsvp__meadow" seed={8} />
    </Chapter>
  );
}

function RsvpForm() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<Attending>("yes");
  const [guests, setGuests] = useState("1");
  const [wish, setWish] = useState("");
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setFailed(false);

    const reply = { name, attending, guests: Number(guests), wish };

    if (rsvp.endpoint) {
      try {
        const response = await fetch(rsvp.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reply),
        });
        if (!response.ok) throw new Error(String(response.status));
        setSent(true);
        void playSfx("bloom");
      } catch {
        setFailed(true);
      }
      return;
    }

    /*
     * No endpoint: compose the message and hand it to the guest's own messaging app.
     * Nothing is claimed to have been sent until they have pressed send there.
     */
    const lines = [
      `RSVP for ${child.name}'s 1st birthday`,
      `Name: ${name}`,
      attending === "yes" ? `Coming, ${guests} of us` : "Sadly can't make it",
      wish ? `Wish: ${wish}` : "",
    ].filter(Boolean);

    window.location.href = `sms:${rsvp.contactNumber}?&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent(true);
    void playSfx("bloom");
  }

  if (sent) {
    return (
      <div className="rsvp__done" role="status">
        <span className="rsvp__done-mark" aria-hidden="true" />
        <p>{story.rsvpSaved}</p>
      </div>
    );
  }

  return (
    <form className="rsvp__form" onSubmit={submit}>
      <label className="rsvp__field">
        <span className="rsvp__label">Your name</span>
        <input
          type="text"
          value={name}
          required
          autoComplete="name"
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      <fieldset className="rsvp__choices">
        <legend className="rsvp__label">Will you be there?</legend>
        <div className="rsvp__choice-row">
          {(
            [
              ["yes", story.rsvpYes],
              ["no", story.rsvpNo],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className={`rsvp__choice${attending === value ? " is-on" : ""}`}>
              <input
                type="radio"
                name="attending"
                value={value}
                checked={attending === value}
                onChange={() => setAttending(value)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {attending === "yes" && (
        <label className="rsvp__field rsvp__field--narrow">
          <span className="rsvp__label">How many of you?</span>
          <input
            type="number"
            min="1"
            max="12"
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
          />
        </label>
      )}

      {/* The wishes section of the brief, kept with the reply so it is actually sent. */}
      <div className="rsvp__wishes">
        <h3 className="rsvp__wishes-heading">{story.wishesHeading}</h3>
        <p className="rsvp__wishes-body">{story.wishesBody}</p>
        <label className="rsvp__field">
          <span className="visually-hidden">{story.rsvpWish}</span>
          <textarea
            rows={3}
            value={wish}
            placeholder={story.rsvpWish}
            onChange={(event) => setWish(event.target.value)}
          />
        </label>
      </div>

      {isRsvpConfigured || rsvp.endpoint ? (
        <button type="submit" className="rsvp__send">
          {story.rsvpSend}
        </button>
      ) : (
        <p className="rsvp__pending">
          RSVP details are still being confirmed — this is where they will go.
        </p>
      )}

      {failed && (
        <p className="rsvp__failed" role="alert">
          That didn&rsquo;t send. Please try again in a moment.
        </p>
      )}

      {rsvp.byDate && <p className="rsvp__by">Kindly reply by {rsvp.byDate}.</p>}
      {rsvp.note && <p className="rsvp__note">{rsvp.note}</p>}
    </form>
  );
}
