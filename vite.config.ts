import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The render-engine lives in src/render-engine (a folder, not a package) for the MVP, so no alias
// is needed yet. `dedupe` is kept anyway: it guarantees a single copy of react / react-dom /
// @xyflow/react even once the engine is extracted to its own package and consumed via alias — the
// gotcha that bites when two React copies meet (invalid-hook-call). jsx is automatic by default
// with @vitejs/plugin-react.
//
// `base` is `/sql/` for the production BUILD only (the app deploys under
// graphl.in/sql/ as a concept app in the GraphL catalog, so built asset URLs must be
// subpath-relative). Dev/serve stays at `/` so `npm run dev` and the capture/record scripts (which
// drive the dev server at localhost:5173/#/<id>) are unaffected.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/sql/' : '/',
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', '@xyflow/react'],
  },
  server: { port: 5173 },
}))
