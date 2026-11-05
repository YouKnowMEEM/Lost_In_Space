// One catalog of every machine in the project, built from the Moon and Mars map data, the
// deep-space probes and the field notes. The Atlas, the field-notes pages, the games and the
// map sidebars all read from here, so a fact only has to be right in one place.

import lunar from "./lunar_artifacts.json";
import mars from "./mars_artifacts.json";
import { MOON_NOTES } from "./notes/moon";
import { MARS_NOTES, DEEP_NOTES } from "./notes/mars";

export const WORLDS = {
  moon: { id: "moon", name: "The Moon", short: "Moon", path: "/moon", accent: "#f2b640", blurb: "Landers, rovers and crash sites on the lunar surface." },
  mars: { id: "mars", name: "Mars", short: "Mars", path: "/mars", accent: "#f28c5e", blurb: "Landers, rovers and a helicopter on the red planet." },
  deep: { id: "deep", name: "Deep space", short: "Deep space", path: "/space", accent: "#8fd3ff", blurb: "Probes still travelling beyond the planets." },
};

// What a visitor should understand at a glance. Each state has a plain-English label.
export const STATES = {
  awake: { id: "awake", label: "Still awake", long: "Still working and sending data to Earth.", color: "#7be0a4" },
  asleep: { id: "asleep", label: "Asleep", long: "Landed, finished its work and went quiet where it stopped.", color: "#f2b640" },
  impact: { id: "impact", label: "Planned crash", long: "Ended its mission by hitting the surface on purpose.", color: "#f28c5e" },
  adrift: { id: "adrift", label: "Adrift", long: "Silent, but still flying through space.", color: "#8fd3ff" },
};

// The three machines that already have narrated storybooks and mission files.
const STORYBOOKS = {
  "apollo-11": { story: "/eagle", mission: "/eagle/mission", art: "/images/objects/eagle.webp", short: "Eagle", mission_name: "Apollo 11" },
  "viking-1": { story: "/viking-1", mission: "/viking-1/mission", art: "/images/objects/viking.webp", short: "Viking 1", mission_name: "Viking 1 lander" },
  "voyager-1": { story: "/voyager-1", mission: "/voyager-1/mission", art: "/images/objects/voyager.webp", short: "Voyager 1", mission_name: "Voyager 1" },
};

// Pictures of the same design stand in for machines that have no render of their own.
const ART = {
  "apollo-12": "/images/objects/eagle.webp",
  "apollo-14": "/images/objects/eagle.webp",
  "apollo-15": "/images/objects/eagle.webp",
  "apollo-16": "/images/objects/eagle.webp",
  "apollo-17": "/images/objects/eagle.webp",
  "viking-2": "/images/objects/viking.webp",
  "spirit-mer-a": "/images/objects/opportunity.webp",
  "opportunity-mer-b": "/images/objects/opportunity.webp",
  "insight-lander": "/images/objects/insight.webp",
  "ingenuity-helicopter": "/images/objects/ingenuity.webp",
  "voyager-2": "/images/objects/voyager.webp",
  "pioneer-10": "/images/objects/pioneer.webp",
  "pioneer-11": "/images/objects/pioneer.webp",
};
// Machines drawn as little illustrations (see site/Glyphs.jsx).
const GLYPH = {
  "surveyor-1": "surveyor", "surveyor-3": "surveyor", "surveyor-5": "surveyor", "surveyor-6": "surveyor", "surveyor-7": "surveyor",
  "ranger-7": "ranger", "ranger-8": "ranger", "ranger-9": "ranger",
  "lunar-prospector": "prospector",
  "pathfinder-sojourner": "pathfinder",
  "curiosity-msl": "rover", "perseverance-mars-2020": "rover",
  "phoenix-lander": "phoenix",
  "new-horizons": "horizons",
};

// Deep-space probes. Distances are estimates for late 2026 (Voyager 1 from NASA's live figure).
const DEEP = [
  { id: "voyager-1", name: "Voyager 1", program: "Voyager", year: 1977, launchDate: "1977-09-05", state: "awake", status: "Interstellar space; two science instruments still working", au: 173 },
  { id: "voyager-2", name: "Voyager 2", program: "Voyager", year: 1977, launchDate: "1977-08-20", state: "awake", status: "Interstellar space; three science instruments still working", au: 145 },
  { id: "pioneer-10", name: "Pioneer 10", program: "Pioneer", year: 1972, launchDate: "1972-03-02", state: "adrift", status: "Silent since 2003, still travelling", au: 140 },
  { id: "pioneer-11", name: "Pioneer 11", program: "Pioneer", year: 1973, launchDate: "1973-04-06", state: "adrift", status: "Silent since 1995, still travelling", au: 120 },
  { id: "new-horizons", name: "New Horizons", program: "New Horizons", year: 2006, launchDate: "2006-01-19", state: "awake", status: "Extended mission in the Kuiper Belt", au: 66 },
];

