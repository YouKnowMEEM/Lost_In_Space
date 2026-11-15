# Sleeping Beauties
 
**Bedtime stories of the machines NASA left behind.**
 
Sleeping Beauties is a free website for young readers (about 9 to 15 years old) and the grown-ups who read with them. Many spacecraft finished their work and simply stayed where they stopped: on the Moon, on Mars and far out among the stars. The website turns each of these machines into a character with its own true story, told as an illustrated, read-aloud bedtime book. Behind every story is the real science: NASA 3D models, photos, mission timelines and a source for every fact.
 
- **Live website:** <https://sleepingbeauties.vercel.app>
- **Made for:** NASA Space Apps Challenge 2026, challenge *"Abandoned but not forgotten: NASA's discarded equipment storytelling"*
- **Made by:** Team LostInSpace
- **Contact:** team.lostinspace.6@gmail.com
Sleeping Beauties is an independent project. NASA has not endorsed it.
 
## Contents
 
- [What you can do](#what-you-can-do)
- [Pages and links](#pages-and-links)
- [Real science, with sources](#real-science-with-sources)
- [Accessibility](#accessibility)
- [Built with](#built-with)
- [Run it on your computer](#run-it-on-your-computer)
- [Deploy](#deploy)
- [Project structure](#project-structure)
- [Working on the content](#working-on-the-content)
- [Credits](#credits)
- [Use of AI](#use-of-ai)
- [Team](#team)
- [Still to do](#still-to-do)
- [Licence](#licence)
## What you can do
 
### Take the guided journey
 
Press **Start the Journey!** on the home page. The team's opening film plays, then a short tour starts on the solar-system page. It shows how to fly (zoom in and out, drag to turn), points out the Cosmic Library and asks you to find Mars. On Mars it asks you to find Viking 1 by turning the globe, and shows the search bar as a shortcut.
 
### Explore three 3D worlds
 
- **Deep space** (`/space`): the solar system, with a pop-up for the Sun, each planet and Pluto that links to its NASA Science page, and the probes that are leaving it (Voyager 1 and 2, Pioneer 10 and 11, New Horizons). The solar system is not drawn to scale.
- **The Moon** (`/moon`) and **Mars** (`/mars`): globes you can turn and zoom, with a marker on every machine that landed or crashed there. Machines that have a storybook glow gold. Each world has a search box, a list of its machines and an **Objects** menu with all of its storybooks.
### Read fourteen true storybooks
 
Each book tells the true story of one machine (or a small family of machines) in short, clear sentences. Nothing in them is made up.
 
- **The Moon:** *Eagle: The little lander who stayed*, *Surveyor: The robots who tested the Moon*, *Three Moon Buggies: The cars parked on the Moon*, *The Listening Stations: Science boxes that stayed on the Moon*
- **Mars:** *Viking 1: The robot under the pink sky*, *Sojourner: The first rover on Mars*, *Spirit & Opportunity: The twin rovers who kept going*, *Phoenix & InSight: The digger and the listener*, *Ingenuity: The little helicopter that flew on Mars*
- **Deep space:** *Voyager 1: The traveller who kept going*, *NEAR Shoemaker: The spacecraft that landed on an asteroid*, *Dawn: The explorer with a gentle blue engine*, *Kepler: The telescope that counted planets*, *Pioneer 10 & 11: The first travellers to the giant planets*
In every book you can:
 
- have the book **read aloud**, with each word lighting up as it is spoken, or read it yourself;
- slow the voice down or speed it up, make the words bigger, let the pages **turn by themselves**, and switch the gentle music on or off;
- see a **real NASA photo**, a *Did you know?* fact and the **sources** for that page's facts;
- jump to any chapter, and go straight to the next book from the last page.
On wide screens the book opens as a two-page spread with page-turn animation; on phones and tablets it shows one page at a time. *Eagle* and *Viking 1* also include the team's animated films of their missions.
 
### Open the mission files
 
*Eagle*, *Viking 1* and *Voyager 1* each have a full **mission file** (`/eagle/mission`, `/viking-1/mission`, `/voyager-1/mission`): a fact sheet, a timeline in UTC, an interactive **NASA 3D model** with numbered parts, where the machine rests (for Voyager 1, a live estimate of where it is now), what was left behind or carried on board, NASA photos and video, a live search of NASA's Image and Video Library, and sources. Mission files open in a bright reading mode; the moon/sun button switches to dark mode and the choice is remembered.
 
### Read the field notes
 
Thirty-four more machines have **field notes** (`/object/<id>`): a short story in the machine's own voice, why it was sent, what it discovered, how its hardware made that possible, where it is now, NASA photos and sources. The *Mission file* tab of the eleven newer storybooks opens these notes.
 
### Browse the Cosmic Library
 
The **Cosmic Library** (`/library`) shows all 37 machines on one timeline, with search, filters by world and by status (*still awake*, *asleep*, *planned crash*, *adrift*) and sorting. Filters stay in the address, so a view such as `/library?world=mars&state=awake` can be shared.
 
### Play and learn
 
On **Play** (`/play`):
 
- **Signal Hunter:** a machine has gone quiet somewhere on the surface. Spin the globe and send radio pings: the colder the signal, the farther away you are. Find five machines to finish a round, on the Moon or on Mars.
- **Who am I?:** a machine speaks in a riddle; guess which one it is. Eight riddles each time, in a new order.
### Find every source
 
The **About** page (`/about`) explains how to explore, how the facts were checked, what we corrected, the accessibility features, ideas for teachers and families, and lists every citation and credit.
 
While a page loads, a small animated rocket flies through the stars.
 
## Pages and links
 
- `/`: home: the sleeping machines on a turning ring, the three worlds, the bookshelf of all fourteen books, the Cosmic Library and a carousel of real NASA photos
- `/space`, `/moon`, `/mars`: the three 3D worlds
- `/eagle`, `/viking-1`, `/voyager-1`: the three main storybooks, with `/mission` after each for the mission file
- `/stories/<book>`: the eleven newer storybooks: `surveyor`, `lunar-rovers`, `alsep`, `sojourner`, `spirit-and-opportunity`, `phoenix-and-insight`, `ingenuity`, `near-shoemaker`, `dawn`, `kepler`, `pioneers`
- `/object/<id>`: field notes for one machine
- `/library`: the Cosmic Library
- `/play`: Signal Hunter and Who am I?
- `/about`: about the project, sources and credits
- Any other address shows a friendly "Lost in space" page.
Links that open a page in a particular state:
 
- `/moon?focus=<id>` and `/mars?focus=<id>` open the globe pointed at one machine, for example `/mars?focus=curiosity-msl`.
- `/space?probe=<id>` (or `?object=<id>`) selects a probe: `voyager-1`, `voyager-2`, `pioneer-10`, `pioneer-11` or `new-horizons`.
- `/moon?game=signal-hunter` and `/mars?game=signal-hunter` start the game.
- `/stories/<book>?for=<id>` picks one machine of a shared book, for example `/stories/spirit-and-opportunity?for=opportunity-mer-b`.
- `/library` accepts `world`, `state`, `sort` and `q` (search).
- Old addresses still work: `/atlas` opens the Cosmic Library, `/viking` opens `/viking-1` and `/voyager` opens `/voyager-1`.
## Real science, with sources
 
- **Facts come from NASA first.** We started from NASA's resource list for the challenge, then NASA's Space Science Data Coordinated Archive (NSSDCA) records, NASA Science pages and the NASA Image and Video Library.
- **Every storybook page names its sources**, and each book's chapter list shows all of the book's sources. All citations live in `src/data/citations.js` and are listed on the About page.
- **Real photos, one per machine.** Photos load from NASA's servers by their NASA ID. If a photo cannot be reached, the card shows its own drawn portrait instead.
- **Real 3D models** of the Apollo Lunar Module, the Viking lander and Voyager come from NASA 3D Resources.
- **Voyager 1's live distance** is an estimate anchored to NASA's published milestone (one light-day, about 25.9 billion km from Earth, on 18 November 2026 at 10:16 UTC) and its speed of about 17 km/s, with Earth's position on its orbit added in. It agrees with NASA's figures for 1998, 2004, 2012 and 2024 to within about 0.3 AU.
- **We corrected the original map data:**
  - Opportunity's longitude was stored as -354.47, which plotted about 11 degrees east of the real site; it is now 5.53° W (354.47° E).
  - Lunar Prospector's impact longitude had the wrong sign; it is now 87.7° S, 42.1° E.
  - Curiosity and Perseverance were marked as intact rather than active, so the *Active* filter on Mars was empty.
  - Story links for Apollo 12 to 17, the Surveyors and the Mars rovers pointed to pages that did not exist; every machine now opens its own page.
## Accessibility
 
- Reading uses Atkinson Hyperlegible Next, a typeface the Braille Institute designed to be as easy to read as possible.
- Every storybook page can be read aloud with each word highlighted as it is spoken. The voice can be slowed down or sped up, and the words made bigger.
- Everything works with a keyboard. "Skip to the content" is the first thing a screen reader finds, and focus is always visible.
- Every picture has a text description, and status is always written as a word, never shown only as a colour.
- Motion calms down when the device asks for reduced motion.
- The 3D maps also have a text search and a list of every machine.
- Nothing flashes. There are no accounts, no adverts and no trackers.
## Built with
 
- **Website:** React 19, React Router 7, Vite 7
- **3D:** three.js, React Three Fiber, drei and React Three postprocessing
- **Animation and state:** Framer Motion, Zustand
- **Icons:** Lucide
- **Optional API:** Node.js with Express and MySQL (`mysql2`)
- **Tools:** Python, NumPy and FFmpeg for the narration and music builders
## Run it on your computer
 
### Requirements
 
- Node.js 20.19 or newer (or 22.12 or newer)
- npm
- MySQL 8 or newer, only if you want to run the optional API
### Install and start
 
From the project folder:
 
```bash
npm install --legacy-peer-deps
npm run dev
```
 
Then open <http://localhost:5173>.
 
Always install with `npm install --legacy-peer-deps`, including after deleting `node_modules` or on a fresh copy. A plain `npm install` can stop because of a peer-dependency conflict between React and `@react-three/drei`. Do not use `--force` instead.
 
### Build for production
 
```bash
npm run build      # creates the dist/ folder
npm run preview    # serves dist/ locally to check it
```
 
### Optional: the database API
 
The website runs without it. The API is a small read-only Express server with a MySQL database of the machines. It comes from an earlier version of the project, and only older, unused code in `src/app/LegacyPages.jsx` calls it.
 
1. Install the API's packages: `npm install --prefix server`
2. Copy `server/.env.example` to `server/.env` and fill in your database details. Never commit `server/.env`.
3. Import the schema and sample data: `mysql -u root -p < database/sleeping_beauties_mysql.sql`
4. Start the website and the API together: `npm run dev:all` (or the API alone: `npm run dev:api`)
The API answers at <http://localhost:4000/api/health>, with `GET /api/bodies`, `GET /api/artifacts`, `GET /api/artifacts?body=moon` and `GET /api/artifacts/:slug`. If it runs somewhere else, set `VITE_API_URL` for the website. More detail is in `database/README.md`.
 
## Deploy
 
The live site is hosted on **Vercel** as a static Vite site:
 
- Build command: `npm run build`
- Output folder: `dist`
- If the install step fails on peer dependencies, set the install command to `npm install --legacy-peer-deps`.
`vercel.json` sends every page address to `index.html` (so links such as `/mars` work when the page is refreshed) and lets browsers cache the built files, models, audio, video and fonts. `public/_redirects` does the same job on Netlify.
 
## Project structure
 
```text
SleepingBeauties/
├── index.html
├── vite.config.js           # build settings (three.js, React and icons go into their own files)
├── vercel.json              # page addresses and caching on Vercel
├── public/
│   ├── audio/stories/       # recorded narration for Eagle, Viking 1 and Voyager 1 (one MP3 per page)
│   ├── audio/music/         # the three lullabies (Moon, Mars, deep space)
│   ├── video/               # the team's films: opening film, Eagle and Viking 1 journeys
│   ├── models/              # 3D models (.glb) and planet textures
│   ├── images/              # covers, renders and other pictures
│   ├── fonts/               # self-hosted typefaces (SIL Open Font License)
│   └── draco/               # decoder for the compressed 3D models
├── src/
│   ├── main.jsx, App.jsx    # start-up and the list of pages (each page loads only when needed)
│   ├── pages/               # one file per page
│   ├── app/LegacyPages.jsx  # the deep-space, Moon and Mars pages and the shared top bar
│   ├── components/          # guided tour, opening film, Signal Hunter, globe parts (planet/)
│   ├── home/                # home page parts: the machine ring and the photo carousel
│   ├── storybook/           # the book reader: page turns, narration, read-along, illustrations
│   │   ├── scenes/          # the hand-drawn SVG illustrations, one per page
│   │   ├── books/           # the eleven newer books, each loaded only when opened
│   │   └── library.js       # titles, worlds and reading order of the eleven newer books
│   ├── mission/             # mission files: 3D model viewer, site map, Voyager's live map, NASA search
│   ├── site/                # shared header and footer, drawn portraits, widgets, riddle game
│   ├── data/
│   │   ├── stories/         # the text of all fourteen books, and word timings for the recorded ones
│   │   ├── missions/        # mission-file facts, timelines, 3D model settings, photos and sources
│   │   ├── notes/           # field notes for the 34 machines without a mission file
│   │   ├── catalog.js       # all 37 machines in one list (used by the library, games and maps)
│   │   ├── citations.js     # every source, with the pages that use it
│   │   ├── photos.js        # one checked NASA photo per machine
│   │   └── *.json           # Moon and Mars map data
│   ├── lib/                 # NASA image helpers and the Voyager 1 distance estimate
│   ├── services/            # client for the optional API
│   └── styles.css, styles/  # styles and fonts
├── tools/
│   ├── narration/           # rebuild the recorded narration and word timings
│   └── music/               # rebuild the lullabies
├── server/                  # optional Express API (read-only)
└── database/                # MySQL schema, sample data and migrations for the API
```
 
## Working on the content
 
- **Edit a recorded book** (*Eagle*, *Viking 1*, *Voyager 1*): change its text in `src/data/stories/`, then rebuild its narration so the audio and the highlighted words still match. The steps are in `tools/narration/README.md`. The narration is made offline with the Kokoro-82M voice; nothing is sent to an online service.
- **Edit one of the eleven newer books:** change `src/data/stories/<book>.json`. These books are read by the browser's own voice, so no audio needs rebuilding.
- **Add a new book:** write `src/data/stories/<book>.json` (same shape as the others; a page's `photo` can name a machine with `"of": "<catalog id>"`), draw its scenes in `src/storybook/scenes/`, add a module in `src/storybook/books/` and list it in `src/storybook/library.js`. Add its sources to `src/data/citations.js` and give each page a `sources` list. The catalog, Cosmic Library, home bookshelf, Objects menus, golden map markers and About page pick it up automatically.
- **Add a machine:** add it to `src/data/lunar_artifacts.json` or `mars_artifacts.json` (or to `DEEP` in `src/data/catalog.js` for a deep-space probe) with `storyPath: "/object/<id>"`. Add its field notes to `src/data/notes/` under the same `id`, and give it a picture (`ART` in `catalog.js`, or a drawn portrait from `src/site/Glyphs.jsx`). It then appears in the Cosmic Library, the timeline, the games and the map lists.
- **Mission-file 3D models** are set up in `src/data/missions/<book>.js`. Each numbered part has an `at` position in the model's own units and an optional camera `view`. A model can be `floating` (no ground shadow), hide named pieces such as a display stand with `hide`, or cut off everything below a height with `clipBelow`, and it can frame one part of itself with `target` and `span`.
- **NASA photos and videos** are chosen by their NASA ID (in `src/data/photos.js` and the mission files) and load from `images-assets.nasa.gov`. The *Search NASA's library* panel uses the public `images-api.nasa.gov` (no key needed).
- **Music:** the three lullabies are made by `tools/music/make_lullabies.py`.
- **Where things live:** the list of pages is in `src/App.jsx`; the deep-space, Moon and Mars pages are in `src/app/LegacyPages.jsx` and `src/pages/`; the globes are in `src/components/planet/PlanetGlobe.jsx`; the loading screen is the `RocketLoading` component used by `src/App.jsx`.
## Credits
 
- **Photos and videos:** [NASA Image and Video Library](https://images.nasa.gov/), [NSSDCA Photo Gallery](https://nssdc.gsfc.nasa.gov/photo_gallery/) and [NASA Science](https://science.nasa.gov/). NASA media are generally not copyrighted; see [NASA's media usage guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/).
- **3D models:** [NASA 3D Resources](https://github.com/nasa/NASA-3D-Resources): the Apollo Lunar Module, the Viking lander, Voyager, and the pictures of the machines on the home page.
- **Moon, Mars and planet surfaces:** [Solar System Scope textures](https://www.solarsystemscope.com/textures/) (CC BY 4.0).
- **Landing and impact coordinates:** [NASA Space Science Data Coordinated Archive](https://nssdc.gsfc.nasa.gov/).
- **Films:** the opening film of the guided journey and the Eagle and Viking 1 animations were made by Team LostInSpace, following NASA's mission timelines.
- **Narration:** [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) (Apache 2.0), run on our own computer, for *Eagle*, *Viking 1* and *Voyager 1*. The other books use the speech voice built into the reader's browser.
- **Music:** three original lullabies (Moon, Mars and deep space), synthesized for this website, with no samples.
- **Illustrations:** the storybook pictures, their covers and the drawn machine portraits were made for this website.
- **Typefaces:** Jost, [Atkinson Hyperlegible Next](https://www.brailleinstitute.org/freefont/) (Braille Institute), Fraunces and Literata, all under the SIL Open Font License (`public/fonts/OFL.txt`).
- **Software:** React, React Router, Vite, Zustand, three.js, React Three Fiber, drei, React Three postprocessing, Framer Motion, Lucide, Node.js, Express and MySQL, all open source.
## Use of AI
 
- The recorded narration of *Eagle*, *Viking 1* and *Voyager 1* is AI-generated speech, made with the open Kokoro-82M text-to-speech model.
- We used an AI assistant (Claude, by Anthropic) to help write code and polish text. Every fact was checked against the sources listed on the About page.
## Team
 
Team LostInSpace:
 
- Anika Tahsin Prithi
- Chayan Datta
- S. M. Sabiqun Meem
- Abidur Rahman
- Sumaiya Islam Chhoya
- Md. Sazzad Hossain Rupok
Website developed by **Chayan Datta** (https://github.com/Chayan4-4) and **S. M. Sabiqun Meem** (https://github.com/YouKnowMEEM/).
 
Suggestions and comments are welcome at **team.lostinspace.6@gmail.com**.
 
## Still to do
 
- Record narration for the eleven newer books (today they use the browser's voice).
- Note where these files came from and credit them: `public/models/sun.glb`, `pioneer.glb`, `New_Horizons.glb`, `perseverance.glb`, `stars.jpeg` and `moon_mars_background.jpg`.
- Make the open book larger on small laptop screens (1366 × 768), where some pages need a short scroll.
- Split `src/app/LegacyPages.jsx` into smaller files and remove its older pages that are no longer used.
## Licence
 
The project does not have an open-source licence file yet, so please ask the team before reusing its own code, text or pictures. NASA material is used under NASA's media guidelines, the textures under CC BY 4.0 and the typefaces under the SIL Open Font License.
 
Claude finished the response
