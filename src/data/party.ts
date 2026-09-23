/**
 * Everything about the party and the story that a human might want to change, in one
 * place. Nothing in the components hard-codes a date, a name, a photo or a line of copy.
 */

export const child = {
  name: "Anya",
  /**
   * Her name in full, for the one place it belongs: the formal invitation.
   *
   * Everywhere else on the page she is Anya, because that is what everyone being invited
   * calls her — a printed invitation is the one moment that sets the whole name down.
   */
  fullName: "Briella Anya Orot",
  turning: "ONE",
  /**
   * The photograph the journey closes on. Any stem from public/invitation/photos works.
   *
   * `anya-finale-portrait` is a square crop cut tight to her face; the round frames the
   * finale uses need that, because a wider photograph puts a sofa and a living room
   * inside the frame and no amount of feathering hides a room.
   */
  finalePortrait: "anya-finale-portrait",
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

  /*
   * Lester asked for gift ideas that do not sound demanding, so this page gives the gift
   * back before it suggests anything and ends by saying nothing is needed at all.
   */
  giftsEyebrow: "Only if you'd like to",
  giftsTitle: "Gift Ideas",
  giftsBody:
    "Having you there is the whole gift. But if you would like a starting point, here are a few things Anya would enjoy.",
  giftsFoot: "anything at all, or nothing at all, is lovely",

  countdownHeading: "The magic begins in…",
  countdownToday: "The magic is happening today",
  countdownPast: "Thank you for celebrating with us",

  rsvpHeading: "Will you join the magic?",
  rsvpBody: "We would love to celebrate Anya's special day with you.",


  /*
   * Lester's own words, sent on 2026-09-23, and the one piece of copy on this site that is
   * not mine to reword. Any change here should come from him.
   */
  blessingVerse:
    "For this child I prayed, and the LORD has granted me my petition that I made to him.",
  blessingCitation: "1 Samuel 1:27 (ESV)",
  blessingPrayer:
    "One beautiful year of watching God's goodness unfold before our eyes. Our prayer is that as you grow, you will know Christ, love His Word, and walk faithfully with Him all the days of your life.",

  finaleThanks: "Thank you for being part of Anya's story.",
  finaleSee: "See you in the fairy garden.",
  finaleSignOff: "Anya turns ONE ✨",
} as const;

/**
 * The gift suggestions, in the order they are shown.
 *
 * Each `id` is a stem under public/invitation/gifts; a gift whose picture has not been
 * optimized yet simply does not render, the same rule the rest of the site follows.
 */
export const gifts = [
  {
    id: "gift-montessori-toys",
    name: "Montessori wooden toys",
    note: "Stacking, sorting and fitting things together.",
  },
  {
    id: "gift-bible-stories",
    name: "My First Bible Stories",
    note: "A sound book with ten stories to press along to.",
  },
  {
    id: "gift-bookshelf",
    name: "A little bookshelf",
    note: "Low enough that she can choose her own book.",
  },
  {
    id: "gift-peppa-chair",
    name: "A Peppa Pig chair",
    note: "A seat of her very own, exactly her size.",
  },
] as const;

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
  /**
   * Filename stems under public/invitation/photos, best first.
   *
   * A list rather than one photo because Anya has several from most months. The first is
   * the month's own portrait and gets the frame; the rest hang around it as smaller
   * keepsakes. An empty list is a month with no photograph at all.
   */
  readonly photos: readonly string[];
  readonly frame: MonthFrame;
  /** Which side the photograph arrives from, so the journey alternates down the page. */
  readonly from: "left" | "right";
}

/**
 * The twelve chapters of the journey.
 *
 * The photographs are the ones Lester sent, month by month, in the batches he labelled.
 * Within a month the first is the clearest portrait and is the one the frame holds; the
 * others follow. To reorder a month, reorder its list — the files are named for their
 * month, so nothing has to be renamed.
 *
 * Month eleven is still to come. Month twelve has no photograph and is not going to get
 * one, so it is written as the climax of the story rather than as another picture: the
 * clouds part, the dust rises and what the page reveals is the year itself. A chapter
 * with no photographs keeps its place either way, so the year still reads one to twelve.
 */
export const monthChapters: readonly MonthChapter[] = [
  {
    month: 1,
    title: "One Month",
    caption: "So small, and already the whole world.",
    photos: ["anya-month-01-a", "anya-month-01-b", "anya-month-01-c", "anya-month-01-d"],
    frame: "cloud",
    from: "left",
  },
  {
    month: 2,
    title: "Two Months",
    caption: "First long looks at everything.",
    photos: ["anya-month-02-a", "anya-month-02-b", "anya-month-02-c"],
    frame: "butterfly",
    from: "right",
  },
  {
    month: 3,
    title: "Three Months",
    caption: "The first real laugh.",
    photos: ["anya-month-03-a", "anya-month-03-b", "anya-month-03-c"],
    frame: "wreath",
    from: "left",
  },
  {
    month: 4,
    title: "Four Months",
    caption: "Hands discovered. Everything tasted.",
    photos: ["anya-month-04-a", "anya-month-04-b", "anya-month-04-c", "anya-month-04-d"],
    frame: "portal",
    from: "right",
  },
  {
    month: 5,
    title: "Five Months",
    caption: "Rolling over, and very pleased about it.",
    photos: ["anya-month-05-a", "anya-month-05-b", "anya-month-05-c", "anya-month-05-d", "anya-month-05-e", "anya-month-05-f"],
    frame: "arch",
    from: "left",
  },
  {
    month: 6,
    title: "Six Months",
    caption: "Half a year of being adored.",
    photos: ["anya-month-06-a", "anya-month-06-b", "anya-month-06-c", "anya-month-06-d", "anya-month-06-e", "anya-month-06-f"],
    frame: "moon",
    from: "right",
  },
  {
    month: 7,
    title: "Seven Months",
    caption: "Sitting up to see it all properly.",
    photos: ["anya-month-07-a", "anya-month-07-b", "anya-month-07-c", "anya-month-07-d"],
    frame: "storybook",
    from: "left",
  },
  {
    month: 8,
    title: "Eight Months",
    caption: "Opinions, and the volume to share them.",
    photos: ["anya-month-08-a", "anya-month-08-b"],
    frame: "meadow",
    from: "right",
  },
  {
    month: 9,
    title: "Nine Months",
    caption: "Off exploring, one hand held.",
    photos: ["anya-month-09-a", "anya-month-09-b", "anya-month-09-c", "anya-month-09-d", "anya-month-09-e", "anya-month-09-f"],
    frame: "oval",
    from: "left",
  },
  {
    month: 10,
    title: "Ten Months",
    caption: "A favourite toy, carried everywhere.",
    photos: ["anya-month-10-a", "anya-month-10-b", "anya-month-10-c", "anya-month-10-d", "anya-month-10-e"],
    frame: "vines",
    from: "right",
  },
  {
    month: 11,
    title: "Eleven Months",
    caption: "Almost walking. Definitely running.",
    photos: [
      "anya-month-11-a",
      "anya-month-11-b",
      "anya-month-11-c",
      "anya-month-11-d",
      "anya-month-11-e",
      "anya-month-11-f",
    ],
    frame: "starry",
    from: "left",
  },
  /* No photograph, and there will not be one — Lester said so. Twelve is the climax. */
  { month: 12, title: "Twelve Months", caption: "One whole year of magic.", photos: [], frame: "finale", from: "left" },
];
