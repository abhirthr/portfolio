# Abhijeet Rathore portfolio — project context

Personal site of Abhijeet Rathore (PhD researcher, IIT Roorkee; ML for solar and wind
forecasting). Keep this file short and factual; update "Status" and "Open items" at the
end of each session.

## Live setup
- **Site:** https://abhijeetrathore.in (Vercel, deploys `main` on push). `www.` and the old
  `portfolio-beta-lovat-12.vercel.app` both 308-redirect to the apex (set in Vercel → Domains).
- **Domain:** `abhijeetrathore.in`, GoDaddy, registered 2026-11-04 until 2029-11-04, no
  add-ons. `.in` registry redacts owner details by default.
- **DNS (GoDaddy):** A `@` 76.76.21.21 · CNAME `www` cname.vercel-dns.com (Vercel suggests
  newer 216.198.79.1 / project CNAME; old values keep working) · MX `@` mx1/mx2.improvmx.com
  (10/20) · TXT `@` SPF for ImprovMX · TXT `@` google-site-verification (keep it).
- **App:** https://app.abhijeetrathore.in (the `ml-demo1` Vercel project; CNAME `app` in GoDaddy).
  The old `solar-forecast.vercel.app` 308-redirects to it. No `www.app.` (not needed). The API is
  still on `india-renewables-api.onrender.com`; `api.` subdomain is optional, not set up.
- **Email:** `hello@abhijeetrathore.in` forwards to Gmail via ImprovMX (receive only; replies
  go from Gmail). Site reads it from `CONTACT_EMAIL` in `src/lib/site.js`.
- **Search:** Google Search Console Domain property verified (via GoDaddy Domain Connect);
  `sitemap.xml` submitted. JSON-LD Person (home) and TechArticle (case study) in the HTML heads.
- **Analytics:** Vercel Web Analytics enabled; plain script tag in both HTML files (no npm
  package). The `/_vercel/insights/script.js` route only exists on deploys made after enabling.

## Commands
```bash
npm install && npm run dev     # http://localhost:5173
npm run lint && npm run build  # lint must be clean (0 problems); build also prerenders
npx vite preview               # serves dist/, incl. /projects/... pages
```
`npm run build` = `vite build` + `node scripts/prerender.mjs`. The script does an SSR build of
`src/entry-server.jsx` into `.ssr-tmp/` (deleted afterwards), renders each page with
react-dom/server and injects it into the `<div id="root">` of the matching dist HTML. Check with
`curl -s https://abhijeetrathore.in/ | sed -n '/<body>/,/</body>/p'`: the body must contain the text.
Deploy: commit on the working branch, push it, then fast-forward `main`
(`git push origin <branch>:main`) once the user says to put it live.
Commit author: always `Abhijeet Rathore <abhijeetrthr@gmail.com>` (set `git config user.name/user.email`
in each new session). Needed once the repo goes private: Vercel Hobby blocks deploys of commits
by other authors. User plans to make the repo private later.

## Layout
```
index.html                         home page (meta, OG, canonical, JSON-LD, analytics)
projects/india-renewables-forecast/index.html   case-study page entry (Vite multi-page)
projects/fft-lstm-solar-forecast/index.html     FFT-LSTM paper case-study entry
vite.config.js                     rollup inputs: main + irf + fft
src/entry-server.jsx               page key -> component map for the prerender (main, irf, fft)
src/lib/mount.jsx                  hydrateRoot when the root has prerendered children, createRoot in dev
scripts/prerender.mjs              build-time prerender (see Commands)
src/App.jsx                        home section order
src/components/                    Hero, FeaturedProject, WorkedWith (timeline + toolkit),
                                   ResearchHighlight (FFT-LSTM paper + patent), FieldWork
                                   (ML-Sol, 6 stations, 2023 poster), SelectedWork (pubs,
                                   projects, honors, courses), About (+ contact), Footer, Navbar, MenuOverlay
src/components/ui/                 animated-hero-section (pong name canvas), particles,
                                   lightbox, browser-frame, scroll-expand (section wrapper, takes id),
                                   count-up (stat numbers)
src/components/SunNow.jsx          live "sun over Roorkee now" chip in the hero (src/lib/sun.js:
                                   NOAA solar position + Haurwitz clear-sky, computed in browser)
src/case-study/                    CaseStudy.jsx, charts.jsx, CaseStudy.css, Section.jsx (shared), main.jsx
src/fft-lstm/                      FFT-LSTM case study: FftLstm.jsx, charts.jsx, data.js (paper tables), FftLstm.css
src/lib/site.js                    CV_URL, CONTACT_EMAIL
src/lib/useLiveResults.js          fetch live results JSON, fall back to bundled snapshot
src/data/irf-results.json          snapshot of the app's model_results.json
public/llms.txt                    plain-text summary of the whole site for AI agents; update it whenever
                                   content changes (same source-of-truth rule as the page)
public/                            CV pdf, favicons, og-image.png (home), og/<slug>.png (case-study share cards), robots.txt, sitemap.xml,
                                   images/{research,field,app}, patent-certificate.webp, avatar.webp
                                   (field/ also holds the 3 "Out in the field" photos, EXIF stripped)
```

## Conventions
- Colour tokens in `src/index.css`: `--color-accent` #f5a524 (solar amber, on dark),
  `--color-accent-ink` #9a5b00 (amber text on white), `--color-accent-soft`. Plain CSS per
  component; Tailwind is installed but unused.
