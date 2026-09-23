/**
 * Gift ideas, offered rather than asked for.
 *
 * Lester's instruction for this page was "please don't sound demanding", and that is the
 * whole design of it. A gift registry on an invitation reads as a price of entry, so the
 * copy says plainly that coming is the gift, the ideas are framed as a starting point for
 * the guests who like one, and the last line gives everybody permission to bring nothing.
 *
 * The pictures are shop-style product shots rather than paintings, so unlike everything
 * else in this world they do get a frame: a card with a soft edge keeps them from looking
 * like something pasted onto the meadow.
 */
import { Chapter } from "../../lib/scene";
import { CloudLayer } from "../world/Clouds";
import { Drifters } from "../world/Drifters";
import { Butterflies } from "../world/Butterflies";
import { Reveal } from "../world/Reveal";
import { responsiveImage } from "../../lib/assets";
import { gifts, story } from "../../data/party";
import "./Gifts.css";

const SIZES = "(min-width: 900px) 15rem, 42vw";

export function Gifts() {
  return (
    <Chapter scene="gifts" id="gifts" className="gifts" label="Gift ideas">
      <CloudLayer depth="far" count={3} seed={51} className="gifts__clouds" />
      <Drifters kind="dust" count={14} className="gifts__air" />
      <Butterflies count={4} seed={63} className="gifts__butterflies" />

      <div className="gifts__inner">
        <Reveal as="p" className="eyebrow gifts__eyebrow" amount={0.4}>
          {story.giftsEyebrow}
        </Reveal>
        <Reveal as="h2" className="gifts__heading gilt" delay={0.08} amount={0.4}>
          {story.giftsTitle}
        </Reveal>
        <Reveal as="p" className="gifts__body" delay={0.16} amount={0.4}>
          {story.giftsBody}
        </Reveal>

        <ul className="gifts__grid">
          {gifts.map((gift, index) => {
            const picture = responsiveImage(gift.id);
            if (!picture) return null;

            return (
              <li key={gift.id}>
                {/* Staggered a little down the list, so the four arrive as a hand of cards. */}
                <Reveal className="gifts__card" delay={0.1 + index * 0.08} amount={0.2}>
                  <picture className="gifts__shot">
                    <source type="image/avif" srcSet={picture.avifSrcSet} sizes={SIZES} />
                    <img
                      src={picture.src}
                      srcSet={picture.srcSet}
                      sizes={SIZES}
                      alt={gift.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  <p className="gifts__name">{gift.name}</p>
                  <p className="gifts__note">{gift.note}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal as="p" className="script gifts__foot" delay={0.2} amount={0.3}>
          {story.giftsFoot}
        </Reveal>
      </div>
    </Chapter>
  );
}
