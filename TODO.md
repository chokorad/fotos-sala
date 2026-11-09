# TODO

## Open items (nothing here was requested by the user unless marked)
- [ ] Not yet tested on the real iPad (iOS 9.3.6). REST calls were verified against the real Firebase project from desktop Chrome. First run should confirm: photos load, cross-fade works, home-screen icon opens fullscreen.
- [ ] Not yet tested on real phones (iPhone Safari and Android Chrome) for upload and PWA install.
- [x] Firebase project, rules and `config.js` values done on 2026-11-09 (see CHANGELOG).

## Ideas (not requested)
- Show a small "N fotos" counter or last-upload time in the gallery.
- Optional WhatsApp ingestion (WhatsApp Business API + Make) was discussed and deferred. Only revisit if Mario asks.
- Optional admin-only delete (today any family member can delete).
- Optional Blaze plan + Cloud Storage for original-quality photos (user said "start free").

## Known limitations
- Photos are stored in Firestore as base64 text (~33% overhead) and capped near 1 MiB per document.
- The iPad downloads one photo at a time (~4–6 GiB/month at one photo/minute, 16 h/day), under the 10 GiB free egress.
