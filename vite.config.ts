import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// Consume the sibling reveal-engine straight from SOURCE via an alias — live HMR against the
// engine while we co-develop, no build/publish/dist needed. Importing `reveal-engine` (the src
// entry) pulls in the engine's own CSS + self-hosted Plex fonts, so no separate styles.css or
// @fontsource imports are needed here. `reveal-engine/pure` is the DOM-free core (types +
// validateCourse). `fs.allow: ['..']` lets the dev server read the sibling engine source.
const engineSrc = fileURLToPath(new URL('../reveal-engine/src/index.ts', import.meta.url))
const enginePure = fileURLToPath(new URL('../reveal-engine/src/pure/index.ts', import.meta.url))

// `base` is the GitHub Pages project subpath in production (served at graphl.in/sql/); dev stays
// at root. import.meta.env.BASE_URL reflects this, so per-course audio resolves correctly in both
// (see App.tsx audioBase).
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/sql/' : '/',
  resolve: {
    alias: [
      { find: /^reveal-engine\/pure$/, replacement: enginePure },
      { find: /^reveal-engine$/, replacement: engineSrc },
    ],
  },
  server: { fs: { allow: ['..'] } },
  plugins: [react()],
}))
