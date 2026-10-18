import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from '@/lib/i18n'
import { MotionProvider } from '@/motion/MotionProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <MotionProvider>
        <App />
      </MotionProvider>
    </I18nProvider>
  </StrictMode>,
)
