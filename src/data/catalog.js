// One catalog of every machine in the project, built from the Moon and Mars map data, the
// deep-space probes and the field notes. The Cosmic Library, the field-notes pages, the games and the
// map sidebars all read from here, so a fact only has to be right in one place.

import lunar from "./lunar_artifacts.json";
import mars from "./mars_artifacts.json";
import { MOON_NOTES } from "./notes/moon";
import { MARS_NOTES, DEEP_NOTES } from "./notes/mars";
import { EXTRA_DEEP, EXTRA_MOON, EXTRA_NOTES } from "./notes/extra";
import { PHOTOS } from "./photos";
import { BOOKS, BOOK_FOR, storyPath } from "../storybook/library";

export const WORLDS = {
  moon: { id: "moon", name: "The Moon", short: "Moon", path: "/moon", accent: "#f2b640", blurb: "Landers, rovers and crash sites on the lunar surface." },
  mars: { id: "mars", name: "Mars", short: "Mars", path: "/mars", accent: "#f28c5e", blurb: "Landers, rovers and a helicopter on the red planet." },
  deep: { id: "deep", name: "Deep space", short: "Deep space", path: "/space", accent: "#8fd3ff", blurb: "Far from home: probes heading for the stars, one circling a dwarf planet, one resting on an asteroid." },
};

// What a visitor should understand at a glance. Each state has a plain-English label.
export const STATES = {
  awake: { id: "awake", label: "Still awake", long: "Still working and sending data to Earth.", color: "#7be0a4" },
  asleep: { id: "asleep", label: "Asleep", long: "Landed, finished its work and went quiet where it stopped.", color: "#f2b640" },
  impact: { id: "impact", label: "Planned crash", long: "Ended its mission by hitting the surface on purpose.", color: "#f28c5e" },
  adrift: { id: "adrift", label: "Adrift", long: "Silent, but still flying through space.", color: "#8fd3ff" },
};

// The three machines with narrated storybooks and full mission files.
const STORYBOOKS = {
  "apollo-11": { story: "/eagle", mission: "/eagle/mission", art: "/images/objects/eagle.webp", short: "Eagle", mission_name: "Apollo 11 (G-Class)" },
  "viking-1": { story: "/viking-1", mission: "/viking-1/mission", art: "/images/objects/viking.webp", short: "Viking 1", mission_name: "Viking 1 lander" },
  "voyager-1": { story: "/voyager-1", mission: "/voyager-1/mission", art: "/images/objects/voyager.webp", short: "Voyager 1", mission_name: "Voyager 1" },
};

// Pictures of the same design stand in for machines that have no render of their own.
const ART = {
  "ranger-7": "/images/objects/ranger7_9.png",
  "ranger-8": "/images/objects/ranger7_9.png",
  "ranger-9": "/images/objects/ranger7_9.png",
  "apollo-12": "/images/objects/apollo12_13_14(H-Class).png",
  "apollo-14": "/images/objects/apollo12_13_14(H-Class).png",
  "apollo-15": "/images/objects/apollo15_16_17(J-Class).png",
  "apollo-16": "/images/objects/apollo15_16_17(J-Class).png",
  "apollo-17": "/images/objects/apollo15_16_17(J-Class).png",
  "viking-2": "/images/objects/viking.webp",
  "surveyor-1": "/images/objects/surveyor1_3.png",
  "surveyor-3": "/images/objects/surveyor1_3.png",
  "surveyor-5": "/images/objects/surveyor7.png",
  "surveyor-6": "/images/objects/surveyor7.png",
  "surveyor-7": "/images/objects/surveyor7.png",
  "pathfinder-sojourner": "/images/objects/sojourner_pathfinder.png",
  "spirit-mer-a": "/images/objects/spirit_opportunity.png",
  "opportunity-mer-b": "/images/objects/spirit_opportunity.png",
  "curiosity-msl": "/images/objects/curiosity.png",
  "insight-lander": "/images/objects/insight.webp",
  "lunar-prospector": "/images/objects/Lunar-Prospector.png",
  "phoenix-lander": "/images/objects/phoenix.png",
  "ingenuity-helicopter": "/images/objects/ingenuity.webp",
  "perseverance-mars-2020": "/images/objects/perseverance.png",
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
  // Drawn portraits shown when a photo cannot load, so no two cards ever share a picture.
  "lrv-15": "buggy", "lrv-16": "buggy", "lrv-17": "buggy", alsep: "station",
  dawn: "dawn", "near-shoemaker": "near", kepler: "kepler",
  "apollo-11": "lm", "apollo-12": "lm", "apollo-14": "lm", "apollo-15": "lm", "apollo-16": "lm", "apollo-17": "lm",
  "viking-1": "viking", "viking-2": "viking", "spirit-mer-a": "mer", "opportunity-mer-b": "mer",
  "pioneer-10": "pioneer", "pioneer-11": "pioneer", "voyager-1": "voyager", "voyager-2": "voyager",
};

