# CHANGELOG (newest first)

## 2026-11-09 — Visible version label (v5)
- `index.html`: footer line "Versión vN · date" so Mario can confirm the deployed version on his phone. Bump this text together with the `CACHE` name in `sw.js` on every release.
- Bumped service worker cache `fotos-sala-v4` -> `fotos-sala-v5`.

## 2026-11-09 — Blurred background + new manifest id
- `pantalla.html`: each layer now has a `.fondo` div (same photo, `cover`, blur 28px, brightness .7, scale 1.25) behind a `.frente` div (`contain`), so portrait photos no longer show black side bars. ES5 preserved. Toggle with `fondoDifuso: false` in `config.js` (hides the blur if the old iPad is slow).
- `manifest.webmanifest`: added `"id": "/fotos-sala/app"` because Chrome on Mario's phone held a stale WebAPK record ("already installed" / "Could not open app"). A new id makes Chrome treat it as a new app.
- Bumped service worker cache `fotos-sala-v3` -> `fotos-sala-v4`.

## 2026-11-09 — Firebase connected
- Created Firebase project `fotos-sala-b2ff0` (Spark plan, no Analytics, no Gemini), Firestore (Standard edition, production mode, location nam5, database `(default)`), and a web app `fotos-sala-web`.
- Published the security rules (same content as `firestore.rules.example` with the real family code in place of `FAMILY_CODE_HERE`).
- Filled `projectId` and `apiKey` in `config.js` (public web key by design).
- Bumped service worker cache `fotos-sala-v2` -> `fotos-sala-v3` because `config.js` changed.
- Verified against the real REST API: create 200, list 200, get 200, delete 200; write to another collection 403; extra field 403. Test document removed.

## 2026-11-09 — New app icon
- Replaced `icon-180.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` with the icon Mario supplied (neon camera + heart + family figures). Cropped to a 930 px opaque square inside the rounded corners, no transparency, so Android does not add a white ring.
- Bumped service worker cache `fotos-sala-v1` -> `fotos-sala-v2` in `sw.js`.
- To see it, phones must delete the old home-screen icon and add the app again (manifest/icon changes do not apply to an already installed icon).

## 2026-11-08 — Initial version
- Added upload PWA `index.html`, iPad slideshow `pantalla.html` (ES5), `config.js`, `sw.js`, `manifest.webmanifest`, icons.
- Added `firestore.rules.example` (rules generated locally with a random family code; the real file is not committed).
- Added handoff docs: `AGENTS.md`, `ARCHITECTURE.md`, `FEATURES.md`, `TODO.md`, `CHANGELOG.md`, `README.md`, plus `LEEME.md` (Spanish setup guide).
- Why: Mario wanted his old iPad as a digital photo frame fed by family uploads, on the free Firebase plan.
- Verified: `pantalla.html` and `config.js` parse as ES5; slideshow logic tested against a simulated Firestore REST API (rotation, new-photo priority, deleted photo, night mode, empty state).
