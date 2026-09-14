# The Haven — Free Setup

## GitHub Pages
The repository must have `index.html`, `app.js`, and `styles.css` at the publishing root.

## Render Free
Create/keep a **Web Service** named `haven-engine` using the `haven-engine` directory as the root directory.

- Plan: **Free**
- Build: `pip install -r requirements.txt`
- Start: `uvicorn app:app --host 0.0.0.0 --port $PORT`
- Health check: `/health`
- `DATA_DIR=./data`
- `FRONTEND_ORIGIN=https://zayaiken21.github.io`
- `CORS_ORIGINS=https://zayaiken21.github.io`
- **Do not add a persistent disk.**

Render Free services sleep after inactivity. The first request after sleep may take about a minute. The frontend no longer blocks on this request: it opens immediately, shows `Starting locally`, then `Connected` or `Engine asleep / waking`.

## Environment for future AI
Do not put model/provider API keys in GitHub Pages JavaScript. If a model provider is added, store the secret in Render Environment Variables and call it only from FastAPI.
