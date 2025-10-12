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

// Probe whether a cross-origin image actually loads (handles ORB/404 cases)
function imageLoads(url, timeoutMs = 4000) {
  return new Promise((resolve) => {
    const img = new Image()
    let settled = false
    const done = (ok) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      // Abort load to avoid keeping the image alive unnecessarily
      img.src = ''
      resolve(ok)
    }
    const timer = setTimeout(() => done(false), timeoutMs)
    img.onload = () => done(true)
    img.onerror = () => done(false)
    img.src = url
  })
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
      // Test one known asset to avoid switching to Cloudinary if responses are blocked/404
      const probeUrl = `${base}/${folder ? `${folder}/` : ''}Sparkie.png`
      const ok = await imageLoads(probeUrl, 5000)
      if (ok) {
        setAssetConfig({ base, folder })
        const link = ensureFaviconLink()
        link.href = assetUrl('/Images/Sparkie.png')
      } else {
        // Fall back to local assets if Cloudinary is unreachable or blocked
        setAssetConfig({ base: '', folder: '' })
        const link = ensureFaviconLink()
        link.href = LocalFavicon
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

 
