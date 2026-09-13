import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AlelilLogo from '../brand/AlelilLogo'
import { CBadge, CButton, CFormInput } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilUser, cilCart, cilAccountLogout } from '@coreui/icons'
import { supabase } from '../../lib/supabase'

const AlelilHeader = ({ busqueda, onBusquedaChange, totalCarrito = 0, onCartClick }) => {
  const navigate = useNavigate()
  const [sesionActiva, setSesionActiva] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSesionActiva(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSesionActiva(session)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const handleMiCuentaClick = () => {
    if (sesionActiva) {
      navigate('/productos/lista')
    } else {
      navigate('/authentication/login')
    }
  }

  return (
    <header className="alelil-header-top">
      <div className="container-xxl d-flex align-items-center justify-content-between flex-wrap gap-3">
        {/* Brand Logo */}
        <div className="d-flex align-items-center me-3 cursor-pointer" onClick={() => navigate('/productos/catalogo')}>
          <AlelilLogo theme="dark" height={38} showSlogan={false} />
        </div>

        {/* Search Bar */}
        <div className="flex-grow-1 mx-md-4 my-2 my-md-0" style={{ maxWidth: '560px' }}>
          <div className="position-relative">
            <CFormInput
              type="search"
              className="alelil-search-input py-2"
              placeholder="Buscar productos, marcas y más..."
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              aria-label="Buscar productos"
            />
            <button
              type="button"
              className="position-absolute end-0 top-50 translate-middle-y me-3 border-0 bg-transparent text-secondary p-0"
              aria-label="Buscar"
            >
              <CIcon icon={cilSearch} size="lg" />
            </button>
          </div>
        </div>

        {/* Right actions: Account & Cart */}
        <div className="d-flex align-items-center gap-3">
          <CButton
            variant="outline"
            color="light"
            className="text-white border-0 d-flex align-items-center gap-2 fw-semibold px-3 py-2"
            style={{ fontSize: '0.92rem' }}
            onClick={handleMiCuentaClick}
          >
            <CIcon icon={cilUser} size="lg" style={{ color: sesionActiva ? '#00C896' : '#FFFFFF' }} />
            <span className="d-none d-sm-inline">
              {sesionActiva ? 'Panel Admin' : 'Mi cuenta'}
            </span>
          </CButton>

          <button
            type="button"
            className="btn d-flex align-items-center gap-2 px-3 py-2 position-relative text-white border-0"
            onClick={onCartClick}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '50px',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
            }}
          >
            <CIcon icon={cilCart} size="lg" />
            <span>Carrito</span>
            <CBadge
              shape="rounded-pill"
              style={{
                backgroundColor: '#00C896',
                color: '#0B2D5B',
                fontWeight: 800,
                fontSize: '0.82rem',
              }}
            >
              {totalCarrito}
            </CBadge>
          </button>
        </div>
      </div>
    </header>
  )
}

export default AlelilHeader
