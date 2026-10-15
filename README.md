# Sleeping Beauties

**Abandoned but not forgotten.**

Sleeping Beauties is an interactive space archive built with React, Vite, Three.js, and a small Express API. It explores celestial destinations and forgotten space-exploration hardware through immersive 3D experiences and archival stories.

## Features

- **Home (`/`)** — the sleeping beauties on a turning ring (drag, swipe, arrow keys or thumbnails), the three worlds, the three storybooks, and *Lost in space*, a carousel of real NASA photographs of the machines that stayed behind.
- **Storybooks** — illustrated, narrated bedtime stories for readers aged 9–15, where everything really happened, with read-along word highlighting, page-turn animation, gentle music, a fact on every page and real NASA photos:
  - **Eagle (`/eagle`)** — *The little lander who stayed* (Apollo 11, 14 pages, about 11 minutes).
  - **Viking 1 (`/viking-1`)** — *The robot under the pink sky* (Mars, 12 pages, about 9 minutes).
  - **Voyager 1 (`/voyager-1`)** — *The traveller who kept going* (deep space, 13 pages, about 9 minutes).
- **Mission files (`/eagle/mission`, `/viking-1/mission`, `/voyager-1/mission`)** — the real documentation: fact sheet, timeline in UTC, an interactive NASA 3D model with labelled parts, where it rests (or, for Voyager 1, a live map of where it is now), what was left behind or carried, NASA photos and video, a live search of NASA's Image and Video Library, and sources. Mission files open in a bright reading mode; the moon/sun button in the top bar switches to dark and the choice is remembered.
- **Finding your way back:** every storybook and mission file has a home button and a link back to its world: Eagle to the Moon (`/moon`), Viking 1 to Mars (`/mars`), Voyager 1 to Space (`/space?object=voyager-1`).
- **Deep Space (`/space`)** — an interactive solar-system experience with selectable destinations.
- **Moon (`/moon`)** and **Mars (`/mars`)** — interactive 3D globes with landing-site markers. The globes are sized to stay fully visible within the viewport.
- **Navigation** — each world gets its own branding in the header: "THE MOON", "THE MARS" or "DEEP SPACE". The navigation bar has three items: Home, Worlds (dropdown: Deep Space, Moon, Mars), and Objects (page-specific: Eagle for Moon, Viking 1 for Mars, Voyager 1 for Space). The topbar is transparent so the page content shows through.
- **Loading transitions** — navigating between pages shows an animated rocket launch sequence (with flame exhaust, smoke particles and scrolling stars) instead of a static loading message.

## Technology

- React and React Router
- Vite
- Three.js, React Three Fiber, and Drei
- Framer Motion
- Express
- MySQL (`mysql2`)

## Project structure

```text
sleeping-beauties/
├── src/
│   ├── App.jsx                  # Route table (lazy-loaded pages) and rocket loading animation
│   ├── pages/                   # Route entry points
│   │   ├── HomePage.jsx         # Home page
│   │   ├── EaglePage.jsx        # Eagle storybook + mission file
│   │   ├── VikingPage.jsx       # Viking 1 storybook + mission file
│   │   ├── VoyagerPage.jsx      # Voyager 1 storybook + mission file
│   │   ├── SpacePage.jsx, MoonPage.jsx, MarsPage.jsx
│   ├── home/                    # Home page parts (object ring, photo carousel, content, styles)
│   ├── storybook/               # Book engine: page turns, narration, read-along, illustrations
│   │   └── scenes/              # Hand-drawn SVG illustrations for each page
│   ├── mission/                 # Mission files: 3D model viewer, site map, Voyager's live map, NASA library search
│   ├── data/
│   │   ├── stories/             # Story text (eagle.json, viking.json, voyager.json) and narration timings
│   │   ├── missions/            # Mission-file facts, timelines, photos and sources
│   │   └── *.json               # Moon and Mars explorer data
│   ├── lib/nasa.js              # NASA Image and Video Library helpers
│   ├── lib/voyagerDistance.js   # Estimates Voyager 1's distance right now
│   ├── styles/fonts.css         # Self-hosted typefaces
│   ├── app/LegacyPages.jsx      # Deep Space, Moon and Mars page implementations; shared Topbar and Shell
│   └── styles.css               # All styles including rocket loading animation and transparent topbar
├── tools/
│   ├── narration/               # Rebuild the narrator audio and word timings (see its README)
│   └── music/                   # Rebuild the background lullabies (Moon, Mars, deep space)
├── server/                      # Express API
├── database/                    # MySQL schema and migrations
└── public/
    ├── audio/stories/           # Narration, one MP3 per page
    ├── audio/music/             # Background lullabies
    ├── fonts/                   # Jost, Atkinson Hyperlegible Next, Fraunces, Literata (OFL)
    ├── images/                  # Object renders, book covers, planet textures
    ├── models/                  # 3D GLB assets
    └── draco/                   # Local Draco decoder for compressed models
```

## Storybooks, narration and NASA media

