import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Router from './Router';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div>Fake Nav Bar</div>
    <Router />
  </StrictMode>,
)
