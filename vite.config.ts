import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The render engine is the @graphlearning/flow package, not a local folder. `dedupe` keeps a single
// copy of react / react-dom / @xyflow/react across this app and the package — the gotcha that bites
// when two React copies meet (invalid-hook-call). The package declares them as peer deps and
// externalises them, so it never carries its own React; dedupe is the belt to that braces.
// jsx is automatic by default with @vitejs/plugin-react.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/sql/' : '/',
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', '@xyflow/react'],
  },
  server: { port: 5173 },
}))