- **Editing a story:** change the text in `src/data/stories/eagle.json`, `viking.json` or `voyager.json`, then rebuild the narration so the audio and the highlighted words match. Instructions are in `tools/narration/README.md`.
- **Adding a book:** each storybook is one page file in `src/pages/` that brings together its story, narration timings, illustrations, music, theme, the world it links back to and its mission file. Shared routes live in `src/storybook/books.js`.
- **Illustrations** are React SVG components in `src/storybook/scenes/` (one per page, named in each page's `scene` field).
- **Mission files** read from `src/data/missions/`. Each part of the 3D model has an `at` position in model units and an optional camera `view`. A model can also be marked `floating` (no ground shadow), hide a display stand with `clipBelow`, and frame part of itself with `target` and `span`.
- **Voyager 1's live distance** is an estimate anchored to NASA's published milestone (25.902 billion km from Earth, one light-day, on 18 November 2026 at 10:16 UTC) and its speed of about 17 km/s, with Earth's position on its orbit added in. It agrees with NASA's figures for 1998, 2004, 2012 and 2024 to within about 0.3 AU.
- **NASA photos and videos** are loaded straight from `images-assets.nasa.gov` by their NASA ID, trying smaller sizes if one is missing. Swap a picture by changing its ID. The *Search NASA's library* panel calls the public `images-api.nasa.gov` (no key needed).
- **Accessibility:** every control works from the keyboard, the narrator can be slowed down or sped up, text can be enlarged, and animations calm down when the device asks for reduced motion.

### Credits

- Photos and videos: [NASA Image and Video Library](https://images.nasa.gov/) (public domain).
- 3D models: [NASA 3D Resources](https://github.com/nasa/NASA-3D-Resources) (Apollo Lunar Module, Viking Lander, Voyager, and the object renders on the home page).
- Moon and Mars textures: [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC BY 4.0).
- Narrator voice: [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) (Apache 2.0), run locally.
- Background music: original, synthesized by `tools/music/make_lullabies.py`.
- Typefaces: Jost, Atkinson Hyperlegible Next, Fraunces and Literata (SIL Open Font License, `public/fonts/OFL.txt`).

Sleeping Beauties is an independent project for the NASA Space Apps Challenge 2026 and is not endorsed by NASA.

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm
- MySQL 8+ (only needed when using the database API)

## Install dependencies

From the project root, install the frontend dependencies with:

```powershell
npm install --legacy-peer-deps
```

**Important:** Use `npm install --legacy-peer-deps` every time you install or reinstall the root project's dependencies, including after deleting `node_modules` or when setting up a fresh checkout. A normal `npm install` can fail because of the current React / `@react-three/drei` peer-dependency conflict. Do not replace this with `--force`.

Install the API dependencies separately:

```powershell
npm install --prefix server
```

## Run the website

For frontend-only development:

```powershell
npm run dev
```

Then open <http://localhost:5173>.

To run the frontend and API together, configure MySQL first, then run:

```powershell
npm run dev:all
```

The frontend is available at <http://localhost:5173> and the API health endpoint at <http://localhost:4000/api/health>.

## MySQL setup

1. Create or select a local MySQL database.
2. Copy `server/.env.example` to `server/.env`.
3. Update `server/.env` with your local database credentials and settings.
4. Import the provided schema and seed data:

   ```powershell
   mysql -u root -p < database/sleeping_beauties_mysql.sql
   ```

5. Start the frontend and API with `npm run dev:all`.

Never commit `server/.env` or share database passwords. Keep credentials on the server; the browser must not connect directly to MySQL.

### Database-backed content

The API provides these read-only endpoints:

- `GET /api/health`
- `GET /api/bodies`
- `GET /api/artifacts`
- `GET /api/artifacts/:slug`
- `GET /api/artifacts?body=moon`

The Eagle overview requests its long story from the API and uses `src/data/eagle.json` as a fallback when the API is unavailable. Database content is reflected on subsequent API fetches; responses use a short cache period. Refresh the page to request the content again. Database content changes do not require a frontend rebuild.

The current API is read-only. Any future content-management interface should use authenticated server-side write endpoints.

## Working with the code

- **Routes:** `src/App.jsx` and the matching file in `src/pages/`.
- **Navigation bar:** the `Topbar` component in `src/app/LegacyPages.jsx`. Per-page branding is derived from the current route. The `topbar-transparent` CSS class makes the background see-through.
- **Loading animation:** the `RocketLoading` component in `src/App.jsx` and the `.rocket-*` CSS classes at the bottom of `src/styles.css`.
- **Moon and Mars 3D globes:** `src/components/planet/PlanetGlobe.jsx`. Camera distance and field of view control how large the globe appears.
- **Page implementation:** `src/app/LegacyPages.jsx` (until individual features are extracted).
- **API endpoints and SQL queries:** `server/src/routes/`.
- **Database connection:** `server/src/db.js` and local `server/.env`.
- **SQL schema and seed data:** `database/sleeping_beauties_mysql.sql`.
- **Eagle fallback content (legacy API demo):** `src/data/eagle.json`.
- **3D and audio assets:** `public/models/` and `public/audio/`.

Keep pull requests focused on one page, component, API change, or migration. Avoid adding duplicate large assets.

## Performance notes

- GLB and audio files are served as separate assets rather than bundled into JavaScript.
- Vite splits major libraries into cacheable chunks.
- Production source maps are disabled to reduce build output.
- Preserve source asset quality while avoiding unnecessary duplicates.

## GitHub team workflow

1. Pull the latest changes from the shared branch.
2. Create a feature branch, for example:

   ```powershell
   git switch -c feature/your-topic
   ```

3. Make a focused change and test it locally.
4. Before opening a pull request, run:

   ```powershell
   npm run build
   ```

5. Do not commit `node_modules/`, `dist/`, `.env` files, credentials, or local logs.
6. For changes to an already deployed database schema, add a numbered SQL migration under `database/migrations/`.

When a fresh checkout or dependency reinstall is needed, use `npm install --legacy-peer-deps` at the project root, then install the server dependencies with `npm install --prefix server`.

## Current limitations

- Page internals have not all been split into independent feature components yet.
- The API currently provides read-only endpoints.
- Production deployment, authentication, and automated database migrations are not included.
