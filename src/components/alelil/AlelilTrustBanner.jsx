import React from 'react'
import AlelilLogo from '../brand/AlelilLogo'
import CIcon from '@coreui/icons-react'
import { cilTruck, cilShieldAlt, cilHeadphones, cilArrowRight } from '@coreui/icons'

const AlelilTrustBanner = () => {
  return (
    <footer className="alelil-trust-banner my-5 shadow">
      <div className="container-xxl">
        <div className="row align-items-center g-4 text-center text-lg-start">
          {/* Logo Column */}
          <div className="col-12 col-lg-3 text-center text-lg-start">
            <AlelilLogo theme="dark" height={34} showSlogan={false} />
          </div>

          {/* Guarantees Column */}
          <div className="col-12 col-lg-6">
            <div className="d-flex align-items-center justify-content-center justify-content-lg-around flex-wrap gap-4 text-white">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="p-2 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: 'rgba(0, 200, 150, 0.15)' }}
                >
                  <CIcon icon={cilTruck} size="lg" style={{ color: '#00C896' }} />
                </div>
                <div className="text-start">
                  <div className="fw-bold small">Envíos rápidos</div>
                  <div className="small opacity-75">a todo el país</div>
                </div>
              </div>

              <div className="vr d-none d-md-block opacity-25" style={{ height: '30px' }}></div>

              <div className="d-flex align-items-center gap-2">
                <div
                  className="p-2 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: 'rgba(0, 200, 150, 0.15)' }}
                >
                  <CIcon icon={cilShieldAlt} size="lg" style={{ color: '#00C896' }} />
                </div>
                <div className="text-start">
                  <div className="fw-bold small">Compra segura</div>
                  <div className="small opacity-75">y protegida</div>
                </div>
              </div>

              <div className="vr d-none d-md-block opacity-25" style={{ height: '30px' }}></div>

              <div className="d-flex align-items-center gap-2">
                <div
                  className="p-2 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: 'rgba(0, 200, 150, 0.15)' }}
                >
                  <CIcon icon={cilHeadphones} size="lg" style={{ color: '#00C896' }} />
                </div>
                <div className="text-start">
                  <div className="fw-bold small">Atención</div>
                  <div className="small opacity-75">personalizada</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mint Button Column */}
          <div className="col-12 col-lg-3 text-center text-lg-end">
            <button
              type="button"
              className="btn btn-alelil-mint shadow-sm d-inline-flex align-items-center gap-2"
            >
              <span>Tu mundo, en un solo lugar</span>
              <CIcon icon={cilArrowRight} size="sm" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default AlelilTrustBanner
