import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

const Register = () => {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [cargando, setCargando] = useState(false)
  const [cargandoGoogle, setCargandoGoogle] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor complete todos los campos obligatorios.')
      return
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden. Verifíquelas e intente de nuevo.')
      return
    }

    setCargando(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      })

      if (error) {
        setErrorMsg(error.message || 'Ocurrió un error al registrar el usuario.')
      } else {
        if (data?.session) {
          setSuccessMsg('¡Registro exitoso! Iniciando sesión automáticamente...')
          setTimeout(() => {
            navigate('/productos/lista')
          }, 1000)
        } else {
          setSuccessMsg(
            '¡Registro completado! Si la confirmación por correo está habilitada, revise su bandeja de entrada. De lo contrario, ya puede iniciar sesión.'
          )
          setTimeout(() => {
            navigate('/authentication/login')
          }, 2500)
        }
      }
    } catch (err) {
      setErrorMsg('Ocurrió un error inesperado al conectar con Supabase.')
    } finally {
      setCargando(false)
    }
  }

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
            <div className="d-flex flex-column gap-4 py-4">
              {/* Brand Logo Header */}
              <div className="text-center py-2">
                <AlelilLogo theme="light" height={46} showSlogan={true} />
              </div>

              <CCard className="shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="p-3 text-white text-center" style={{ backgroundColor: '#0B2D5B' }}>
                  <h1 className="h5 fw-bold mb-0">Crear Cuenta en Alelil</h1>
                  <small className="opacity-75">Regístrate para acceder al panel</small>
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

                  <CForm onSubmit={handleRegister} className="row gy-3">
                    <CCol xs={12}>
                      <CFormLabel htmlFor="fullName" className="fw-semibold small text-dark">
                        Nombre completo
                      </CFormLabel>
                      <CFormInput
                        id="fullName"
                        type="text"
                        placeholder="Ej. Juan Pérez"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        autoComplete="name"
                        className="py-2"
                      />
                    </CCol>

                    <CCol xs={12}>
                      <CFormLabel htmlFor="email" className="fw-semibold small text-dark">
                        Correo electrónico
                      </CFormLabel>
                      <CFormInput
                        id="email"
                        type="email"
                        placeholder="usuario@dominio.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                        className="py-2"
                      />
                    </CCol>

                    <CCol xs={12}>
                      <CFormLabel htmlFor="password" className="fw-semibold small text-dark">
                        Contraseña
                      </CFormLabel>
                      <CFormInput
                        id="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        className="py-2"
                      />
                    </CCol>

                    <CCol xs={12}>
                      <CFormLabel htmlFor="confirmPassword" className="fw-semibold small text-dark">
                        Confirmar Contraseña
                      </CFormLabel>
                      <CFormInput
                        id="confirmPassword"
                        type="password"
                        placeholder="Repita su contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        className="py-2"
                      />
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
                            Registrando cuenta...
                          </>
                        ) : (
                          'Registrarse'
                        )}
                      </CButton>
                    </CCol>
                  </CForm>

                  <div className="position-relative my-2">
                    <hr className="text-secondary opacity-25" />
                    <div className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-secondary small font-monospace">
                      O REGÍSTRATE CON
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
                        <span>Continuar con Google</span>
                      </>
                    )}
                  </CButton>

                  <div className="text-center mt-3 pt-2 border-top">
                    <span className="text-secondary small me-1">¿Ya tienes una cuenta?</span>
                    <Link
                      to="/authentication/login"
                      className="small text-decoration-none fw-bold"
                      style={{ color: '#00C896' }}
                    >
                      Iniciar Sesión
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

export default Register
