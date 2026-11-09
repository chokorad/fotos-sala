# FEATURES

## Upload app (`index.html`)
- **Family code gate.** Opens with `#c=<code>` and remembers it. Without a code it asks for one (validated `^[A-Za-z0-9_]{6,}$`).
- **Your name field.** Optional, max 24 chars, remembered in `localStorage` (`fs_nombre`); shown small on the iPad next to the photo.
- **Pick photos.** Multi-select from the gallery. Each photo is resized to ≤1600 px and compressed before upload (typical 200–300 KB). Sequential upload with progress bar and per-file ✓/✕ list.
  - Edge cases: a photo that cannot be shrunk under ~900k chars is rejected with "muy pesada"; wrong code or rules not published → "sin permiso"; HEIC that the browser cannot decode → "no se pudo leer".
- **Gallery tab.** Newest first, 12 per page, "Ver más antiguas" loads older. ✕ on a photo deletes it (with confirm) and it disappears from the iPad. Anyone with the code can delete any photo (user decision: simple family trust model).
- **Installable PWA** (standalone, dark theme). The service worker is network-first, so updates show up on next open.

## iPad screen (`pantalla.html`)
- Fullscreen slideshow, `contain` sizing (whole photo visible, black bars), 1.6 s cross-fade.
- One photo every `intervaloSegundos` (default 60 s).
- Random order without immediate repeats; **new uploads are shown first** (checked every 5 min).
- Uploader name appears bottom-left after the fade, only if the photo has `n`.
- Night mode: black screen outside 07:00–23:00 (configurable), no network use.
- Self-healing: retries after network errors (20–45 s), skips deleted photos, daily reload at ~04:00.
- Status messages on screen (Spanish): "Falta configurar", "Falta el código familiar", "Cargando fotos…", "Aún no hay fotos", "No se pudieron cargar las fotos".
- Touch scrolling/zoom is disabled.

## Decisions already made by the user (do not undo)
- Photos arrive through a **PWA that the family opens and uploads to** (chosen over email and WhatsApp).
- **Free plan first** (Firestore, photos resized to 1600 px). Upgrade to Blaze only if storage fills up.
- iPad shows photos **in random order**; new ones first.
- Hosting on GitHub Pages like Mario's other apps; updates are done by pushing to GitHub with GitHub Desktop.
- Handoff docs must stay up to date so other agents (Antigravity, Claude Code, etc.) can modify the app.
