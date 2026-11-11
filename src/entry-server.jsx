import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { MotionConfig } from 'framer-motion'
import App from './App.jsx'
import CaseStudy from './case-study/CaseStudy.jsx'
import FftLstm from './fft-lstm/FftLstm.jsx'

// Build-time prerender entry (see scripts/prerender.mjs). Each page is
// rendered to static HTML so the content is in the document before any
// JavaScript runs; the client entries then hydrate it.
const PAGES = {
  main: App,
  irf: CaseStudy,
  fft: FftLstm,
}

export function render(page) {
  const Page = PAGES[page]
  if (!Page) throw new Error(`Unknown page "${page}"`)
  return renderToString(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <Page />
      </MotionConfig>
    </StrictMode>,
  )
}
