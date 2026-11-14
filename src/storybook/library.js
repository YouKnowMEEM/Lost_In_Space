// The storybooks made for every machine in NASA's "Discarded Equipment Storytelling" list.
// Only this small index is loaded up front; each book's words and pictures are downloaded
// when a reader opens it. Books without recorded narration are read aloud by the
// browser's own voice (see speechVoice.js).

export const MUSIC = {
  moon: "/audio/music/moon-lullaby.mp3",
  mars: "/audio/music/mars-lullaby.mp3",
  deep: "/audio/music/deep-lullaby.mp3",
};

const WORLD = {
  moon: { label: "the Moon", short: "Moon", path: "/moon" },
  mars: { label: "Mars", short: "Mars", path: "/mars" },
  deep: { label: "Deep space", short: "Space", path: "/space" },
};

/**
 * slug -> book. `objects` are catalog ids; the first one's field notes act as the mission file.
 * `cover`, `pages`, `minutes` and `blurb` are for the bookshelf on the home page (minutes are an
 * estimate at a calm read-aloud pace).
 */
export const BOOKS = {
  surveyor: {
    title: "Surveyor", subtitle: "The robots who tested the Moon", world: "moon", objects: ["surveyor-3", "surveyor-1", "surveyor-5", "surveyor-6", "surveyor-7"],
    cover: "/images/covers/surveyor.webp", pages: 10, minutes: 7,
    blurb: "Five little robots that landed on the Moon before any astronaut did. They tested its dusty ground and showed it was strong enough to hold a spacecraft. One of them even had visitors.",
    load: () => import("./books/surveyor"),
  },
  "lunar-rovers": {
    title: "Three Moon Buggies", subtitle: "The cars parked on the Moon", world: "moon", objects: ["lrv-15", "lrv-16", "lrv-17"],
    cover: "/images/covers/lunar-rovers.webp", pages: 9, minutes: 7,
    blurb: "Three electric cars that astronauts drove across the Moon on Apollo 15, 16 and 17. They are still parked where the astronauts left them, with empty seats and dusty wheels.",
    load: () => import("./books/lunarRovers"),
  },
  alsep: {
    title: "The Listening Stations", subtitle: "Science boxes that stayed on the Moon", world: "moon", objects: ["alsep"],
    cover: "/images/covers/alsep.webp", pages: 9, minutes: 7,
    blurb: "The science stations that astronauts set up on the Moon and left behind. For years they listened for moonquakes, measured the warmth inside the Moon and caught the wind from the Sun.",
    load: () => import("./books/alsep"),
  },
  sojourner: {
    title: "Sojourner", subtitle: "The first rover on Mars", world: "mars", objects: ["pathfinder-sojourner"],
    cover: "/images/covers/sojourner.webp", pages: 8, minutes: 6,
    blurb: "The first rover on Mars was about the size of a microwave oven. In 1997 it rolled off its lander, studied the rocks around it one by one, and drove into history.",
    load: () => import("./books/sojourner"),
  },
  "spirit-and-opportunity": {
    title: "Spirit & Opportunity", subtitle: "The twin rovers who kept going", world: "mars", objects: ["spirit-mer-a", "opportunity-mer-b"],
    cover: "/images/covers/spirit-and-opportunity.webp", pages: 10, minutes: 8,
    blurb: "Twin rovers built to explore Mars for three months. Spirit kept going for six years and Opportunity for almost fifteen, finding clues that water once flowed there.",
    load: () => import("./books/twins"),
  },
  "phoenix-and-insight": {
    title: "Phoenix & InSight", subtitle: "The digger and the listener", world: "mars", objects: ["phoenix-lander", "insight-lander"],
    cover: "/images/covers/phoenix-and-insight.webp", pages: 9, minutes: 7,
    blurb: "Phoenix dug into the frozen ground in the far north of Mars and found water ice. InSight listened deep inside the planet and felt more than a thousand marsquakes.",
    load: () => import("./books/phoenixInsight"),
  },
  ingenuity: {
    title: "Ingenuity", subtitle: "The little helicopter that flew on Mars", world: "mars", objects: ["ingenuity-helicopter"],
    cover: "/images/covers/ingenuity.webp", pages: 8, minutes: 6,
    blurb: "A little helicopter that made the first powered flight on another world. It was meant to fly five times, and it flew seventy-two.",
    load: () => import("./books/ingenuity"),
  },
  "near-shoemaker": {
    title: "NEAR Shoemaker", subtitle: "The spacecraft that landed on an asteroid", world: "deep", objects: ["near-shoemaker"],
    cover: "/images/covers/near-shoemaker.webp", pages: 8, minutes: 6,
    blurb: "The first spacecraft to circle an asteroid, and then the first to land on one. It touched down so gently that it kept sending messages from the surface.",
    load: () => import("./books/near"),
  },
  dawn: {
    title: "Dawn", subtitle: "The explorer with a gentle blue engine", world: "deep", objects: ["dawn"],
    cover: "/images/covers/dawn.webp", pages: 8, minutes: 6,
    blurb: "The first spacecraft to circle two different worlds: the giant asteroid Vesta and the dwarf planet Ceres. A gentle blue ion engine pushed it all the way.",
    load: () => import("./books/dawn"),
  },
  kepler: {
    title: "Kepler", subtitle: "The telescope that counted planets", world: "deep", objects: ["kepler"],
    cover: "/images/covers/kepler.webp", pages: 8, minutes: 6,
    blurb: "A space telescope that watched the stars for tiny dips in their light. It found more than 2,600 planets around other stars.",
    load: () => import("./books/kepler"),
  },
  pioneers: {
    title: "Pioneer 10 & 11", subtitle: "The first travellers to the giant planets", world: "deep", objects: ["pioneer-10", "pioneer-11"],
    cover: "/images/covers/pioneers.webp", pages: 7, minutes: 5,
    blurb: "Pioneer 10 was the first spacecraft to fly past Jupiter, and Pioneer 11 the first to visit Saturn. Both carry a small golden plaque with a message from Earth.",
    load: () => import("./books/pioneers"),
  },
};

// Reading order, continuing after the three original books (Eagle, Viking 1, Voyager 1).
export const ORDER = ["surveyor", "lunar-rovers", "alsep", "sojourner", "spirit-and-opportunity", "phoenix-and-insight", "ingenuity", "near-shoemaker", "dawn", "kepler", "pioneers"];

export const storyPath = (slug) => `/stories/${slug}`;
export const worldOf = (slug) => WORLD[BOOKS[slug].world];

/** catalog id -> slug of the book that tells its story */
export const BOOK_FOR = Object.fromEntries(Object.entries(BOOKS).flatMap(([slug, b]) => b.objects.map((id) => [id, slug])));

export function nextBookAfter(slug) {
  const i = ORDER.indexOf(slug);
  if (i < 0 || i === ORDER.length - 1) return { title: "Eagle", path: "/eagle" };
  const next = ORDER[i + 1];
  return { title: BOOKS[next].title, path: storyPath(next) };
}
