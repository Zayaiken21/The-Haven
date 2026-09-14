# The Haven v6 — Free deployment

## GitHub Pages
The publishing root must contain `index.html`, `app.js`, and `styles.css`. The frontend does not require a user-entered Render URL.

## Render Free
Service: `haven-engine`
Root Directory: `haven-engine`
Build: `pip install -r requirements.txt`
Start: `uvicorn app:app --host 0.0.0.0 --port $PORT`
Health Check: `/health`
Plan: **Free**
Persistent disk: **none**

### Required environment variables
`DATA_DIR=./data`
`FRONTEND_ORIGIN=https://zayaiken21.github.io`
`CORS_ORIGINS=https://zayaiken21.github.io`
`MODEL_PROVIDER=none`
`MODEL_NAME=none`

No API key is required for the deterministic engine. If an AI model provider is added later, put its secret key only in Render Environment Variables; never commit it to GitHub or browser JavaScript.

## Important free-plan behavior
Render Free services can sleep after inactivity and have ephemeral filesystems. The frontend therefore renders immediately and performs `/health` in the background. A sleeping backend can take time to wake, but it must never prevent the Haven UI from appearing.

## Verification
1. Open `https://haven-engine.onrender.com/health`.
2. It must return JSON with `ok: true`.
3. Open `https://haven-engine.onrender.com/capabilities`.
4. Open `https://zayaiken21.github.io/The-Haven/`.
5. The header should say `Ready • Engine checks in background` immediately, then `Connected` after Render responds.
6. Hard-refresh if GitHub Pages has an older cached asset.
