import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n/i18n.js'
import { setAssetConfig, assetUrl } from './utils/assets'
import api from './services/api'
import LocalFavicon from './Images/Sparkie.png'

function ensureFaviconLink() {
  let link = document.querySelector("link[rel='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  return link
}

async function bootstrap() {
  // Set a local bundled fallback immediately to avoid initial 404s
  const initialLink = ensureFaviconLink()
  initialLink.href = LocalFavicon

  try {
    const res = await api.get('/assets/config')
    const data = res.data
    const configured = Boolean(data?.cloudinary?.configured)
    if (configured) {
      const base = data?.cloudinary?.deliveryBase || ''
      const folder = data?.cloudinary?.folder || ''
      setAssetConfig({ base, folder })
      const link = ensureFaviconLink()
      link.href = assetUrl('/Images/Sparkie.png')
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

 
