import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import FftLstm from './FftLstm.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FftLstm />
  </StrictMode>,
)
