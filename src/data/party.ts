/**
 * Everything about the party and the story that a human might want to change, in one
 * place. Nothing in the components hard-codes a date, a name, a photo or a line of copy.
 */

export const child = {
  name: "Anya",
  turning: "ONE",
  /**
   * The photograph the journey closes on. Any stem from public/invitation/photos works.
   *
   * `anya-hero-portrait` is a square crop cut tight to her face; the round frames the
   * finale uses need that, because a wider photograph puts a sofa and a living room
   * inside the frame and no amount of feathering hides a room.
   */
  finalePortrait: "anya-hero-portrait",
} as const;

export const party = {
  /** Saturday 10 October 2026, 2:00 PM local time. */
  startsAt: new Date("2026-10-10T14:00:00+08:00"),
  endsAt: new Date("2026-10-10T18:00:00+08:00"),
  dayLabel: "Saturday",
  dateLabel: "October 10, 2026",
  timeLabel: "2:00 – 6:00 in the afternoon",
  venue: "Bantug Lake Ranch",
  /** Optional. Shown under the venue when set. */
  address: "",
  /** Optional. The invitation hides the line entirely when this is empty. */
  dressCode: "",
} as const;

/**
 * Every line of story copy, in the order a guest meets it.
 *
 * Kept here rather than in the components because these are the words of the invitation
 * — the part most likely to be revised by someone who does not want to open a component
 * to do it.
 */
export const story = {
  loading: "Preparing a little magic…",
  loadingTitle: "Anya's First Birthday",

  once: "Once upon a time…",
  comeCelebrate: "Come celebrate a magical year with us",
  enter: "Enter Anya's Fairy Garden",

  /** The meadow, revealed a line at a time. */
  meadow: ["One little fairy.", "Twelve magical months.", "A whole lifetime of love."],

  journeyLead: "Her first year, one month at a time",

  climaxCount: "365 days of Anya",
  climaxOnward: "And her story is only beginning…",
  climaxCelebrate: "Now let's celebrate!",

  inviteEyebrow: "You're Invited",
  inviteTitle: "Anya's 1st Birthday",
  inviteBody: "Join us for an enchanted celebration as our little fairy turns ONE.",

  countdownHeading: "The magic begins in…",
  countdownToday: "The magic is happening today",
  countdownPast: "Thank you for celebrating with us",

  rsvpHeading: "Will you join the magic?",
  rsvpBody: "We would love to celebrate Anya's special day with you.",
  rsvpYes: "Of course! ✨",
  rsvpNo: "Sending fairy wishes",
  rsvpWish: "Leave a little wish for Anya",
  rsvpSend: "Send My RSVP",
  rsvpSaved: "Your place in Anya's fairy garden is saved. ✨",

  wishesHeading: "A Wish for Anya",
  wishesBody: "Leave a little message for Anya to read someday.",

  finaleThanks: "Thank you for being part of Anya's story.",
  finaleSee: "See you in the fairy garden.",
  finaleSignOff: "Anya turns ONE ✨",
} as const;

/**
 * The background music and the enchanted soundscape.
 *
 * `autoStart` is deliberately false: the brief asks for the sound to be unlocked by the
 * "Enter Anya's Fairy Garden" button rather than by any stray tap, so that a guest who
 * scrolls straight past the button never makes a noise they did not ask for.
 */
export const sound = {
  autoStart: false,
  /** 0 to 1. Deliberately well under half: this plays behind everything, not over it. */
  volume: 0.32,
  /** Seconds. The brief asks for a 2-3 second fade rather than an abrupt start. */
  fadeSeconds: 2.6,
} as const;

/**
 * RSVP details have not been given yet.
 *
 * `endpoint` is where the form POSTs its JSON. While it is empty the form still works
 * and still confirms, but hands the guest a pre-filled message to `contactNumber`
 * instead of submitting anywhere — there is no backend on this site, and silently
 * dropping a guest's reply would be worse than asking them to press send.
 */
export const rsvp = {
  contactName: "",
  contactNumber: "",
  endpoint: "",
  /** Optional. An ISO date, or empty for no deadline. */
  byDate: "",
  note: "",
} as const;

export const isRsvpConfigured = Boolean(rsvp.contactName && rsvp.contactNumber);

/**
 * How a month's photograph is presented.
 *
 * The brief is explicit that the twelve chapters must not feel identical, so each one
 * gets its own frame and its own way of arriving. They are listed here rather than
 * chosen in the component so the order can be rearranged without touching any code.
 */
export type MonthFrame =
  | "cloud"
  | "butterfly"
  | "wreath"
  | "portal"
  | "arch"
  | "moon"
  | "storybook"
  | "meadow"
  | "oval"
  | "vines"
  | "starry"
  | "finale";

export interface MonthChapter {
  readonly month: number;
  readonly title: string;
  /** One short line. Kept gentle and non-specific, since these are not our memories. */
  readonly caption: string;
  /** Filename stem under public/invitation/photos, or null for a chapter with no photo. */
  readonly photo: string | null;
  readonly frame: MonthFrame;
  /** Which side the photograph arrives from, so the journey alternates down the page. */
  readonly from: "left" | "right";
}

/**
 * The twelve chapters of the journey.
 *
 * NOTE FOR LESTER: the seven photos you sent are placed in a plausible order, but I do
 * not know which month each one is actually from — please move them to the right months
 * (just change the `photo` field), and drop any further photos into
 * public/invitation/photos/ to fill the empty chapters.
 *
 * Month twelve has no photograph and is not going to get one, so it is written as the
 * climax of the story rather than as another picture: the clouds part, the dust rises
 * and what the page reveals is the year itself. A chapter with `photo: null` keeps its
 * place either way, so the year still reads one to twelve.
 */
export const monthChapters: readonly MonthChapter[] = [
  { month: 1, title: "One Month", caption: "So small, and already the whole world.", photo: null, frame: "cloud", from: "left" },
  { month: 2, title: "Two Months", caption: "First long looks at everything.", photo: null, frame: "butterfly", from: "right" },
  { month: 3, title: "Three Months", caption: "The first real laugh.", photo: "anya-smile-01", frame: "wreath", from: "left" },
  { month: 4, title: "Four Months", caption: "Hands discovered. Everything tasted.", photo: "anya-smile-02", frame: "portal", from: "right" },
  { month: 5, title: "Five Months", caption: "Rolling over, and very pleased about it.", photo: "anya-smile-03", frame: "arch", from: "left" },
  { month: 6, title: "Six Months", caption: "Half a year of being adored.", photo: null, frame: "moon", from: "right" },
  { month: 7, title: "Seven Months", caption: "Sitting up to see it all properly.", photo: "anya-portrait-01", frame: "storybook", from: "left" },
  { month: 8, title: "Eight Months", caption: "Opinions, and the volume to share them.", photo: null, frame: "meadow", from: "right" },
  { month: 9, title: "Nine Months", caption: "Off exploring, one hand held.", photo: "anya-sunhat-01", frame: "oval", from: "left" },
  { month: 10, title: "Ten Months", caption: "A favourite toy, carried everywhere.", photo: "anya-sunhat-02", frame: "vines", from: "right" },
  { month: 11, title: "Eleven Months", caption: "Almost walking. Definitely running.", photo: "anya-sunhat-03", frame: "starry", from: "left" },
  { month: 12, title: "Twelve Months", caption: "One whole year of magic.", photo: null, frame: "finale", from: "left" },
];
