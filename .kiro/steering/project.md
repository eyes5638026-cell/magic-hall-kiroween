---
inclusion: always
---

# Magic Hall public edition

Prepared on 2026-11-20 by ChatGPT/Codex. This is current steering for the public edition, not a claim about historical Kiro files.

## Product

Magic Hall is a living memory gallery: gold candles reveal art, blue candles play music, and each work opens the fictional conversation that inspired it. Preserve this simple visitor experience.

## Implementation

- Static HTML, CSS and vanilla JavaScript with Canvas 2D.
- No build step, external CDN, account, API key or backend.
- Use relative URLs so a static host's project subpath works.
- Default to English; retain the Chinese toggle.
- Provide keyboard-reachable controls, Escape-to-close dialogs, pause/mute and reduced motion.

## Public asset boundary

Only this repository's fictional demo collection and licensed public assets may be included. Never import personal archive data, original private music or artwork, real conversations, private service URLs, local machine paths, account details or credentials.

Record newly created assets in `ASSET_LICENSES.md`. Preserve accurate development authorship and dates in `docs/DEVELOPMENT.md`.

## Validation

Serve locally, enter the hall, open a picture, play/pause a score, open both source stories, switch languages, close dialogs with Escape, and check a narrow mobile viewport. Verify all asset requests stay within the static project and that missing assets produce a recoverable state.
