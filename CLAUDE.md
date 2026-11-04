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
- **Email:** `hello@abhijeetrathore.in` forwards to Gmail via ImprovMX (receive only; replies
  go from Gmail). Site reads it from `CONTACT_EMAIL` in `src/lib/site.js`.
- **Search:** Google Search Console Domain property verified (via GoDaddy Domain Connect);
  `sitemap.xml` submitted. JSON-LD Person (home) and TechArticle (case study) in the HTML heads.
- **Analytics:** Vercel Web Analytics enabled; plain script tag in both HTML files (no npm
  package). The `/_vercel/insights/script.js` route only exists on deploys made after enabling.

## Commands
```bash
npm install && npm run dev     # http://localhost:5173
npm run lint && npm run build  # lint must be clean (0 problems)
npx vite preview               # serves dist/, incl. /projects/... pages
```
Deploy: commit on the working branch, push it, then fast-forward `main`
(`git push origin <branch>:main`) once the user says to put it live.

## Layout
```
index.html                         home page (meta, OG, canonical, JSON-LD, analytics)
projects/india-renewables-forecast/index.html   case-study page entry (Vite multi-page)
vite.config.js                     rollup inputs: main + irf
src/App.jsx                        home section order
src/components/                    Hero, FeaturedProject, WorkedWith (timeline + toolkit),
                                   ResearchHighlight (FFT-LSTM paper + patent), FieldWork
                                   (ML-Sol, 6 stations, 2023 poster), SelectedWork (pubs,
                                   projects, honors, courses), About (+ contact), Footer, Navbar, MenuOverlay
src/components/ui/                 animated-hero-section (pong name canvas), particles,
                                   lightbox, browser-frame, scroll-expand (section wrapper, takes id)
src/case-study/                    CaseStudy.jsx, charts.jsx, CaseStudy.css, main.jsx
src/lib/site.js                    CV_URL, CONTACT_EMAIL
src/lib/useLiveResults.js          fetch live results JSON, fall back to bundled snapshot
src/data/irf-results.json          snapshot of the app's model_results.json
public/                            CV pdf, favicons, og-image.png, robots.txt, sitemap.xml,
                                   images/{research,field,app}, patent-certificate.webp, avatar.webp
```

## Conventions
- Colour tokens in `src/index.css`: `--color-accent` #f5a524 (solar amber, on dark),
  `--color-accent-ink` #9a5b00 (amber text on white), `--color-accent-soft`. Plain CSS per
  component; Tailwind is installed but unused.
- Lint: `react-refresh/only-export-components` and React-compiler rules are on. Import
  framer-motion as `motion as Motion` (the repo's no-unused-vars pattern needs a capital).
  No impure calls (Math.random) during render; compute layout at module scope.
- Nav/footer links use `/#section` so they work from the case-study page too.
- Every number on the site comes from a source: the paper (Table 5 etc.), the CV, the
  poster, or the app's published `model_results.json`. Synthetic visuals are labelled.

## Decisions (don't revisit without the user)
- No fake visitor counter (user once asked to start at 3000; declined, misleading). The old
  countapi.xyz counter was removed because the service is dead.
- `abhirthr/ml-demo1` (the forecasting app) is private: never link its code. Its public
  results file `https://solar-forecast.vercel.app/data/model_results.json` (CORS *) is fine.
- Renewable Energy paper is not open access: link the DOI, host figures only, with the
  Elsevier credit line. Never host the PDF.
- Unpublished/ongoing PhD work stays off the site.
- CV on the site must not contain a phone number. Old CV with phone was purged from git
  history (force-push, 2026-11-04); GitHub may still cache commit `e8fb134` by SHA.
- Personal-name `.in` domain; projects go on subdomains (`app.`, `api.`) later.

## Gotchas
- Hero name canvas sizes from its own stage (flex area above the subtitle) and is capped
  at 64% of that height; it overlapped content on short laptop screens before.
- Particles canvas covers the whole light section (ResizeObserver); pixel ratio is capped
  to stay under iOS Safari's ~16.7M-pixel canvas limit.
- SVG animations (station map, decomposition) trigger `whileInView` on the `<svg>` root,
  not on child `<g>`/`<path>` (Safari doesn't fire IntersectionObserver on SVG children).
- The live forecast app's landing animates in; wait ~5 s before screenshots. Its Render
  backend isn't reachable from the cloud sandbox, so forecast panels can't be captured here.
- Vercel returns a TLS reset for a domain not yet added to the project.

## Status (2026-11-04)
Done and live: featured app section with screenshots, research highlight (paper + patent),
field work section, timeline + toolkit, honors, compact courses, contact block, CV download,
case study page, custom domain, email forwarding, Search Console + sitemap, analytics.

## Open items
- User asked for a visible visit counter in the footer again (2026-11-04): needs a real,
  honest count source (not started).
- Next options offered: second case study (FFT-LSTM paper, or ML-Sol + stations);
  `app.abhijeetrathore.in` for the forecasting app; refresh the CV PDF with the new domain
  and `hello@` email (user to supply).
- User to add https://abhijeetrathore.in to LinkedIn, Google Scholar, CV and GitHub.
