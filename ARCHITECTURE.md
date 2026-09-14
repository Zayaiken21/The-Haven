# The Haven v3 Architecture

## Frontend
GitHub Pages hosts only the static UI. It contains no secrets and no persistent runtime state.

## Engine
Render hosts the FastAPI engine. The frontend calls the fixed engine endpoint from `haven-web/app.js`. The browser does not ask the user for the Render URL.

## Runtime storage
`DATA_DIR=/var/data` stores:
- `memory.json` — bounded chat/project metadata
- `projects/` — generated project manifests, source JSON and ZIP exports
- `uploads/` — uploaded assets

A Render Persistent Disk must be attached at `/var/data` for this filesystem data to survive restarts/deploys. Render documents persistent disks as a paid feature. For larger production workloads, use Postgres for metadata and object storage for media/assets.

## Capabilities
The engine exposes deterministic scaffolding for engineering projects, 2D/3D game starters, responsive apps, and UX/UI specifications. It also validates paths and packages projects as ZIP files.

The engine is deliberately not pretending to be a generative AI model. To support open-ended novel code generation, add a server-side model adapter later. Provider keys must remain on Render, never in the browser.

## Production path
GitHub source -> Render build/deploy -> persistent runtime storage -> frontend calls engine -> build job -> validated project -> ZIP download.
