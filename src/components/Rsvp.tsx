/**
 * The RSVP.
 *
 * The contact details have not been given yet, so this renders an explicit
 * "to be confirmed" state rather than a dead link or an invented phone number. The
 * moment `rsvp.contactName` and `rsvp.contactNumber` are filled in (src/data/party.ts)
 * it becomes a real tap-to-message button, with no other change needed.
 */
import { motion } from "framer-motion";
import { GoldCrown } from "./GoldCrown";
import { ParticleField } from "./ParticleField";
import { child, isRsvpConfigured, party, rsvp } from "../data/party";
import "./Rsvp.css";

/** Strips spaces and punctuation so the number is safe inside an sms: or tel: URL. */
function dialable(value: string): string {
  return value.replace(/[^\d+]/g, "");
}

export function Rsvp() {
  const message = `Hello! We would love to come to ${child.name}'s first birthday on ${party.dateLabel}.`;

  return (
    <section className="section rsvp" id="rsvp" aria-labelledby="rsvp-title">
      <ParticleField kind="fireflies" count={12} className="rsvp__fireflies" />

      <div className="section__inner">
        <GoldCrown className="rsvp__crown" />

        <h2 className="section-title" id="rsvp-title">
          Will you join us?
        </h2>
        <span className="rule">
          <span />
        </span>

        {isRsvpConfigured ? (
          <motion.div
            className="rsvp__action"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <p className="rsvp__lead">
              Please let {rsvp.contactName} know
              {rsvp.byDate ? ` by ${rsvp.byDate}` : ""}.
            </p>

            <a
              className="rsvp__button"
              href={`sms:${dialable(rsvp.contactNumber)}?&body=${encodeURIComponent(message)}`}
            >
              Send our RSVP
            </a>

            <a className="rsvp__call" href={`tel:${dialable(rsvp.contactNumber)}`}>
              or call {rsvp.contactNumber}
            </a>

            {rsvp.note && <p className="rsvp__note">{rsvp.note}</p>}
          </motion.div>
        ) : (
          <div className="rsvp__pending">
            <p className="rsvp__lead">
              We would love to have you there. RSVP details are still being arranged and
              will appear here shortly.
            </p>
            <p className="rsvp__note">
              In the meantime, please save {party.dayLabel} {party.dateLabel}.
            </p>
          </div>
        )}
      </div>

      <footer className="rsvp__footer">
        <p>
          {child.name} &middot; {party.dateLabel} &middot; {party.venue}
        </p>
      </footer>
    </section>
  );
}
