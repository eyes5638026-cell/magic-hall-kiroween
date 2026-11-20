# Magic Hall

**A living memory gallery. Gold candles hold pictures. Blue candles hold music. Every creation remembers where it began.**

Magic Hall gives conversational creations a place to live together. Enter a quiet hall, follow a candle, open a picture or listen to a song, then return to the fictional conversation that inspired it.

This is the public Kiroween edition. The included collection is entirely fictional and was created specifically for sharing. It does not connect to a personal archive.

## Try the public demo

[Open Magic Hall](https://eyes5638026-cell.github.io/magic-hall-kiroween/) · [Source code](https://github.com/eyes5638026-cell/magic-hall-kiroween)

No account is required. Select **Enter the hall** to begin; sound starts only after that click.

## Run locally

No build step, package installation, API key or backend is required. With Python 3 available:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765`. Serve the folder over HTTP rather than opening `index.html` as a file, because the browser loads the collection JSON with `fetch`.

The same files can be hosted on GitHub Pages or another static host. All application URLs are relative, so project subpaths work.

## Explore

1. **Enter the hall.** A quiet original soundtrack starts after your click.
2. **Choose a gold candle** or select **Find a picture** to reveal an artwork.
3. **Choose a blue candle** or select **Another song** to change the music.
4. Select **Return to the conversation** or **Its story** to open the work's fictional source conversation.
5. Open **Collection** for a keyboard-friendly list of all four artworks and three scores.

The UI defaults to English and includes a Chinese toggle. Music can be paused or muted. Atmosphere settings adjust brightness, volume and motion. Dialogs close with Escape. The interface respects the operating system's reduced-motion preference.

## How it works

- **HTML, CSS and vanilla JavaScript**; no runtime framework or external CDN.
- **Canvas 2D** renders depth-aware floating candles and star glows.
- Semantic buttons sit over the candles so each one is also keyboard reachable.
- **Web Audio** reads the playing local track for gentle light response.
- `data/gallery.json` links each artwork and score to a fictional story.
- Assets are served only from this project. No account, analytics, uploads or archive API is used.
- Content changes are initiated by the visitor. The app does not poll a server.

## Kiro and development provenance

The original Magic Hall was designed and coded with Kiro on **November 17, 2026**, during the competition window. Its distinguishing interaction—gold candles for art, blue candles for music, and a return to the source conversation—comes from that working implementation.

On **November 20, 2026**, ChatGPT/Codex prepared this owner-approved public adaptation: local fictional content, original demo assets, bilingual copy, accessibility, error handling and static hosting. The original private collection and repository history were not copied.

The root `.kiro/` directory contains the **current public-edition specification and steering documents**, prepared on November 20. They are accurately dated and attributed. They are not presented as files that existed in the November 17 repository. See [development provenance](docs/DEVELOPMENT.md).

## Included assets and licensing

Four original procedural SVG artworks, three original synthesized 18-second WAV scores, and fictional bilingual conversations are included. The assets can be regenerated with the Python standard library:

```sh
python3 scripts/make_demo_assets.py
```

This generator also recreates the vector fallback backdrop. If a separate generated hero background has been added, its origin and filename are recorded in `ASSET_LICENSES.md`.

Code is licensed under the **MIT License**. Original demonstration assets and fictional conversations are offered under **CC0-1.0**. See [LICENSE](LICENSE) and [ASSET_LICENSES.md](ASSET_LICENSES.md).

## Scope

This edition demonstrates the complete **creation → gallery → source conversation** loop using a portable sample collection. It does not claim to perform live AI image generation, live music generation or automatic personal-memory retrieval. No private library is needed to try it.

---

## 中文

魔法大殿把对话中诞生的画、音乐和故事放进一座可以重访的画廊。点金色烛火看画，点蓝色烛火听歌，再回到作品诞生的那段对话。

公开版包含专门创作的虚构示例，不连接个人画库、音乐库或对话库。默认英文，右上角可切换中文；手机与桌面均可浏览。运行方法与上方相同，无需安装依赖或填写密钥。