const NOTES = { ...MOON_NOTES, ...MARS_NOTES, ...DEEP_NOTES };

// Riddles for the three machines whose stories live in storybooks (the others keep theirs in the field notes).
const RIDDLES = {
  "apollo-11": "I carried the first two people to the Moon, and my lower half still stands where they left it.",
  "viking-1": "I was the first lander to work on Mars, and I took the first photograph from its surface.",
  "voyager-1": "I am the most distant human-made object, and I carry a golden record of Earth's sounds and pictures.",
};

const NSSDC_IDS = { "apollo-11": "1969-059C", "viking-1": "1975-075C", "voyager-1": "1977-084A" };

function stateOf(a) {
  if (a.statusCategory === "active") return "awake";
  if (a.statusCategory === "impact") return "impact";
  return "asleep";
}

function build(a, world) {
  const book = STORYBOOKS[a.id];
  const note = NOTES[a.id] || null;
  return {
    id: a.id,
    world,
    name: a.name,
    short: book?.short || note?.short || a.name,
    mission: book?.mission_name || note?.mission || a.name,
    program: a.program,
    year: a.year,
    launchDate: a.launchDate,
    landingDate: a.landingDate,
    state: a.state || stateOf(a),
    status: a.status,
    type: a.equipmentType,
    lat: a.lat,
    lon: a.lon,
    au: a.au,
    description: a.description,
    nasaUrl: a.readMoreUrl,
    nssdc: note?.nssdc || NSSDC_IDS[a.id] || null,
    tagline: note?.tagline || null,
    riddle: note?.riddle || RIDDLES[a.id] || null,
    note,
    book: book || null,
    art: book?.art || ART[a.id] || null,
    glyph: GLYPH[a.id] || null,
    // Where "Read the story" goes: a storybook if one exists, otherwise the field notes.
    route: book ? book.story : `/object/${a.id}`,
    hasStorybook: !!book,
  };
}

export const CATALOG = [
  ...lunar.map((a) => build(a, "moon")),
  ...mars.map((a) => build(a, "mars")),
  ...DEEP.map((a) => build(a, "deep")),
];

// Voyager 1's tagline lives with its storybook.
const TAGS = {
  "apollo-11": "The little lander who stayed.",
  "viking-1": "The robot that opened its eyes on Mars.",
  "voyager-1": "The traveller who kept going.",
};
CATALOG.forEach((c) => {
  if (!c.tagline && TAGS[c.id]) c.tagline = TAGS[c.id];
});

export const BY_ID = Object.fromEntries(CATALOG.map((c) => [c.id, c]));
export const withNotes = () => CATALOG.filter((c) => c.note);

export function worldCounts() {
  const out = { moon: 0, mars: 0, deep: 0 };
  CATALOG.forEach((c) => (out[c.world] += 1));
  return out;
}

export function stateCounts() {
  const out = { awake: 0, asleep: 0, impact: 0, adrift: 0 };
  CATALOG.forEach((c) => (out[c.state] += 1));
  return out;
}

/** Prev / next machine in the same world, ordered by year, for the "keep exploring" row. */
export function neighbours(id) {
  const me = BY_ID[id];
  if (!me) return {};
  const list = CATALOG.filter((c) => c.world === me.world).sort((a, b) => a.year - b.year || a.name.localeCompare(b.name));
  const i = list.findIndex((c) => c.id === id);
  return { prev: list[i - 1] || list[list.length - 1], next: list[i + 1] || list[0] };
}

/** Radio signals travel at light speed: one astronomical unit is about 8.3 light-minutes. */
export function signalHours(au) {
  return (au * 8.317) / 60;
}

export const NSSDC_URL = (cospar) => `https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=${cospar}`;
export const NASA_LIBRARY_URL = (q) => `https://images.nasa.gov/search?q=${encodeURIComponent(q)}`;
