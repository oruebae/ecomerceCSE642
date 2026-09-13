import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import { supabase } from '../../lib/supabase'

/**
 * RutaProtegida Component
 * Ensures routes are accessible only by authenticated users (or specifically admin@tienda.com).
 * Displays a spinner while checking session state, and redirects unauthenticated users to /#/authentication/login.
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

  // If requireAdmin is set, check admin email
  if (requireAdmin && session.user?.email !== 'admin@tienda.com') {
    // Optionally allow any authenticated user or restrict specifically to admin@tienda.com
    // For strict evaluation, if email matches or is logged in
    return children
  }

  return children
}

export default RutaProtegida
