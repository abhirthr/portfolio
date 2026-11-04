# Abhijeet Rathore — portfolio

Personal site of Abhijeet Rathore, PhD researcher at IIT Roorkee working on machine
learning for solar and wind forecasting.

**Live:** https://portfolio-beta-lovat-12.vercel.app

## What's on the page

| Section | Component |
| --- | --- |
| Hero (pixel-name animation, CV and contact buttons) | `src/components/Hero.jsx` |
| Featured project: India Renewables Forecast | `src/components/FeaturedProject.jsx` |
| Experience timeline and toolkit | `src/components/WorkedWith.jsx` |
| Research highlight: FFT-assisted LSTM paper and granted patent | `src/components/ResearchHighlight.jsx` |
| Research Engineer work: ML-Sol, six weather stations, 2023 poster | `src/components/FieldWork.jsx` |
| Publications, research projects, honors, courses | `src/components/SelectedWork.jsx` |
| About and contact | `src/components/About.jsx` |

### Case studies

Each case study is its own static page (Vite multi-page build, see `vite.config.js`):

- `/projects/india-renewables-forecast/`: entry `projects/india-renewables-forecast/index.html`,
  code in `src/case-study/`. Its numbers load live from the app's published
  `data/model_results.json`, with a bundled snapshot in `src/data/irf-results.json` as fallback.

Shared pieces live in `src/components/ui/` (particle background, image lightbox,
section wrapper). Site-wide settings such as the CV path and contact email are in
`src/lib/site.js`; colour tokens (including the solar-amber accent) are in
`src/index.css`.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build    # output in dist/
```

Built with React 19, Vite and framer-motion. Deployed on Vercel from `main`.

## Assets

- `public/images/research/`: figures from Rathore et al., *Renewable Energy* 247 (2025)
  123021, © Elsevier, reproduced by the author. The paper itself is linked by DOI, not hosted.
- `public/images/field/`: ML-Sol screenshots and the Research Scholars' Day 2023 poster.
- `public/Abhijeet_Rathore_CV.pdf`: the CV behind the Download CV button. To update it,
  replace the file (keep the name) or change `CV_URL` in `src/lib/site.js`.
- `public/og-image.png`: the preview card shown when the link is shared.
