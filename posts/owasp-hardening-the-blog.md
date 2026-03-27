---
title: 'It''s Just a Blog'
date: '2026-04-01'
excerpt: 'A Next.js blog felt inherently safe — static generation, no user accounts, no payments. That assumption was the problem. Here is what the OWASP Top 10 found when I stopped treating simplicity as a substitute for scrutiny.'
tags: ['Security', 'Engineering']
series: "OWASP Top 10 Audit"
series_position: 1
---

I shipped this without a security review. Then I matched it against the OWASP Top 10. Here's what I found. The most dangerous security assumption isn't a technical one. It's a categorical one: *this type of app doesn't need that kind of scrutiny.*

I'd carried that assumption into this site from the start. No user accounts. No payments. No sensitive data in any obvious sense. A Next.js blog with a weather widget and a portfolio chart. What's the attack surface on something like that?

I sat down with the OWASP Top 10 to find out.

The FinSurf audit had found problems in auth infrastructure — credential storage, admin lockout, startup validation. Real problems, in a system I'd thought about carefully. What the blog audit found was different in kind: vulnerabilities that only exist because I hadn't thought carefully at all. The assumption of simplicity had replaced the habit of scrutiny.

Here is what it found, and what the assumption behind each one actually was.

## "Static sites don't have secrets"

The site includes a weather widget. Static generation means no server-side rendering for most pages, no sessions, no database — the reasoning follows that there's nothing secret to protect.

The assumption breaks at the client component boundary.

The original implementation called the OpenWeather API directly from the browser — a `fetch()` in a client component, with the API key passed as a query parameter. The key wasn't prefixed `NEXT_PUBLIC_`, but it was referenced in client-side code, which meant it was compiled into the JavaScript bundle. Anyone who opened DevTools → Sources and searched for the key format would find it. That's not a sophisticated attack. It's a five-minute exercise.

The name "environment variable" implies a level of secrecy that doesn't exist once the value is compiled into a bundle. *Static* refers to the rendering strategy, not the security model.

The fix is a server-side proxy route. The client now calls `/api/weather/current`, a Next.js API route that holds the key in `process.env.OPENWEATHER_API_KEY` — a server-only variable that never ships to the browser:

---

**Keep Reading:**
- [What Not to Log](./owasp-hardening-solo-project) — The companion OWASP audit, this time on FinSurf's auth infrastructure

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

The client never sees the key. The proxy handles the upstream call. Any API key that lives in client-side code is a public API key — the server boundary is the only thing that changes that.

## "I wrote these files"

Blog posts are written in Markdown, converted to HTML via `remark`, and rendered with React's `dangerouslySetInnerHTML`. The reasoning: I wrote every post in this directory. The HTML that comes out is mine. It's safe.

That reasoning rests on three assumptions that are each independently fragile.

First, it assumes the Markdown pipeline has no vulnerabilities. Second, it assumes the files are never modified in transit. Third, it assumes the post source will always and only be the local `posts/` directory. Any one of these breaking — a compromised dependency, a tampered file, a future feature that pulls content from elsewhere — and the assumption fails silently.

More practically: normalizing unvalidated HTML injection is a habit. The habit is the risk, independent of whether any specific post is malicious today.

React named `dangerouslySetInnerHTML` that way on purpose. The fix is DOMPurify, wrapped in its isomorphic variant for server-side rendering:

```ts
import DOMPurify from 'isomorphic-dompurify';

const contentHtml = DOMPurify.sanitize(processedContent.toString(), {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
});
```

The explicit `FORBID_TAGS` and `FORBID_ATTR` lists matter. `USE_PROFILES: { html: true }` enables a permissive allow-list for standard HTML, then the forbid lists remove the specific tags and attributes that enable XSS: inline script execution, event handlers, frame injection, form spoofing. The output is still rich HTML — headings, links, code blocks, images — but without the vectors that make `dangerouslySetInnerHTML` dangerous.

## "There's nothing to validate"

A blog doesn't take user input. There's no login form, no comment box, no search field. The assumption: nothing to validate.

The portfolio history endpoint accepts a `positions` query parameter — a JSON array of ticker symbols and share counts — to let the frontend specify which holdings to chart. Before the audit, the handler parsed whatever arrived and passed it directly to Yahoo Finance. The endpoint had been there for months without issue.

The exposure: a crafted request could pass an arbitrarily large array (triggering a spike in external API calls and compute time) or malformed symbols that could influence downstream behavior. The input came from the URL. It was unsanitized. It was a user input — it just didn't look like one.

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

Array check. Hard cap at 30 items. Symbol regex that matches the format of real tickers and rejects everything else. Validation at the system boundary — the only place it reliably matters. Query parameters are user input regardless of who the expected user is.

## "Modern frameworks handle this"

Next.js handles routing, rendering, bundling, image optimization. The assumption: the framework's defaults are secure defaults.

They're not. No security headers ship by default.

Three headers, added in ten lines to `next.config.js`, address distinct attack classes:

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

**`X-Frame-Options: DENY`** prevents the site from being embedded in an `<iframe>` on another domain — closing clickjacking, where a malicious page overlays invisible elements on a framed version of your site to trick users into clicking things they can't see.

**`X-Content-Type-Options: nosniff`** stops browsers from guessing the content type of a response when the declared type doesn't match. Without it, a browser might interpret a JSON response as executable JavaScript if the context suggests it.

**`Referrer-Policy: strict-origin-when-cross-origin`** controls what URL information gets sent in the `Referer` header on outbound requests, limiting cross-origin requests to the origin only rather than the full path and query string.

None of these required touching application code. The framework does a great deal — it doesn't do this.

---

The FinSurf audit found problems I'd thought about and gotten wrong. The auth model was intentional; the mistakes were in the details. The blog audit found problems I hadn't thought about at all. The attack surface wasn't where I was looking because I hadn't decided it had one.

That's what "it's just a blog" actually means: I've pre-decided the threat model is negligible. The app's complexity doesn't determine its exposure. A blog with a client-side API key, unvalidated HTML injection, an open API endpoint, and no security headers has an attack surface — it just has a different shape than a payment system's.

Simplicity is a description of what an app does. It's not a security posture.

---

**Keep Reading:**
- [What Not to Log](./owasp-hardening-solo-project) — The first OWASP audit on the app, then this audit