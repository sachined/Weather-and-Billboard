---
title: 'It''s Just a Blog'
date: '2026-03-30'
excerpt: 'I''d just finished an OWASP audit on FinSurf. Then I turned the same lens on this site. A Next.js blog felt inherently safe. That assumption was the problem.'
tags: ['Security', 'Engineering', 'Next.js']
---

I'd just finished an OWASP audit on FinSurf — hashing pass codes, hardening auth logging, locking down the admin panel. The process was uncomfortable in the way good audits usually are: you find things that were wrong and working fine, with no indication anything was wrong at all.

Then I turned the same checklist on this site.

A Next.js blog felt safe by default. Static generation, no user accounts, no payments, no sensitive data in the traditional sense. The attitude I'd carried into it was *it's just a blog*. That attitude is its own vulnerability.

Here is what the audit found.

## The API Key in the Bundle

The site includes a weather widget. The original implementation called the OpenWeather API directly from the browser — a `fetch()` in a client component, with the API key passed as a query parameter.

The key wasn't prefixed `NEXT_PUBLIC_`, but it was referenced in client-side code, which meant it was reachable in the compiled JavaScript bundle. Anyone who opened DevTools → Sources and searched for the key format would find it. More precisely: anyone who fetched the page, ran it through a beautifier, and looked, would find it. That's not a sophisticated attack. It's a five-minute exercise.

The fix is a server-side proxy route. The client now calls `/api/weather/current`, which is a Next.js API route that holds the key in `process.env.OPENWEATHER_API_KEY` — a server-only variable that never ships to the browser:

```ts
// pages/api/weather/current.ts
const API_KEY = process.env.OPENWEATHER_API_KEY;

export default async function handler(req, res) {
  const { type, params } = req.query;
  // validate type and params...
  const upstream = await fetch(`${BASE_URL}/${type}?${params}&appid=${API_KEY}`);
  const data = await upstream.json();
  res.status(upstream.status).json(data);
}
```

The client never sees the key. The proxy handles the upstream call. The key stays on the server where it belongs.

The lesson generalizes beyond Next.js: any API key that lives in client-side code is a public API key. The name "environment variable" implies a level of secrecy that doesn't exist once the value is compiled into a JavaScript bundle. If a third-party API key is worth protecting, it needs a server in front of it.

## `dangerouslySetInnerHTML` Is a Warning, Not a Name

Blog posts are written in Markdown, converted to HTML via `remark`, and rendered with React's `dangerouslySetInnerHTML`. The pipeline looks like this:

```
Markdown file → gray-matter → remark → HTML string → React
```

The problem is the last step. `dangerouslySetInnerHTML` bypasses React's XSS protections and injects the HTML string directly into the DOM. React named it that on purpose. It's easy to look past the name when the source is your own Markdown files — the reasoning goes, *I wrote these posts, the HTML is safe.*

That reasoning breaks if the Markdown pipeline itself has a vulnerability, if a file gets modified in transit, or if the post source ever comes from somewhere other than the local `posts/` directory. More practically: it's a pattern that normalizes unvalidated HTML injection. The habit is the risk.

The fix is DOMPurify, wrapped in its isomorphic variant for server-side rendering:

```ts
import DOMPurify from 'isomorphic-dompurify';

const contentHtml = DOMPurify.sanitize(processedContent.toString(), {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
});
```

The explicit `FORBID_TAGS` and `FORBID_ATTR` lists matter. `USE_PROFILES: { html: true }` enables a permissive allow-list for standard HTML, then the forbid lists remove the specific tags and attributes that enable XSS: inline script execution, event handlers, frame injection, form spoofing. The output is still rich HTML — headings, links, code blocks, images — but without the vectors that make `dangerouslySetInnerHTML` dangerous.

## Input Validation on the Portfolio Endpoint

The portfolio history endpoint accepts a `positions` query parameter — a JSON array of ticker symbols and share counts — to let the frontend specify which holdings to chart. Before the audit, the handler parsed whatever arrived and passed it directly to Yahoo Finance.

The exposure: a crafted request could pass an arbitrarily large array (triggering a spike in external API calls and compute time) or malformed symbols that could influence downstream behavior.

The fix is three layers of validation before anything gets processed:

```ts
const parsed = JSON.parse(posQuery);

if (!Array.isArray(parsed) || parsed.length > 30) {
  return res.status(400).json({ error: 'positions must be an array of at most 30 items' });
}

for (const p of parsed) {
  if (typeof p?.symbol !== 'string' || !/^[A-Z0-9.]{1,10}$/i.test(p.symbol)) {
    return res.status(400).json({ error: 'Invalid symbol in positions' });
  }
}
```

Array check. Hard cap at 30 items. Symbol regex that matches the format of real tickers and rejects everything else. The endpoint now accepts exactly what it expects and rejects everything that isn't that. This is validation at the system boundary — the only place it reliably matters.

## Three Security Headers, Three Lines

The most asymmetric fix in the audit: three HTTP response headers, added in ten lines to `next.config.js`, that address distinct attack classes:

```js
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ];
},
```

**`X-Frame-Options: DENY`** prevents the site from being embedded in an `<iframe>` on another domain. This closes clickjacking — an attack where a malicious page overlays invisible interactive elements on top of a framed version of your site to trick users into clicking things they can't see.

**`X-Content-Type-Options: nosniff`** stops browsers from guessing the content type of a response when the declared type doesn't match. Without it, a browser might interpret a JSON response as executable JavaScript if the context suggests it. `nosniff` tells the browser to trust the declared `Content-Type` and nothing else.

**`Referrer-Policy: strict-origin-when-cross-origin`** controls what URL information gets sent in the `Referer` header on outbound requests. Full URLs can contain path segments and query strings that reveal navigation patterns. This policy sends only the origin on cross-origin requests, and the full URL only within the same origin.

None of these required touching the application code. The `headers()` function in `next.config.js` applies them globally to every response.

---

The FinSurf audit found problems in auth infrastructure — credential storage, admin lockout, startup validation. The blog audit found problems in a completely different layer: client-side key exposure, unvalidated HTML injection, missing boundary checks on API inputs, absent security headers.

Same methodology. Completely different surface.

"It's just a blog" is a category of assumption worth being suspicious of. Every application has an attack surface. The shape of it depends on what the app does, not on how simple it feels to build.