- Lint: `react-refresh/only-export-components` and React-compiler rules are on. Import
  framer-motion as `motion as Motion` (the repo's no-unused-vars pattern needs a capital).
  No impure calls (Math.random) during render; compute layout at module scope.
- Nav/footer links use `/#section` so they work from the case-study page too.
- Pages are prerendered, so components must render on the server: browser APIs (window,
  document, canvas, observers, timers, fetch) only inside useEffect; the first render must be
  deterministic and identical on server and client (SunNow renders a placeholder until its
  effect runs; CountUp renders the final text). Every `<section>` has an h2 (visually-hidden
  if the design has no visible one).
- Every number on the site comes from a source: the paper (Table 5 etc.), the CV, the
  poster, or the app's published `model_results.json`. Synthetic visuals are labelled.

## Decisions (don't revisit without the user)
- No visitor counter on the page. A seeded count (user once asked to start at 3000) was declined
  as misleading; on 2026-11-04 the user chose to leave the counter out entirely. Visits are
  tracked privately in Vercel Web Analytics. The old countapi.xyz counter (dead service) is gone.
- `abhirthr/ml-demo1` (the forecasting app) is private: never link its code. Its public
  results file `https://app.abhijeetrathore.in/data/model_results.json` (CORS *) is fine.
- Renewable Energy paper is not open access: link the DOI, host figures only, with the
  Elsevier credit line. Never host or commit the PDF (user uploads it per session when needed).
- Paper training times: use Section 4.3 (876 s ours vs 2128 s N-AM-LSTM, −58.83%). The
  conclusion's "5571 s vs 2128 s" mixes in N-AM-LSTM's 5571 ms test time. Chikkoppa is
  warm-humid (Table 1), not temperate.
- Unpublished/ongoing PhD work stays off the site.
- CV on the site must not contain a phone number. Old CV with phone was purged from git
  history (force-push, 2026-11-04); GitHub may still cache commit `e8fb134` by SHA.
- Personal-name `.in` domain; projects go on subdomains (`app.`, `api.`) later.

## Gotchas
- Hero name canvas sizes from its own stage (flex area above the subtitle) and is capped
  at 64% of that height; it overlapped content on short laptop screens before.
- Particles canvas covers the whole light section (ResizeObserver); pixel ratio is capped
  to stay under iOS Safari's ~16.7M-pixel canvas limit.
- Navbar: desktop (>1024px) shows section links with the active one highlighted; phones keep
  the Menu button. After the hero it becomes a near-opaque dark bar with a scroll-progress line
  (white text used to vanish over the light sections).
- Hero canvas: hit pixels flash amber and regrow after 9 s; click/tap serves the ball; draws
  a still frame under prefers-reduced-motion. All pages wrap in MotionConfig reducedMotion="user".
- SVG animations (station map, decomposition) trigger `whileInView` on the `<svg>` root,
  not on child `<g>`/`<path>` (Safari doesn't fire IntersectionObserver on SVG children).
- The live forecast app's landing animates in; wait ~5 s before screenshots. Its Render
  backend isn't reachable from the cloud sandbox, so forecast panels can't be captured here.
- Vercel returns a TLS reset for a domain not yet added to the project.
- A hydration mismatch (console "Hydration failed") means a component rendered differently on
  the server; React recovers by re-rendering on the client but the prerendered text may flash.
  `npm run dev` does not prerender, so test hydration with `npm run build && npx vite preview`.

## Status (2026-11-11, in progress)
Branch `feat/agent-readable` (not yet pushed): build-time prerendering of all three pages,
`public/llms.txt`, robots.txt pointer, visually-hidden h2s for Publications and About, real README.
Motivation: an AI agent reported the site unreadable because the HTML body was an empty root div.
Next, per the user: a UI/UX pass aimed at employers, and showcasing agentic development.

## Status (2026-11-04, end of session)
Done and live: hero (headline, proof chips, live sun chip, playable name canvas), desktop nav
with active section + scroll progress, featured app section, research highlight (paper + patent,
count-up stats), field work section with "Out in the field" photos, two-column experience +
toolkit, publications with years and DOI/book links, honors, courses (6 + show all), contact,
CV download, case study pages (India Renewables Forecast; FFT-LSTM paper) with their own share
cards, custom domain, `app.` subdomain, email forwarding, Search Console + sitemap, analytics.
Working branch and `main` are in sync.

## Open items
- The case study depends on the field names of the app's `public/data/model_results.json`
  (ml-demo1 Phase 1.5b/1.5c and Phase 2 merged to its `main` on 2026-11-04, ml-demo1 PR #13).
- ML-Sol case study dropped (2026-11-04): its model is the paper's; the engineering side is
  already covered by the home Field Work section.
- Refresh the CV PDF (user to supply): current CV has no website link, lists the Gmail
  address, has a missing space before the first DOI ("literature.https://"), a garbled
  Springer DOI ("...6349-84 2"; correct is 10.1007/978-981-97-6349-8_42), and still calls the
  book chapter "accepted" (it is Chapter 13, CRC Press, 2023). Check new CV for a phone number.
- Repo to be made private by the user later; afterwards push a test change and confirm Vercel
  still deploys (commits must be authored as the user).
- Optional: `api.abhijeetrathore.in` for the Render API. User declined more sections/notes for
  now (3 papers in the pipeline); add them when published.
- Confirm the ML-Sol booth photo is from the 21 Jan 2025 workshop (caption assumes it).
- User to add https://abhijeetrathore.in to LinkedIn, Google Scholar, CV and GitHub.
