// Prerender the three pages into dist/ after the client build.
// Runs an SSR build of src/entry-server.jsx into a temp folder, renders each
// page to a string and injects it into the matching dist HTML file.
import { build } from 'vite'
import { readFile, writeFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const ssrDir = resolve(root, '.ssr-tmp')

const pages = [
  { key: 'main', file: 'dist/index.html' },
  { key: 'irf', file: 'dist/projects/india-renewables-forecast/index.html' },
  { key: 'fft', file: 'dist/projects/fft-lstm-solar-forecast/index.html' },
]

await build({
  root,
  logLevel: 'warn',
  build: { ssr: 'src/entry-server.jsx', outDir: ssrDir, emptyOutDir: true },
})

const { render } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href)

for (const { key, file } of pages) {
  const path = resolve(root, file)
  const html = await readFile(path, 'utf8')
  const marker = '<div id="root"></div>'
  if (!html.includes(marker)) throw new Error(`${file}: root marker not found`)
  const out = html.replace(marker, `<div id="root">${render(key)}</div>`)
  await writeFile(path, out)
  console.log(`prerendered ${file} (${(out.length / 1024).toFixed(1)} kB)`)
}

await rm(ssrDir, { recursive: true, force: true })
