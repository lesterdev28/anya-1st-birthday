/**
 * Everything about the party that a human might want to change, in one place.
 * Nothing in the components hard-codes a date, a name or a photo.
 */

export const child = {
  name: "Anya",
  turning: "ONE",
  /**
   * The photograph set into the locket on the first screen. Any stem from
   * public/invitation/photos works — change this one line to use a different picture.
   *
   * `anya-hero-portrait` is a square crop cut tight to her face from anya-sunhat-02,
   * which is what the round frame needs: a wider photograph puts a sofa and a living
   * room inside the locket, and no amount of feathering hides a room.
   */
  heroPortrait: "anya-hero-portrait",
} as const;

export const party = {
  /** Saturday 10 October 2026, 2:00 PM local time. */
  startsAt: new Date("2026-10-10T14:00:00+08:00"),
  endsAt: new Date("2026-10-10T18:00:00+08:00"),
  dayLabel: "Saturday",
  dateLabel: "October 10, 2026",
  timeLabel: "2:00 – 6:00 in the afternoon",
  venue: "Bantug Lake Ranch",
} as const;

/**
 * RSVP details have not been given yet. Everything here is a placeholder — the section
 * renders an obvious "to be confirmed" state until `contactName` and `contactNumber`
 * are filled in, rather than inventing a number.
 */
export const rsvp = {
  contactName: "",
  contactNumber: "",
  /** Optional. An ISO date, or empty for no deadline. */
  byDate: "",
  note: "",
} as const;

export const isRsvpConfigured = Boolean(rsvp.contactName && rsvp.contactNumber);

/** The lines of the opening cinematic, in order. */
export const introLines = [
  "Once Upon a Time…",
  "A little dream came true…",
  "And now…",
] as const;

export interface MonthChapter {
  readonly month: number;
  readonly title: string;
  /** One short line. Kept gentle and non-specific, since these are not our memories. */
  readonly caption: string;
  /** Filename stem under public/invitation/photos, or null for a chapter with no photo yet. */
  readonly photo: string | null;
  /** Which generated background belongs to this chapter. */
  readonly background:
    | "month-clouds-and-stars"
    | "month-magical-garden"
    | "month-butterflies-and-blossoms"
    | "month-enchanted-forest"
    | "month-castle-finale";
}

/**
 * The twelve chapters of the photo journey.
 *
 * NOTE FOR LESTER: the seven photos you sent are placed in a plausible order, but I do
 * not know which month each one is actually from — please move them to the right months
 * (just change the `photo` field), and drop any further photos into
 * public/invitation/photos/ to fill the empty chapters. The decoration deliberately
 * grows richer as the year goes on, ending at the castle.
 */
export const monthChapters: readonly MonthChapter[] = [
  { month: 1, title: "One Month", caption: "So small, and already the whole world.", photo: null, background: "month-clouds-and-stars" },
  { month: 2, title: "Two Months", caption: "First long looks at everything.", photo: null, background: "month-clouds-and-stars" },
  { month: 3, title: "Three Months", caption: "The first real laugh.", photo: "anya-smile-01", background: "month-magical-garden" },
  { month: 4, title: "Four Months", caption: "Hands discovered. Everything tasted.", photo: "anya-smile-02", background: "month-magical-garden" },
  { month: 5, title: "Five Months", caption: "Rolling over, and very pleased about it.", photo: "anya-smile-03", background: "month-magical-garden" },
  { month: 6, title: "Six Months", caption: "Half a year of being adored.", photo: null, background: "month-butterflies-and-blossoms" },
  { month: 7, title: "Seven Months", caption: "Sitting up to see it all properly.", photo: "anya-portrait-01", background: "month-butterflies-and-blossoms" },
  { month: 8, title: "Eight Months", caption: "Opinions, and the volume to share them.", photo: null, background: "month-butterflies-and-blossoms" },
  { month: 9, title: "Nine Months", caption: "Off exploring, one hand held.", photo: "anya-sunhat-01", background: "month-enchanted-forest" },
  { month: 10, title: "Ten Months", caption: "A favourite toy, carried everywhere.", photo: "anya-sunhat-02", background: "month-enchanted-forest" },
  { month: 11, title: "Eleven Months", caption: "Almost walking. Definitely running.", photo: "anya-sunhat-03", background: "month-enchanted-forest" },
  { month: 12, title: "Twelve Months", caption: "One whole year of magic.", photo: null, background: "month-castle-finale" },
];
