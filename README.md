# Sleeping Beauties

**Abandoned but not forgotten.**

Sleeping Beauties is an interactive space archive built with React, Vite, Three.js, and a small Express API. It explores celestial destinations and forgotten space-exploration hardware through immersive 3D experiences and archival stories.

## Features

- **Landing page (`/`)** — a minimal introduction with “Abandoned but not forgotten” and “Explore the Sleeping Beauties”.
- **Deep Space (`/space`)** — an interactive solar-system experience with selectable destinations.
- **Moon (`/moon`)** — an interactive 3D Moon experience and Apollo 11 landing-site marker.
- **Mars (`/mars`)** — an interactive 3D Mars experience and Viking 1 landing-site marker.
- **Eagle (`/eagle`)** — a chapter-based Apollo Lunar Module story.
- **Shared visual language** — starry space backgrounds and cinematic transitions between destinations.

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
│   ├── App.jsx                  # Route table
│   ├── pages/                   # Route entry points
│   │   ├── HomePage.jsx         # Landing page
│   │   ├── SpacePage.jsx        # Interactive deep-space page
│   │   ├── MoonPage.jsx
│   │   ├── MarsPage.jsx
│   │   └── EaglePage.jsx
│   ├── app/
│   │   └── LegacyPages.jsx      # Existing page implementations
│   ├── components/
│   │   └── MoonMap.jsx          # Moon and Mars 3D visualizations
│   ├── services/
│   │   └── archiveApi.js        # Browser API client
│   ├── data/
│   │   └── eagle.json           # Eagle offline/fallback content
│   └── styles.css
├── server/
│   ├── src/
│   │   ├── index.js             # API bootstrap and middleware
│   │   ├── db.js                # MySQL connection pool
│   │   └── routes/
│   │       └── archive.js       # Archive read endpoints
│   └── .env.example
├── database/
│   ├── sleeping_beauties_mysql.sql
│   └── migrations/
└── public/
    ├── models/                  # 3D GLB assets
    └── audio/                   # Audio assets
```

`src/pages/` provides clear route entry points. The current page implementations are still largely kept in `src/app/LegacyPages.jsx` to preserve the existing experience; they can be extracted into smaller feature components incrementally.

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
- **Moon and Mars 3D scenes:** `src/components/MoonMap.jsx`.
- **Page implementation:** `src/app/LegacyPages.jsx` (until individual features are extracted).
- **API endpoints and SQL queries:** `server/src/routes/`.
- **Database connection:** `server/src/db.js` and local `server/.env`.
- **SQL schema and seed data:** `database/sleeping_beauties_mysql.sql`.
- **Eagle fallback content:** `src/data/eagle.json`.
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
