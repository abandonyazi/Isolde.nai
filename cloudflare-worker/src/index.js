const PUBLIC_ORIGINS = new Set([
  "https://abandonyazi.github.io",
  "https://isolde-nai.de5.net",
]);

function isPrivateIpv4(hostname) {
  const parts = hostname.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  return parts[0] === 10
    || parts[0] === 127
    || (parts[0] === 192 && parts[1] === 168)
    || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
    || (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127);
}

function isAllowedOrigin(origin) {
  if (PUBLIC_ORIGINS.has(origin)) return true;
  try {
    const url = new URL(origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase();
    return host === "localhost"
      || host === "::1"
      || host.endsWith(".localhost")
      || host.endsWith(".local")
      || host.endsWith(".ts.net")
      || isPrivateIpv4(host);
  } catch {
    return false;
  }
}

const ROUTES = new Map([
  ["/user/subscription", new Set(["GET"])],
  ["/ai/generate-image", new Set(["POST"])],
  ["/ai/encode-vibe", new Set(["POST"])],
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
  if (origin && isAllowedOrigin(origin)) {
    for (const [key, value] of Object.entries(cors(origin))) headers.set(key, value);
  }
  return new Response(JSON.stringify({ message }), { status, headers });
}

export default {
  async fetch(request) {
    const origin = request.headers.get("Origin") || "";

    if (!isAllowedOrigin(origin)) {
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
