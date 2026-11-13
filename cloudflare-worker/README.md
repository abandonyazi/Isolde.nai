# Isolde NAI Cloudflare Worker

A narrow CORS proxy for Isolde NAI.

It forwards only:

- GET /user/subscription
- POST /ai/generate-image
- POST /ai/encode-vibe

Allowed browser origins include:

- https://abandonyazi.github.io
- https://isolde-nai.de5.net
- localhost / loopback
- private-LAN IPv4 origins
- .local and .ts.net hosts

This covers the hosted web app plus common self-hosted SillyTavern setups without turning the Worker into an unrestricted public CORS proxy.

The user's NovelAI persistent token is forwarded only in the Authorization header and is not stored by the Worker.

## Deploy

Use Cloudflare's Deploy to Cloudflare flow for this subdirectory:

https://deploy.workers.cloudflare.com/?url=https://github.com/abandonyazi/Isolde.nai/tree/main/cloudflare-worker

The frontend currently uses `https://isolde-nai-proxy.abandonyazi.workers.dev` as the default proxy whenever the NovelAI official endpoint is selected. If you deploy your own Worker, point Isolde NAI at that endpoint instead.
