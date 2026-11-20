# Design — public demo

Prepared 2026-11-20 by ChatGPT/Codex.

## Visitor flow

Entry → floating candles → artwork or music → its source conversation → return to the hall.

Gold and blue carry the two content types consistently. The hall remains the backdrop while the visitor opens works. Native dialogs provide focus handling and Escape behavior. The collection list is an explicit alternative to exploring the candle field.

## Data

`data/gallery.json` contains paintings, songs and stories. Media entries refer to local `assets/` files and a story ID. Stories are arrays of fictional messages with bilingual text. Rendering uses text nodes for collection-derived content.

## Rendering and sound

Canvas 2D renders stars and pre-rendered glow sprites. Candles have a depth factor, position, phase and content reference. A semantic button corresponds to each candle. Audio is a local WAV loaded after interaction; a Web Audio analyser supplies a small visual response. Animation stops rendering while the document is hidden.

## Portability

All requests use relative static paths. No private integration or network polling remains. Original demo assets can be regenerated using only Python's standard library.
