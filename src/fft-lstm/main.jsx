import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import '../index.css'
import FftLstm from './FftLstm.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <FftLstm />
    </MotionConfig>
  </StrictMode>,
)
