/**
 * The RSVP.
 *
 * The contact details have not been supplied yet, so this section has two states. With
 * `rsvp` filled in (src/data/party.ts) it shows the real call and action buttons. Until
 * then it says plainly that details are coming, rather than printing an invented phone
 * number that a guest might actually try to call.
 *
 * The confirmation is a local flourish only — nothing is sent anywhere, because there
 * is no backend and inventing one would be worse than the honest "text us" this is.
 */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ParticleField } from "./ParticleField";
import { FairyImage } from "./FairyImage";
import { child, isRsvpConfigured, party, rsvp } from "../data/party";
import "./Rsvp.css";

export function Rsvp() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <section className="rsvp section" id="rsvp">
      <ParticleField kind="stars" count={26} className="rsvp__stars" />

      <motion.div
        className="section__inner"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <FairyImage
          id="butterflies-and-flowers"
          alt=""
          className="rsvp__ornament"
          sizes="180px"
          fallback={null}
        />

        <p className="eyebrow">Will you join us</p>
        <h2 className="section-title">Come to the party</h2>
        <div className="rule" aria-hidden="true">
          <span />
        </div>

        <p className="rsvp__lede">
          {child.name} would love to see you at {party.venue} on {party.dayLabel}, {party.dateLabel}
          .
        </p>

        {isRsvpConfigured ? (
          <AnimatePresence mode="wait">
            {confirmed ? (
              <motion.div
                key="confirmed"
                className="rsvp__confirmed"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <ParticleField kind="sparkles" count={16} className="rsvp__confirmed-sparkles" />
                <p className="rsvp__confirmed-text">
                  Wonderful. Please send your note to {rsvp.contactName} so we can count you in.
                </p>
                <a className="rsvp__button" href={`sms:${rsvp.contactNumber}`}>
                  Text {rsvp.contactName}
                </a>
              </motion.div>
            ) : (
              <motion.div key="ask" className="rsvp__actions" exit={{ opacity: 0 }}>
                <button type="button" className="rsvp__button" onClick={() => setConfirmed(true)}>
                  We&rsquo;ll be there
                </button>
                <a className="rsvp__link" href={`tel:${rsvp.contactNumber}`}>
                  or call {rsvp.contactName} on {rsvp.contactNumber}
                </a>
                {rsvp.byDate && <p className="rsvp__by">Kindly reply by {rsvp.byDate}</p>}
                {rsvp.note && <p className="rsvp__note">{rsvp.note}</p>}
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          /* Guests see only the sentence. How to fill this in is documented in
             src/data/party.ts and the README, not printed on the invitation. */
          <div className="rsvp__pending">
            <p className="rsvp__pending-text">RSVP details to follow.</p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
