import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import { supabase } from '../../lib/supabase'

/**
 * RutaProtegida Component
 * Ensures routes are accessible only by authenticated users.
 * If requireAdmin is true, enforces that the logged-in email is specifically admin@tienda.com.
 * Redirects unauthenticated users to /authentication/login and blocks non-admin users with an Access Denied view.
 */
const RutaProtegida = ({ children, requireAdmin = false }) => {
  const [session, setSession] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let mounted = true

    // Fetch initial active session
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      if (mounted) {
        setSession(activeSession)
        setCargando(false)
      }
    })

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (mounted) {
        setSession(currentSession)
        setCargando(false)
      }
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <CSpinner style={{ color: '#00C896' }} />
        <span className="ms-3 fw-semibold text-secondary">Verificando sesión...</span>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/authentication/login" replace />
  }

  // Strict role evaluation: If requireAdmin is set, demand admin@tienda.com
  if (requireAdmin && session.user?.email !== 'admin@tienda.com') {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
        <div
          className="card shadow-sm border-0 rounded-4 p-4 text-center"
          style={{ maxWidth: '480px', backgroundColor: '#FFFFFF' }}
        >
          <div className="mb-3">
            <span
              className="d-inline-flex align-items-center justify-content-center rounded-circle p-3"
              style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
            >
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </span>
          </div>

          <h3 className="h5 fw-bold mb-2" style={{ color: '#0B2D5B' }}>
            Acceso Restringido - Requiere Admin
          </h3>
          <p className="text-secondary small mb-4">
            Has iniciado sesión con el correo <strong className="text-dark">{session.user?.email}</strong>.
            Sin embargo, las funciones de administración están reservadas exclusivamente para el correo{' '}
            <strong style={{ color: '#0B2D5B' }}>admin@tienda.com</strong>.
          </p>

          <div className="d-flex flex-column gap-2">
            <a
              href="/#/productos/catalogo"
              className="btn py-2 border-0 fw-semibold text-white rounded-3"
              style={{ backgroundColor: '#0B2D5B' }}
            >
              ← Volver a la Tienda Comercial
            </a>
            <button
              type="button"
              className="btn btn-outline-danger py-2 fw-semibold rounded-3"
              onClick={async () => {
                await supabase.auth.signOut()
                window.location.href = '#/authentication/login'
              }}
            >
              Cerrar Sesión e Iniciar como Admin
            </button>
          </div>
        </div>
      </div>
    )
  }

  return children
}

export default RutaProtegida
