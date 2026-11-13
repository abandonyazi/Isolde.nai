# Isolde NAI

A lightweight mobile-first NovelAI image workbench.

## Features

- Prompt presets and negative prompts, including one-click migration from 智绘姬 / st-chatu8 inside SillyTavern
- Local character anchors with `[character name]` placeholder expansion
- Quality-tag positioning and protected `TEXT:` blocks
- Seed regeneration and multiple canvas presets
- Local gallery stored in the browser
- Original-image and watermarked-image export
- NovelAI and OpenAI-compatible endpoint modes
- PWA support

## Local data

Settings, character anchors, prompt presets, API tokens, and gallery data are stored in the user's own browser. They are not bundled into this repository.

## Hosting

This repository is a static web app hosted on GitHub Pages. Direct NovelAI access is proxied through the included Cloudflare Worker at `cloudflare-worker/`.

No API token is included in the source code.


## Cloudflare Worker

The public GitHub Pages build uses a small Cloudflare Worker as its NovelAI CORS proxy. The bundled proxy also accepts common local/LAN/Tailscale SillyTavern origins; remote custom-domain SillyTavern deployments should use their own proxy or custom endpoint.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/abandonyazi/Isolde.nai/tree/main/cloudflare-worker)

Worker source lives in `cloudflare-worker/`.


## SillyTavern version

The same repository can also be installed directly as a SillyTavern third-party extension.

1. Open **Extensions → Install Extension** in SillyTavern.
2. Paste: `https://github.com/abandonyazi/Isolde.nai`
3. Reload SillyTavern after installation.

The extension adds a small floating Isolde.nai orb beside the chat. Tap it to choose:

- **Smart**: every N character replies, judge whether the current scene is visually worth drawing.
- **Fixed**: every N character replies, always draw.
- **Manual**: only draw when the user taps “画这一幕”.
- **Images per trigger**: 1–12 scene points. The director can place them after different paragraphs.
- **Full workbench**: opens the complete Isolde.nai web workbench inside SillyTavern, including presets, character anchors, Reference, Vibe, seeds, gallery, watermark export, and connection settings.

Automatic detection is opt-in at the image level: the director inserts inline generation placeholders first. NovelAI is called only after the user taps **生成** on a placeholder, which avoids firing several image requests at once.

For scene planning, the extension can read recent chat context, the current/recent character cards, the user's persona, activated World Info, and the local Isolde.nai character-anchor library. Characters without a saved anchor can still be drawn from card/World Info/story details without being silently added to the permanent library.

Generated images are attached to the SillyTavern message that triggered them and saved through SillyTavern's image storage. NovelAI 4.5/V5 scenes use native per-character prompts so multi-character appearance tags stay separated.

The hosted web app remains available independently; installing the extension does not replace it.


### SillyTavern image controls

Images created by the extension keep their scene prompt and seed in message media metadata.

- **重Roll** regenerates only that image with a new seed.
- **同seed** regenerates only that image with its saved seed.
- Other images in the same message stay untouched.

The web workbench also supports portable configuration export/import for presets, anchors, settings, Reference, Vibe presets, and watermark assets. Tokens and gallery images are intentionally excluded.


### Paragraph-aware placement

The SillyTavern extension can place each generated image directly after the paragraph whose scene it illustrates. The director stores both a paragraph number and a short text anchor so images return to the same narrative position after chat rerenders.

Each Isolde.nai chat image provides **重Roll**, **同seed**, **下载**, and **删除** controls. Rerolls keep the original image and add another variant at the same scene position. On iOS, Download prefers the native file share flow so PNG files do not open in Safari's preview page.
