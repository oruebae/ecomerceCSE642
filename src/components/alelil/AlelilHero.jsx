import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilTruck, cilShieldAlt, cilHeadphones, cilArrowRight } from '@coreui/icons'

const AlelilHero = ({ onVerOfertasClick }) => {
  return (
    <section className="alelil-hero-container my-4 p-4 p-md-5">
      <div className="row align-items-center g-4">
        {/* Left Column: Copy & CTAs */}
        <div className="col-12 col-lg-7">
          <div className="mb-3">
            <span className="hero-badge shadow-sm">
              MES DE LA TECNOLOGÍA
            </span>
          </div>

          <h1 className="hero-title mb-3">
            TECNOLOGÍA
          </h1>

          <p className="fs-5 text-secondary mb-4" style={{ maxWidth: '520px', lineHeight: 1.5 }}>
            Los mejores dispositivos, las mejores marcas, en un solo lugar.
          </p>

          {/* Benefits / Trust Indicators */}
          <div className="d-flex align-items-center flex-wrap gap-3 mb-4 py-2 border-top border-bottom border-light-subtle">
            <div className="d-flex align-items-center gap-2 small fw-semibold text-dark">
              <CIcon icon={cilTruck} size="lg" style={{ color: '#00C896' }} />
              <span>Envíos a todo el país</span>
            </div>
            <div className="vr d-none d-sm-block opacity-25"></div>
            <div className="d-flex align-items-center gap-2 small fw-semibold text-dark">
              <CIcon icon={cilShieldAlt} size="lg" style={{ color: '#00C896' }} />
              <span>Compra segura</span>
            </div>
            <div className="vr d-none d-sm-block opacity-25"></div>
            <div className="d-flex align-items-center gap-2 small fw-semibold text-dark">
              <CIcon icon={cilHeadphones} size="lg" style={{ color: '#00C896' }} />
              <span>Atención personalizada</span>
            </div>
          </div>

          {/* CTA Button */}
          <div>
            <button
              type="button"
              className="btn btn-alelil-orange btn-lg d-inline-flex align-items-center gap-2 fs-6"
              onClick={onVerOfertasClick}
            >
              <span>Ver ofertas</span>
              <CIcon icon={cilArrowRight} size="lg" />
            </button>
          </div>
        </div>

        {/* Right Column: Clean Integrated Photograph (Single composition, no inner card/balloon) */}
        <div className="col-12 col-lg-5 text-center text-lg-end">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
            alt="Mes de la Tecnología Alelil"
            className="img-fluid rounded-4 object-fit-cover w-100 shadow-sm"
            style={{ maxHeight: '320px' }}
          />
        </div>
      </div>
    </section>
  )
}

export default AlelilHero
