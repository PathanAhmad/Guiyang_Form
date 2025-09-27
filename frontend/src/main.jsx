import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n/i18n.js'
import { setAssetConfig, assetUrl } from './utils/assets'

async function bootstrap() {
  try {
    const res = await fetch('/api/assets/config', { credentials: 'include' })
    if (res.ok) {
      const data = await res.json()
      const configured = Boolean(data?.cloudinary?.configured)
      if (configured) {
        const base = data?.cloudinary?.deliveryBase || ''
        const folder = data?.cloudinary?.folder || ''
        setAssetConfig({ base, folder })
        const link = document.querySelector("link[rel='icon']")
        if (link) {
          link.href = assetUrl('/Images/Sparkie.png')
        }
      }
    }
  } catch (e) {
    // ignore, fallback to local assets
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

bootstrap()

 
