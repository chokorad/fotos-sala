# ARCHITECTURE

## File map
| File | What it does |
|---|---|
| `index.html` | Upload PWA for phones. Tabs: upload (pick photos, optional display name, progress) and gallery (paginated grid, delete button). Inline CSS + JS. |
| `pantalla.html` | iPad slideshow. ES5 only. Two stacked `div.capa` layers cross-fade; shows author name; night mode; auto-refresh. Inline CSS + JS. |
| `config.js` | `window.FOTOS_CONFIG`: `projectId`, `apiKey`, slideshow interval, active hours, polling period. Loaded by both pages. |
| `sw.js` | Service worker for the upload PWA: network-first, cache fallback, ignores cross-origin (Firebase) requests. Cache name `fotos-sala-v1`. |
| `manifest.webmanifest` | PWA manifest (standalone, portrait, dark theme). |
| `icon-180.png` | iOS home-screen icon (used by both pages). |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | PWA icons. |
| `firestore.rules.example` | Security rules template. Replace `FAMILY_CODE_HERE` with the real code, paste in Firebase console → Firestore → Rules. |
| `LEEME.md` | Spanish setup guide for Mario (Firebase, GitHub Pages, iPad). |
| `AGENTS.md`, `ARCHITECTURE.md`, `FEATURES.md`, `TODO.md`, `CHANGELOG.md`, `README.md` | Handoff documentation. |
| `.gitignore` | Excludes `CODIGO_FAMILIAR.txt` and `firestore.rules`. |

Not in the repo (on Mario's computer only): `CODIGO_FAMILIAR.txt`, `firestore.rules` (with real code).

## Data model (Cloud Firestore)
- **Collection name = the family code** (format `fam_` + 14 lowercase letters/digits). There is no other collection in use; the rules deny everything else.
- **Document** (auto id), fields:
  - `img` — string, JPEG data URL (`data:image/jpeg;base64,...`), max ~850,000 chars client-side, rules cap at 950,000 (Firestore doc limit is 1 MiB).
  - `t` — integer, `Date.now()` in ms at upload. Used for ordering and for "newer than" queries.
  - `n` — string, optional uploader name, max 24 chars.
- Example (REST format): `{"fields":{"img":{"stringValue":"data:image/jpeg;base64,/9j/..."},"t":{"integerValue":"1762650000000"},"n":{"stringValue":"Mamá"}}}`
- Rules: `read` open on that collection; `create` only with keys `img,t,n` and validated types/sizes; `update` denied; `delete` open.

## Family code flow
The code travels in the URL fragment: `.../#c=<code>`. Pages read it, store it in `localStorage` key `fs_code`, and use it as the collection name. If missing, the upload page shows a field to type it; the iPad page shows an error message.

## Flows
**Upload (index.html):** pick files → for each file: draw to canvas, scale longest side to 1600 px, JPEG quality 0.72 (lowered and resized in steps until under 850k chars) → `POST /documents/<code>` with `img`, `t`, optional `n` → show ✓/✕ per file.

**Gallery (index.html):** `POST :runQuery` ordered by `t` desc, limit 12, paginate with `t < last`. Delete = `DELETE /documents/<code>/<id>`.

**Slideshow (pantalla.html):**
1. `runQuery` with `select: t`, `t > 0`, limit 5000 → list of ids only (small).
2. Keep a shuffled deck (`baraja`). New photos found later go to the front queue (`nuevas`).
3. Download ONE full document (`GET`) at a time and preload the next while the current is shown. 404 → photo was deleted → drop id and try another (up to 4 tries).
4. Every `revisarNuevasMin` minutes: `runQuery` with `t > maxT` to find new photos.
5. Outside `horaEncender`–`horaApagar` (local time): layers faded to black, no network requests.
6. At ~04:00 the page calls `location.reload()` (at most once per 3 h of uptime) to avoid memory creep.

## External services and secrets
- Firebase project `fotos-sala-b2ff0` (Spark plan): holds Firestore database `(default)`, edition Standard, location nam5. Web app `fotos-sala-web` is registered only to obtain the API key. Config values go in `config.js` (`projectId`, `apiKey`: public web key, not a secret).
- GitHub Pages: static hosting.
- No server code, no Cloud Functions, no Storage bucket.
- Free-tier limits to remember: 1 GiB stored (~3,000 photos at ~330 KB each), 50K reads/day, 20K writes/day, 10 GiB/month egress. If exceeded, upgrade to Blaze (needs card) or delete photos.
