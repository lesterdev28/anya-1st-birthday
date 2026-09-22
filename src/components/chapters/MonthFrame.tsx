/**
 * The frame one month's photograph sits in.
 *
 * The brief is emphatic that the twelve months must not read as the same card twelve
 * times, so there are twelve frames and each month owns one. The variation is in the
 * shape of the opening and in the ornament drawn around it — the photograph itself is
 * never touched, tinted, restyled or masked over the face. Her photographs are the one
 * thing on this page that is real, and the decoration goes around them.
 *
 * Most months have several photographs rather than one. The first is the month's own
 * portrait and gets the frame; the rest hang off two corners as small square keepsakes,
 * one tucked behind and one laid in front, so a month reads as a handful of pictures
 * spread on a table rather than as one more card. Where a month has more than three, the
 * corners take turns showing them, which is the only way to give six photographs a screen
 * without the screen becoming a contact sheet.
 *
 * Months with no photograph render the same frame with a keepsake panel inside it: the
 * month's numeral in gold over a wash of the palette. A missing picture then reads as a
 * page of the storybook that was written rather than photographed, instead of a gap.
 */
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { FairyImage } from "../FairyImage";
import type { MonthFrame as FrameName } from "../../data/party";
import "./MonthFrame.css";

interface Props {
  readonly frame: FrameName;
  readonly photos: readonly string[];
  readonly month: number;
  readonly alt: string;
  /** True while this month owns the screen. The corners only take turns in view. */
  readonly active: boolean;
}

export function MonthFrame({ frame, photos, month, alt, active }: Props) {
  const [portrait, ...rest] = photos;

  /*
   * The extras are dealt alternately into the two corners, so a month with three photos
   * fills both and a month with six gives each corner a pair to alternate between.
   */
  const corners = [rest.filter((_, i) => i % 2 === 0), rest.filter((_, i) => i % 2 === 1)].filter(
    (corner) => corner.length > 0,
  );

  return (
    <div className={`frame frame--${frame}`}>
      <Ornament frame={frame} />

      <div className="frame__opening">
        {portrait ? (
          <FairyImage
            id={portrait}
            alt={alt}
            sizes="(min-width: 900px) 22rem, 62vw"
            className="frame__photo"
          />
        ) : (
          <Keepsake month={month} />
        )}
      </div>

      {/* A ring of light just outside the opening, so the frame glows rather than ends. */}
      <div className="frame__glow" aria-hidden="true" />

      {corners.map((corner, index) => (
        <Corner key={index} photos={corner} corner={index} active={active} />
      ))}
    </div>
  );
}

/**
 * One corner of the cluster.
 *
 * Every photograph it can show is rendered and cross-faded with opacity rather than
 * swapped in and out, so the browser has already decoded the next one when its turn
 * comes and a change is a fade rather than a flash of empty frame. A corner holding a
 * single photograph mounts no timer at all, which is most of them.
 */
