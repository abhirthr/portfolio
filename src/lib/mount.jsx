import { StrictMode, createElement } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'

// Hydrate the prerendered markup from the production build; in `vite dev`
// the root is empty, so render from scratch instead.
export function mount(page) {
  const root = document.getElementById('root')
  const tree = (
    <StrictMode>
      <MotionConfig reducedMotion="user">{createElement(page)}</MotionConfig>
    </StrictMode>
  )
  if (root.hasChildNodes()) hydrateRoot(root, tree)
  else createRoot(root).render(tree)
}
