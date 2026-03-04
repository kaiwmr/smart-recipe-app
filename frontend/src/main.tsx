import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'
import { BrowserRouter } from 'react-router-dom'

// ==========================================
// 1. ENTRY POINT FINDER
// ==========================================
// Wir suchen das <div> mit der ID 'root' in deiner index.html.
// Das '!' am Ende ist ein TypeScript "Non-null assertion operator".
// Er sagt: "Ich bin mir sicher, dass dieses Element existiert."
const rootElement = document.getElementById('root')!;

// ==========================================
// 2. APP-INITIALISIERUNG & RENDERING
// ==========================================
createRoot(rootElement).render(
  /* StrictMode hilft während der Entwicklung, potenzielle Probleme 
     im Code frühzeitig zu erkennen (z.B. veraltete API-Aufrufe).
  */
  <StrictMode>
    {/* BrowserRouter stellt den "Routing-Context" bereit. 
        Ohne ihn würden Link-Komponenten und useNavigate() nicht funktionieren.
    */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)