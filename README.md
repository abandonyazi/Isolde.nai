# Isolde NAI

A lightweight mobile-first NovelAI image workbench.

## Features

- Prompt presets and negative prompts
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

The public GitHub Pages build uses a small Cloudflare Worker as its NovelAI CORS proxy.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/abandonyazi/Isolde.nai/tree/main/cloudflare-worker)

Worker source lives in `cloudflare-worker/`.
