import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import './App.scss'

const Users = React.lazy(() => import('users_app/UsersWidget') as any)
const Audit = React.lazy(() => import('audit_app/AuditWidget') as any) // loaded into analyticsAvailable prop

type Remotes = {
  usersAvailable: boolean
  auditAvailable: boolean
}

function Logo() {
  return (
    <div className="logo">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect width="24" height="24" rx="6" fill="#0EA5A4" />
        <path d="M7 12.5h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 8.5h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="logo-text"> Log Track</span>
    </div>
  )
}

function Nav({ remotes }: { remotes: Remotes }) {
  return (
    <nav className="nav">
      <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        Home
      </NavLink>

      <NavLink to="/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        Users
        {!remotes.usersAvailable && <span className="badge offline">offline</span>}
      </NavLink>

      <NavLink to="/audit" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        Audit
        {!remotes.auditAvailable && <span className="badge offline">offline</span>}
      </NavLink>
    </nav>
  )
}

function RemoteSpinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <div className="spinner" />
      <div className="spinner-label">{label}…</div>
    </div>
  )
}

export default function App({ remotes }: { remotes: Remotes }) {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <div className="header-left">
            <Logo />
            <Nav remotes={remotes} />
          </div>

          <div className="header-right">
            <div className="remote-status">
              <div className="status-row">
                <span className="status-dot" aria-hidden style={{ background: remotes.usersAvailable ? '#16a34a' : '#ef4444' }} />
                <span className="status-text">Users: {remotes.usersAvailable ? 'online' : 'offline'}</span>
              </div>

              <div className="status-row">
                <span className="status-dot" aria-hidden style={{ background: remotes.auditAvailable ? '#16a34a' : '#ef4444' }} />
                <span className="status-text">Audit: {remotes.auditAvailable ? 'online' : 'offline'}</span>
              </div>
            </div>

            <div className="avatar" title="Admin">
              <span>A</span>
            </div>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={
            <div className="welcome-card">
  <h2>Welcome to the Host App</h2>
  <p>
    This application serves as the central <strong>host</strong> and loads features from
    independent <strong>micro-frontends</strong>.
  </p>

  <ul className="welcome-list">
    <li>
      <strong>Users App</strong> — manages user information
      {remotes.usersAvailable ? (
        <span className="status-pill online">online</span>
      ) : (
        <span className="status-pill offline">offline</span>
      )}
    </li>

    <li>
      <strong>Audit App</strong> — analytics & audit trail
      {remotes.auditAvailable ? (
        <span className="status-pill online">online</span>
      ) : (
        <span className="status-pill offline">offline</span>
      )}
    </li>
  </ul>

  <p className="welcome-note">
    Use the navigation bar above to open each micro-frontend.
  </p>
</div>

              }
            />

            <Route
              path="/users"
              element={
                remotes.usersAvailable ? (
                  <Suspense fallback={<RemoteSpinner label="Loading users" />}>
                    <Users />
                  </Suspense>
                ) : (
                  <div className="remote-offline">
                    <h3>Users remote offline</h3>
                    <p>The Users micro-frontend is not available right now. Try again later.</p>
                  </div>
                )
              }
            />

            <Route
              path="/audit"
              element={
                remotes.auditAvailable ? (
                  <Suspense fallback={<RemoteSpinner label="Loading audit" />}>
                    <Audit />
                  </Suspense>
                ) : (
                  <div className="remote-offline">
                    <h3>Audit remote offline</h3>
                    <p>The Audit micro-frontend is not available right now. Try again later.</p>
                  </div>
                )
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
