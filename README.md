# The Haven — Free Deployment Package

GitHub Pages frontend + Render Free FastAPI backend. The frontend never waits for Render before loading.

## Important free-plan behavior
Render Free web services can spin down after inactivity and may take about a minute to wake. The UI therefore loads immediately and connects in the background. This is expected platform behavior, not a frontend freeze.

The free plan has no persistent disk. Workspace files, uploads and engine memory are temporary. Keep important source in GitHub or add a durable datastore later.

## Current engine
The Haven provides deterministic project scaffolds, language classification, validation, packaging, game/app/web templates, and UX/UI specifications. A general-purpose generative model is not bundled; a server-side model adapter can be added with a provider API key stored in Render environment variables.