function Corner({
  photos,
  corner,
  active,
}: {
  readonly photos: readonly string[];
  readonly corner: number;
  readonly active: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [showing, setShowing] = useState(0);

  useEffect(() => {
    if (photos.length < 2 || !active || reduceMotion) return;
    /* Offset per corner, so the two never change on the same beat. */
    const id = window.setInterval(() => {
      setShowing((current) => (current + 1) % photos.length);
    }, 5200 + corner * 1300);
    return () => window.clearInterval(id);
  }, [photos.length, active, reduceMotion, corner]);

  return (
    /*
      Hidden from screen readers on purpose: the frame's own photograph carries the alt
      text for the month, and five more readings of "Anya at nine months" is noise, not
      information.
    */
    <div className={`frame__corner frame__corner--${corner}`} aria-hidden="true">
      {photos.map((id, index) => (
        <FairyImage
          key={id}
          id={id}
          alt=""
          sizes="(min-width: 900px) 10rem, 28vw"
          className={`frame__corner-photo${index === showing ? " is-showing" : ""}`}
        />
      ))}
    </div>
  );
}

/**
 * What a month with no photograph holds instead.
 *
 * Not an empty frame and not a placeholder: a small drawn page with the month's numeral
 * set in gold, a scatter of stars above it and a hairline ring inside the opening. It has
 * to be able to sit next to a photograph of Anya without looking like the photograph is
 * missing, because several of these months are never going to have one.
 */
function Keepsake({ month }: { readonly month: number }) {
  return (
    <div className="frame__keepsake" aria-hidden="true">
      <svg className="frame__keepsake-stars" viewBox="0 0 120 40">
        {[
          [22, 20, 5],
          [60, 11, 7.5],
          [98, 22, 5],
          [41, 30, 3.4],
          [79, 30, 3.4],
        ].map(([x, y, r], index) => (
          <path
            key={index}
            d={`M${x} ${y - r} L${x + r * 0.3} ${y - r * 0.3} L${x + r} ${y} L${x + r * 0.3} ${y + r * 0.3} L${x} ${y + r} L${x - r * 0.3} ${y + r * 0.3} L${x - r} ${y} L${x - r * 0.3} ${y - r * 0.3} Z`}
            fill="#d7b46a"
            opacity={index === 1 ? 0.95 : 0.6}
          />
        ))}
      </svg>

      <span className="frame__numeral">{month}</span>
      <span className="frame__numeral-label">{month === 1 ? "month" : "months"}</span>

      <span className="frame__keepsake-ring" />
    </div>
  );
}

/**
 * The drawn decoration for each frame, in one place.
 *
 * All of it is inline SVG in the palette's own colours: it scales with the frame, costs
 * no download, and can be recoloured by CSS if the palette ever moves.
 */
function Ornament({ frame }: { readonly frame: FrameName }) {
  switch (frame) {
    case "wreath":
      return (
        <svg className="frame__art frame__art--wreath" viewBox="0 0 200 200" aria-hidden="true">
          {Array.from({ length: 22 }, (_, index) => {
            const angle = (360 / 22) * index;
            const bloom = index % 3 === 0;
            return (
              <g key={index} transform={`rotate(${angle} 100 100)`}>
                <ellipse
                  cx="100"
                  cy="8"
                  rx={bloom ? 6 : 3.4}
                  ry={bloom ? 6 : 8}
                  fill={bloom ? "#f4d6df" : "#c8d6be"}
                  opacity={bloom ? 0.95 : 0.8}
                />
                {bloom && <circle cx="100" cy="8" r="2.2" fill="#e8d3a4" />}
              </g>
            );
          })}
        </svg>
      );

    case "moon":
      return (
        <svg className="frame__art frame__art--moon" viewBox="0 0 220 220" aria-hidden="true">
          {/* A crescent cradling the opening from behind. */}
          <path
            d="M110 6 A104 104 0 1 0 202 154 A88 88 0 1 1 110 6 Z"
            fill="none"
            stroke="#e8d3a4"
            strokeWidth="2.4"
            opacity="0.85"
          />
          {[
            [24, 42],
            [186, 60],
            [40, 176],
            [176, 168],
            [110, 200],
          ].map(([x, y], index) => (
            <path
              key={index}
              d={`M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y} L${x + 2} ${y + 2} L${x} ${y + 7} L${x - 2} ${y + 2} L${x - 7} ${y} L${x - 2} ${y - 2} Z`}
              fill="#e8d3a4"
              opacity="0.9"
            />
          ))}
        </svg>
      );

    case "vines":
      return (
        <svg className="frame__art frame__art--vines" viewBox="0 0 200 240" aria-hidden="true">
          {[
            "M6 236 C 2 190, 24 168, 14 128 C 6 96, 26 70, 18 34",
            "M194 236 C 198 190, 176 168, 186 128 C 194 96, 174 70, 182 34",
          ].map((d, index) => (
            <g key={index}>
              <path d={d} fill="none" stroke="#94a987" strokeWidth="2" strokeLinecap="round" />
              {Array.from({ length: 6 }, (_, leaf) => {
                const x = index === 0 ? 8 + (leaf % 2) * 12 : 192 - (leaf % 2) * 12;
                const y = 220 - leaf * 34;
                return (
                  <ellipse
                    key={leaf}
                    cx={x}
                    cy={y}
                    rx="8"
                    ry="4.4"
                    fill="#c8d6be"
                    opacity="0.9"
                    transform={`rotate(${index === 0 ? -28 : 28} ${x} ${y})`}
                  />
                );
              })}
            </g>
          ))}
        </svg>
      );

    case "starry":
      return (
        <svg className="frame__art frame__art--starry" viewBox="0 0 220 220" aria-hidden="true">
          {Array.from({ length: 16 }, (_, index) => {
            const angle = ((Math.PI * 2) / 16) * index;
            const inner = 104;
            const outer = index % 2 === 0 ? 118 : 110;
            return (
              <line
                key={index}
                x1={110 + Math.cos(angle) * inner}
                y1={110 + Math.sin(angle) * inner}
                x2={110 + Math.cos(angle) * outer}
                y2={110 + Math.sin(angle) * outer}
                stroke="#e8d3a4"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.9"
              />
            );
          })}
        </svg>
      );

    case "storybook":
      return (
        <svg className="frame__art frame__art--storybook" viewBox="0 0 200 150" aria-hidden="true">
          {/* A gold rule inset from the edge, with corner diamonds. */}
          <rect
            x="7"
            y="7"
            width="186"
            height="136"
            fill="none"
            stroke="#d7b46a"
            strokeWidth="1"
            opacity="0.75"
          />
          {[
            [7, 7],
            [193, 7],
            [7, 143],
            [193, 143],
          ].map(([x, y], index) => (
            <rect
              key={index}
              x={x - 3}
              y={y - 3}
              width="6"
              height="6"
              fill="#d7b46a"
              transform={`rotate(45 ${x} ${y})`}
            />
          ))}
        </svg>
      );

    case "arch":
    case "portal":
      return (
        <svg className="frame__art frame__art--arch" viewBox="0 0 200 260" aria-hidden="true">
          <path
            d="M10 258 L10 108 A90 90 0 0 1 190 108 L190 258"
            fill="none"
            stroke="#d7b46a"
            strokeWidth="1.4"
            opacity="0.7"
          />
          <path
            d="M20 258 L20 110 A80 80 0 0 1 180 110 L180 258"
            fill="none"
            stroke="#e8d3a4"
            strokeWidth="0.8"
            opacity="0.55"
          />
          <circle cx="100" cy="22" r="4" fill="#d7b46a" />
        </svg>
      );

    case "butterfly":
      return (
        <svg className="frame__art frame__art--butterfly" viewBox="0 0 200 200" aria-hidden="true">
          {[
            [18, 26, -22],
            [180, 44, 18],
            [30, 170, 12],
          ].map(([x, y, rotate], index) => (
            <g key={index} transform={`translate(${x} ${y}) rotate(${rotate}) scale(1.1)`}>
              <path d="M0 0 C -6 -9, -14 -8, -13 -1 C -12 6, -5 7, 0 0 Z" fill="#e8ddf5" />
              <path d="M0 0 C 6 -9, 14 -8, 13 -1 C 12 6, 5 7, 0 0 Z" fill="#f4d6df" />
              <path d="M0 -3 L0 4" stroke="#9b90ab" strokeWidth="0.9" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      );

    case "meadow":
      return (
        <svg className="frame__art frame__art--meadow" viewBox="0 0 200 60" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => {
            const x = 6 + index * 11;
            const height = 18 + ((index * 37) % 26);
            return (
              <g key={index}>
                <path
                  d={`M${x} 60 Q ${x + 2} ${60 - height * 0.6} ${x + 3} ${60 - height}`}
                  fill="none"
                  stroke="#94a987"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                {index % 3 === 0 && (
                  <circle cx={x + 3} cy={60 - height} r="3.2" fill={index % 2 ? "#f4d6df" : "#c9b7e8"} />
                )}
              </g>
            );
          })}
        </svg>
      );

    case "oval":
      return (
        <svg className="frame__art frame__art--oval" viewBox="0 0 180 230" aria-hidden="true">
          <ellipse
            cx="90"
            cy="115"
            rx="86"
            ry="111"
            fill="none"
            stroke="#d7b46a"
            strokeWidth="1.6"
            opacity="0.8"
          />
          <ellipse
            cx="90"
            cy="115"
            rx="80"
            ry="105"
            fill="none"
            stroke="#e8d3a4"
            strokeWidth="0.7"
            opacity="0.6"
          />
          <circle cx="90" cy="4" r="4.4" fill="#fbf5ea" stroke="#d7b46a" strokeWidth="1.4" />
        </svg>
      );

    /* The cloud frame's decoration is the mask itself, drawn in CSS. */
    default:
      return null;
  }
}
