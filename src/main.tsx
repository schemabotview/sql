import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// The engine's stylesheet contract in one import: react-flow's stylesheet plus the self-hosted IBM
// Plex faces its layout is calibrated to. Owned by @graphlearning/flow so a content repo cannot
// forget it.
import '@graphlearning/flow/styles.css'
import './index.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
