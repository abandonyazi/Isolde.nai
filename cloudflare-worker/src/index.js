const ALLOWED_ORIGINS = new Set([
  "https://abandonyazi.github.io",
  "https://isolde-nai.de5.net",
]);

const ROUTES = new Map([
  ["/user/subscription", new Set(["GET"])],
  ["/ai/generate-image", new Set(["POST"])],
]);

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization,Content-Type,Accept",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(message, status, origin = "") {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex",
  });
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    for (const [key, value] of Object.entries(cors(origin))) headers.set(key, value);
  }
  return new Response(JSON.stringify({ message }), { status, headers });
}

export default {
  async fetch(request) {
    const origin = request.headers.get("Origin") || "";

    if (!ALLOWED_ORIGINS.has(origin)) {
      return json("Origin not allowed", 403);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    const incoming = new URL(request.url);
    const allowedMethods = ROUTES.get(incoming.pathname);
    if (!allowedMethods) return json("Not found", 404, origin);
    if (!allowedMethods.has(request.method)) return json("Method not allowed", 405, origin);

    const authorization = request.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return json("Missing Authorization header", 401, origin);
    }

    const upstreamUrl = new URL(`https://image.novelai.net${incoming.pathname}`);
    upstreamUrl.search = incoming.search;

    const headers = new Headers();
    headers.set("Authorization", authorization);
    headers.set("Accept", request.headers.get("Accept") || "*/*");
    const contentType = request.headers.get("Content-Type");
    if (contentType) headers.set("Content-Type", contentType);
    headers.set("Origin", "https://novelai.net");
    headers.set("Referer", "https://novelai.net/");

    const init = {
      method: request.method,
      headers,
      redirect: "manual",
    };
    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = request.body;
    }

    try {
      const upstream = await fetch(upstreamUrl, init);
      const responseHeaders = new Headers(upstream.headers);
      for (const [key, value] of Object.entries(cors(origin))) {
        responseHeaders.set(key, value);
      }
      responseHeaders.set("Cache-Control", "no-store");
      responseHeaders.set("X-Robots-Tag", "noindex");

      return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: responseHeaders,
      });
    } catch (error) {
      return json(error?.message || "Upstream request failed", 502, origin);
    }
  },
};
