# AGENTS.md — read this first

## Purpose
"Fotos de la sala" is a family digital photo frame. Family members upload photos from their phones through a PWA (`index.html`). An old iPad (iPad 2/3 class, model MD540LL/A, **iOS 9.3.6**, Safari only, no App Store) shows the photos as a fullscreen slideshow all day (`pantalla.html`). Owner: Mario (GitHub: chokorad). UI text is in Spanish (Mexico).

## Stack
- Vanilla HTML/CSS/JS, no build step, no npm, no frameworks.
- Firebase Firestore (free Spark plan) accessed through the **REST API** (`firestore.googleapis.com/v1`), not the Firebase SDK. Photos are stored as base64 JPEG data URLs inside Firestore documents.
- Hosting: GitHub Pages (static). PWA: `manifest.webmanifest` + `sw.js` (upload app only).

## Hard constraint: `pantalla.html` must stay ES5
The iPad runs iOS 9.3.6 Safari. In `pantalla.html` and `config.js`:
- Use `var`, `function`, callbacks and `XMLHttpRequest`.
- Do NOT use: `let`/`const`, arrow functions, template literals, `Promise`, `fetch`, `async/await`, `Object.assign`, `Array.from`, `.includes`, `.startsWith`, `padStart`, `classList.toggle` with a 2nd argument, CSS `aspect-ratio`, CSS `object-fit` on backgrounds, `env()`.
- Verify after any edit: parse the inline script with `acorn` using `ecmaVersion: 5`. It must pass.
- `index.html` (upload app) runs on modern phones and may use modern JS.

## Run locally
Static files only. From the project folder: `python -m http.server 8080`, then open
- `http://localhost:8080/#c=<FAMILY_CODE>` (upload app)
- `http://localhost:8080/pantalla.html#c=<FAMILY_CODE>` (iPad screen)

`<FAMILY_CODE>` lives in `CODIGO_FAMILIAR.txt` on Mario's computer (never committed).

## Deploy
Push to `main` on GitHub. GitHub Pages serves the repo root. Mario uses GitHub Desktop (commit, then Push origin). No CI.

## Editing rules
- Keep changes small; one concern per commit.
- Never rename Firestore fields: `img`, `t`, `n` (see ARCHITECTURE.md). `firestore.rules` validates exactly these keys.
- After changing any file cached by the service worker (`index.html`, `config.js`, `manifest.webmanifest`, icons), bump `CACHE` in `sw.js` (`fotos-sala-v1` → `v2`, …).
- The iPad page reloads itself at ~04:00 daily, so changes reach the iPad after the next reload. To force it, close and reopen the home-screen icon.
- Never commit: `CODIGO_FAMILIAR.txt`, `firestore.rules` (real code inside), any secret. `apiKey` in `config.js` is a public Firebase web key by design; security comes from `firestore.rules` plus the secret collection name.
- Do not move the family code into a file that is served (it is the "password": the Firestore collection name, passed in the URL `#c=` fragment).
- Log every change in `CHANGELOG.md` (newest first).

## Files to read next
`ARCHITECTURE.md` (file map, data model, flows) → `FEATURES.md` (behavior, user decisions) → `TODO.md`.