// Deep-space probes. Distances are estimates for late 2026 (Voyager 1 from NASA's live figure).
const DEEP = [
  { id: "voyager-1", name: "Voyager 1", program: "Voyager", year: 1977, launchDate: "1977-09-05", state: "awake", status: "Interstellar space; two science instruments still working", au: 173 },
  { id: "voyager-2", name: "Voyager 2", program: "Voyager", year: 1977, launchDate: "1977-08-20", state: "awake", status: "Interstellar space; three science instruments still working", au: 145 },
  { id: "pioneer-10", name: "Pioneer 10", program: "Pioneer", year: 1972, launchDate: "1972-03-02", state: "adrift", status: "Silent since 2003, still travelling", au: 140 },
  { id: "pioneer-11", name: "Pioneer 11", program: "Pioneer", year: 1973, launchDate: "1973-04-06", state: "adrift", status: "Silent since 1995, still travelling", au: 120 },
  { id: "new-horizons", name: "New Horizons", program: "New Horizons", year: 2006, launchDate: "2006-01-19", state: "awake", status: "Extended mission in the Kuiper Belt", au: 66 },
];

const NOTES = { ...MOON_NOTES, ...MARS_NOTES, ...DEEP_NOTES, ...EXTRA_NOTES };

// Every other machine in NASA's list has a storybook too; its field notes are its mission file.
function bookFor(id) {
  if (STORYBOOKS[id]) return { ...STORYBOOKS[id], ownMission: true };
  const slug = BOOK_FOR[id];
  if (!slug) return null;
  const b = BOOKS[slug];
  // A book about several machines remembers which one the reader came for, so its mission-file
  // tab opens that machine's field notes.
  const story = b.objects[0] === id ? storyPath(slug) : `${storyPath(slug)}?for=${id}`;
  return { slug, story, mission: `/object/${id}`, short: null, title: b.title, ownMission: false };
}

// Riddles for the three machines whose stories live in storybooks (the others keep theirs in the field notes).
const RIDDLES = {
  "apollo-11": "I carried the first two people to the Moon, and my lower half still stands where they left it.",
  "viking-1": "I was the first lander to work on Mars, and I took the first photograph from its surface.",
  "voyager-1": "I am the most distant human-made object, and I carry a golden record of Earth's sounds and pictures.",
};

const NSSDC_IDS = { "apollo-11": "1969-059C", "viking-1": "1975-075C", "voyager-1": "1977-084A" };

