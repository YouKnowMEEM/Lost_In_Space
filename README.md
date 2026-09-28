# Sleeping Beauties

A React + Vite interactive archive for forgotten space exploration hardware.

## Project structure

```text
sleeping-beauties/
├── src/
│   ├── App.jsx                  # Route table only
│   ├── pages/                   # One route entry per destination
│   │   ├── HomePage.jsx
│   │   ├── MoonPage.jsx
│   │   ├── MarsPage.jsx
│   │   ├── EaglePage.jsx
│   │   └── AboutPage.jsx
│   ├── app/
│   │   └── LegacyPages.jsx      # Existing page implementations (refactor incrementally)
│   ├── components/
│   │   └── MoonMap.jsx          # Reusable map/planet surface visualizations
│   ├── services/
│   │   └── archiveApi.js        # Browser API client
│   ├── data/
│   │   └── eagle.json          # Offline/fallback Eagle copy
│   └── styles.css
├── server/
│   ├── src/
│   │   ├── index.js             # API bootstrap and middleware
│   │   ├── db.js                # MySQL connection pool
│   │   └── routes/archive.js    # Archive read endpoints
│   └── .env.example
├── database/
│   └── sleeping_beauties_mysql.sql
└── public/
    ├── models/                  # Large GLB assets; keep out of JS bundles
    └── audio/
```

### Editing safely as a team

- Route changes: edit `src/App.jsx` or the corresponding file in `src/pages/`.
- Moon/Mars maps: `src/components/MoonMap.jsx`.
- Database queries/API endpoints: `server/src/routes/`.
- Database connection settings: `server/.env` (never commit this file).
- SQL schema and seed data: `database/sleeping_beauties_mysql.sql`.
- Eagle fallback content: `src/data/eagle.json`.
- 3D assets: `public/models/`; audio assets: `public/audio/`.

`src/app/LegacyPages.jsx` currently holds the original page implementations to preserve the working design during this first restructuring pass. The route files provide clear entry points, but page internals can be extracted into dedicated feature components in later, small pull requests.

## Requirements

- Node.js 20.19+ (or 22.12+)
- MySQL 8+

## Install and run

```bash
npm install
npm install --prefix server
cp server/.env.example server/.env
# Edit server/.env with your local MySQL credentials.
mysql -u root -p < database/sleeping_beauties_mysql.sql
npm run dev:all
```

Frontend: http://localhost:5173  
API health: http://localhost:4000/api/health

For frontend-only work, `npm run dev` is sufficient. The Eagle overview uses the bundled JSON as a fallback if the API is unavailable.

Set `VITE_API_URL` in a root `.env` file if the API is hosted elsewhere. Restart Vite after changing environment variables.

## MySQL and automatic data updates

The API reads archive data from MySQL. Current public endpoints:

- `GET /api/health`
- `GET /api/bodies`
- `GET /api/artifacts`
- `GET /api/artifacts/:slug`
- `GET /api/artifacts?body=moon`

The Eagle overview fetches its long story from the database and falls back to `src/data/eagle.json` if the API is unreachable. Data edits in MySQL are reflected on the next fetch; public API responses have a short 30-second cache policy. A browser refresh fetches the latest content. No frontend rebuild is needed for database content changes.

The API currently exposes read-only public endpoints. Do not expose database credentials to the browser or connect React directly to MySQL. For future admin editing, add authenticated write endpoints rather than granting public write access.

## Performance

- Large GLB/audio assets stay in `public/` and are requested separately from the JavaScript bundle.
- Vite separates React, Three.js, motion and icon dependencies into cacheable chunks.
- Build sourcemaps are disabled for production to reduce output size.
- Keep source images at an appropriate display resolution; retain the original high-quality source assets in the archive.
- Avoid adding duplicate versions of large GLB files. The identical, unused `eagle.glb` duplicate has been removed; `apollo-lunar-module.glb` remains the canonical Eagle model.

## Team workflow

1. Create a feature branch: `git switch -c feature/your-topic`.
2. Keep changes focused on one page, component, API route or SQL migration.
3. Run `npm run build` before opening a pull request.
4. Never commit `.env`, database passwords, `node_modules/`, or `dist/`.
5. For schema changes, add a numbered SQL migration in `database/migrations/` instead of silently changing an already deployed schema.

## Current limitation

This pass introduces the route structure and API foundation while preserving the existing page implementation. It does not yet convert every section of the large legacy page file into independent components, nor does it include a production deployment, authentication, or automatic database migrations.


## Navigation

- `/` is the minimal landing page: “Abandoned but not forgotten” and “Explore the Sleeping Beauties”.
- `/space` is the interactive deep-space solar-system page.
- `/moon`, `/mars`, and `/eagle` are the archive experiences. The former About page is no longer routed.
