import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Multi-page build: the portfolio home plus one static page per case study.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        irf: resolve(import.meta.dirname, 'projects/india-renewables-forecast/index.html'),
        fft: resolve(import.meta.dirname, 'projects/fft-lstm-solar-forecast/index.html'),
      },
    },
  },
})
