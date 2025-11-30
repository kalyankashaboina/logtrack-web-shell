// src/main.tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const REMOTE_USERS = (import.meta.env.VITE_USERS_REMOTE as string) ?? 'http://localhost:5001/assets/remoteEntry.js'
const REMOTE_AUDIT = (import.meta.env.VITE_AUDIT_REMOTE as string) ?? 'http://localhost:5002/assets/remoteEntry.js'

console.log('🔌 Host configuration:')
console.log('👉 Users Remote:', REMOTE_USERS)
console.log('👉 Audit Remote:', REMOTE_AUDIT)

// Helper to check whether a remoteEntry is reachable
async function checkRemote(url: string, timeout = 3000): Promise<boolean> {
  try {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    const res = await fetch(url, { method: 'GET', mode: 'cors', signal: controller.signal })
    clearTimeout(id)
    return res.ok
  } catch {
    return false
  }
}

async function bootstrap() {
  const root = createRoot(document.getElementById('root')!)
  root.render(<div style={{ padding: 20 }}>Checking remotes…</div>)

  const usersAvailable = await checkRemote(REMOTE_USERS)
  const auditAvailable = await checkRemote(REMOTE_AUDIT)

  root.render(
    <React.StrictMode>
      <App remotes={{ usersAvailable, auditAvailable }} />
    </React.StrictMode>
  )
}

bootstrap()
