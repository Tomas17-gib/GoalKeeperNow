import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CarritoProvider } from './context/CarritoContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ThemeProvider>
    <ToastProvider>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </ToastProvider>
  </ThemeProvider>
</StrictMode>,
)
