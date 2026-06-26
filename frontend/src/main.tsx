import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { LiveGuideProvider } from './context/LiveGuideContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LiveGuideProvider>
      <App />
    </LiveGuideProvider>
  </StrictMode>,
)
