import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from './contexts/ToastContext'
import { AuthRoleProvider } from './contexts/AuthRoleContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <AuthRoleProvider>
        <App />
      </AuthRoleProvider>
    </ToastProvider>
  </StrictMode>,
)
