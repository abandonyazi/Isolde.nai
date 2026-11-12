# Isolde NAI Cloudflare Worker

A narrow CORS proxy for Isolde NAI.

It forwards only:

- GET /user/subscription
- POST /ai/generate-image
- POST /ai/encode-vibe

Allowed browser origins:

- https://abandonyazi.github.io
- https://isolde-nai.de5.net

The user's NovelAI persistent token is forwarded only in the Authorization header and is not stored by the Worker.

## Deploy

Use Cloudflare's Deploy to Cloudflare flow for this subdirectory:

https://deploy.workers.cloudflare.com/?url=https://github.com/abandonyazi/Isolde.nai/tree/main/cloudflare-worker

After deployment, copy the generated workers.dev URL into Isolde NAI's NAI endpoint field temporarily. The frontend will be updated to use it as the default public proxy once the production URL is known.
