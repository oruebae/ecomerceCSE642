import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { google } from 'src/assets/brand/google'
import AlelilLogo from '../../../components/brand/AlelilLogo'
import { supabase } from '../../../lib/supabase'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)
  const [cargandoGoogle, setCargandoGoogle] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // 1. Email & Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor ingrese su correo electrónico y contraseña.')
      return
    }

    setCargando(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMsg('Credenciales incorrectas. Verifique su correo y contraseña.')
        } else {
          setErrorMsg(error.message || 'Error al iniciar sesión. Intente nuevamente.')
        }
      } else if (data?.session) {
        setSuccessMsg('Inicio de sesión exitoso. Redirigiendo...')
        setTimeout(() => {
          navigate('/productos/lista')
        }, 800)
      }
    } catch (err) {
      setErrorMsg('Ocurrió un error inesperado al conectar con el servicio de autenticación.')
    } finally {
      setCargando(false)
    }
  }

  // 2. Google OAuth Login
  const handleGoogleLogin = async () => {
    setErrorMsg('')
    setCargandoGoogle(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/#/productos/lista`,
        },
      })

      if (error) {
        setErrorMsg(`Error con Google OAuth: ${error.message}`)
        setCargandoGoogle(false)
      }
    } catch (err) {
      setErrorMsg('No se pudo iniciar el flujo de autenticación con Google.')
      setCargandoGoogle(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex flex-row align-items-center" style={{ backgroundColor: '#F4F6F8' }}>
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} lg={6} xl={5}>
            <div className="d-flex flex-column gap-4">
              {/* Brand Logo Header */}
              <div className="text-center py-2">
                <AlelilLogo theme="light" height={46} showSlogan={true} />
              </div>

              <CCard className="shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="p-3 text-white text-center" style={{ backgroundColor: '#0B2D5B' }}>
                  <h1 className="h5 fw-bold mb-0">Acceso Administrativo</h1>
                  <small className="opacity-75">Alelil Oficial</small>
                </div>

                <CCardBody className="p-4 d-flex flex-column gap-3">
                  {errorMsg && (
                    <CAlert color="danger" dismissible onClick={() => setErrorMsg('')}>
                      {errorMsg}
                    </CAlert>
                  )}

                  {successMsg && (
                    <CAlert color="success">
                      {successMsg}
                    </CAlert>
                  )}

                  <CForm onSubmit={handleEmailLogin} className="row gy-3">
                    <CCol xs={12}>
                      <CFormLabel htmlFor="email" className="fw-semibold small text-dark">
                        Correo electrónico
                      </CFormLabel>
                      <CFormInput
                        id="email"
                        type="email"
                        placeholder="admin@tienda.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                        className="py-2"
                      />
                    </CCol>

                    <CCol xs={12}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <CFormLabel htmlFor="password" className="fw-semibold small text-dark mb-0">
                          Contraseña
                        </CFormLabel>
                        <Link
                          to="/authentication/reset-password"
                          className="small text-decoration-none"
                          style={{ color: '#00C896', fontWeight: 600 }}
                        >
                          ¿Olvidó su contraseña?
                        </Link>
                      </div>
                      <CInputGroup>
                        <CFormInput
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="current-password"
                          required
                          className="py-2"
                        />
                      </CInputGroup>
                    </CCol>

                    <CCol xs={12} className="mt-4">
                      <CButton
                        type="submit"
                        className="w-100 py-2 border-0 fw-bold shadow-sm"
                        style={{ backgroundColor: '#FF8A00', color: '#FFFFFF' }}
                        disabled={cargando || cargandoGoogle}
                      >
                        {cargando ? (
                          <>
                            <CSpinner size="sm" className="me-2" />
                            Iniciando sesión...
                          </>
                        ) : (
                          'Iniciar Sesión'
                        )}
                      </CButton>
                    </CCol>
                  </CForm>

                  <div className="position-relative my-2">
                    <hr className="text-secondary opacity-25" />
                    <div className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-secondary small font-monospace">
                      O CONTINUAR CON
                    </div>
                  </div>

                  <CButton
                    type="button"
                    variant="outline"
                    className="w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold"
                    style={{ borderColor: '#CBD5E1', color: '#0B2D5B' }}
                    onClick={handleGoogleLogin}
                    disabled={cargando || cargandoGoogle}
                  >
                    {cargandoGoogle ? (
                      <CSpinner size="sm" />
                    ) : (
                      <>
                        <CIcon icon={google} />
                        <span>Iniciar sesión con Google</span>
                      </>
                    )}
                  </CButton>

                  <div className="text-center mt-3 pt-2 border-top">
                    <span className="text-secondary small me-1">¿No tienes una cuenta?</span>
                    <Link
                      to="/authentication/register"
                      className="small text-decoration-none fw-bold"
                      style={{ color: '#00C896' }}
                    >
                      Crear una cuenta
                    </Link>
                  </div>
                </CCardBody>
              </CCard>

              <div className="text-center small text-secondary">
                <Link to="/productos/catalogo" className="text-decoration-none fw-semibold" style={{ color: '#0B2D5B' }}>
                  ← Volver a la Tienda Comercial
                </Link>
              </div>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
