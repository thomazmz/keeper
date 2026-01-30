import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// import { App } from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <h1>Keeper</h1>
    <p>A finance record-keeper that automatically syncs and extracts transactions from your Gmail emails into a structured, searchable ledger.</p>
  </StrictMode>,
)