// NASA's own page for each machine that the map data does not already link to. Each field-notes
// page lists it under "Sources", next to the NSSDCA record.
const SCI = (slug) => `https://science.nasa.gov/mission/${slug}/`;
const MISSION_PAGES = {
  "apollo-11": "https://www.nasa.gov/mission/apollo-11/",
  "apollo-12": "https://www.nasa.gov/mission/apollo-12/",
  "apollo-14": "https://www.nasa.gov/mission/apollo-14/",
  "apollo-15": "https://www.nasa.gov/mission/apollo-15/",
  "apollo-16": "https://www.nasa.gov/mission/apollo-16/",
  "apollo-17": "https://www.nasa.gov/mission/apollo-17/",
  "surveyor-1": SCI("surveyor-1"), "surveyor-3": SCI("surveyor-3"), "surveyor-5": SCI("surveyor-5"), "surveyor-6": SCI("surveyor-6"), "surveyor-7": SCI("surveyor-7"),
  "ranger-7": SCI("ranger-7"), "ranger-8": SCI("ranger-8"), "ranger-9": SCI("ranger-9"),
  "lunar-prospector": SCI("lunar-prospector"),
  "lrv-15": "https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html",
  "lrv-16": "https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html",
  "lrv-17": "https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html",
  alsep: "https://www.nasa.gov/history/alsj/",
  "voyager-1": SCI("voyager/voyager-1"), "voyager-2": SCI("voyager/voyager-2"),
  "pioneer-10": SCI("pioneer-10"), "pioneer-11": SCI("pioneer-11"),
  "new-horizons": SCI("new-horizons"),
  dawn: SCI("dawn"), "near-shoemaker": SCI("near-shoemaker"), kepler: SCI("kepler"),
};

function stateOf(a) {
  if (a.statusCategory === "active") return "awake";
  if (a.statusCategory === "impact") return "impact";
  return "asleep";
}

function build(a, world) {
  const book = bookFor(a.id);
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
    nasaUrl: a.readMoreUrl || MISSION_PAGES[a.id] || null,
    nssdc: note?.nssdc || NSSDC_IDS[a.id] || null,
    tagline: note?.tagline || null,
    riddle: note?.riddle || RIDDLES[a.id] || null,
    note,
    book: book || null,
    art: book?.art || ART[a.id] || null,
    glyph: GLYPH[a.id] || null,
    photo: PHOTOS[a.id] || null,
    place: a.place || null,
    noMap: !!a.noMap,
    // Where "Read the story" goes: a storybook if one exists, otherwise the field notes.
    route: book ? book.story : `/object/${a.id}`,
    hasStorybook: !!book,
    // Eagle, Viking 1 and Voyager 1 have their own mission files instead of field notes.
    hasMissionFile: !!book?.ownMission,
  };
}

export const CATALOG = [
  ...lunar.map((a) => build(a, "moon")),
  ...EXTRA_MOON.map((a) => build(a, "moon")),
  ...mars.map((a) => build(a, "mars")),
  ...[...DEEP, ...EXTRA_DEEP].map((a) => build(a, "deep")),
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

// A render used by more than one machine is never the fallback for a photo that fails to load
// (the machine's own drawn portrait is used instead), so no two cards ever look the same.
const ART_USERS = {};
CATALOG.forEach((c) => {
  if (c.art) ART_USERS[c.art] = (ART_USERS[c.art] || 0) + 1;
});
CATALOG.forEach((c) => {
  c.artShared = Boolean(c.art) && ART_USERS[c.art] > 1;
});

export const BY_ID = Object.fromEntries(CATALOG.map((c) => [c.id, c]));
export const withNotes = () => CATALOG.filter((c) => c.note);

// The Moon map marks landing sites. The rovers and the Apollo 12 listening station have
// storybooks under their own catalog ids, so their sites lead to those books.
const SITE_BOOK = { "apollo-12": "alsep", "apollo-15": "lrv-15", "apollo-16": "lrv-16", "apollo-17": "lrv-17" };

/** The storybook a map marker leads to, as { title, path }, or null if it has none. */
export function storybookAt(markerId) {
  const own = BY_ID[markerId];
  const entry = own?.hasStorybook ? own : BY_ID[SITE_BOOK[markerId]];
  if (!entry?.hasStorybook) return null;
  return { title: entry.book.title || entry.short, path: entry.route };
}

/** How many machines each 3D world map shows (the Cosmic Library also lists rovers, stations and far explorers). */
export function mapCounts() {
  return { moon: lunar.length, mars: mars.length, deep: DEEP.length };
}

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
