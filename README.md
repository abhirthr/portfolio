# abhijeetrathore.in

Personal site of Abhijeet Rathore: PhD researcher at IIT Roorkee working on machine
learning for solar and wind forecasting. Live at **https://abhijeetrathore.in**.

The home page covers the featured forecasting app, the Renewable Energy 2025 paper and
granted patent, field work on a six-station monitoring network, experience, publications,
honors and contact. Two case-study pages go deeper:

- `/projects/india-renewables-forecast/` – the live India-wide solar and wind forecasting app
- `/projects/fft-lstm-solar-forecast/` – the FFT-assisted LSTM paper

## Stack

React 19, Vite 7 (multi-page build), framer-motion for the hero chart, plain CSS per
component with design tokens in `src/index.css` (night and day contexts, solar amber accent,
Newsreader + IBM Plex type). No backend: the site is static and deployed on Vercel from `main`.

## Readable without JavaScript

Every page is **prerendered at build time**. `npm run build` runs the normal client build,
then `scripts/prerender.mjs` renders each page with `react-dom/server` and writes the HTML
into `dist/`. The client entries hydrate that markup, so search engines, link previews,
screen readers and AI agents get the full content from the raw HTML.

Also served for machines: `llms.txt` (a plain-text summary of the whole site), `sitemap.xml`,
`robots.txt`, and JSON-LD (`Person` on the home page, `TechArticle` on the case studies).

Rule for new components: browser APIs (`window`, `document`, canvas, observers, timers)
belong inside `useEffect`. The first render must be deterministic so it matches on the server.

## Commands

```bash
npm install
npm run dev       # http://localhost:5173 (client-rendered, no prerender)
npm run lint      # must be clean
npm run build     # client build + prerender into dist/
npx vite preview  # serve dist/ including the /projects/... pages
```

## Layout

```
index.html, projects/*/index.html   page shells: meta, OG, canonical, JSON-LD
src/entry-server.jsx                 maps page keys to components for prerendering
src/lib/mount.jsx                    hydrate (prod) or render (dev) a page
src/main.jsx, src/case-study/, src/fft-lstm/   page entries and case-study code
src/components/                      home-page sections and shared UI
src/lib/                             site constants, sun-position maths, live-results hook
src/data/irf-results.json            bundled snapshot of the app's published results
public/                              CV, favicons, share images, llms.txt, robots.txt, sitemap.xml
scripts/prerender.mjs                build-time prerender
```
