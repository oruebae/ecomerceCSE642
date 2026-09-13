import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilTruck, cilShieldAlt, cilHeadphones, cilCheckAlt } from '@coreui/icons'

const beneficios = [
  {
    icon: cilTruck,
    title: 'Envíos a todo el país',
    desc: 'Entrega rápida y garantizada en todas las provincias.',
  },
  {
    icon: cilShieldAlt,
    title: 'Compra segura',
    desc: 'Protección integral de tus pagos y datos personales.',
  },
  {
    icon: cilHeadphones,
    title: 'Atención personalizada',
    desc: 'Soporte directo antes, durante y después de tu compra.',
  },
  {
    icon: cilCheckAlt,
    title: 'Productos seleccionados',
    desc: 'Catálogo de alta calidad y garantía oficial.',
  },
]

const AlelilBenefits = () => {
  return (
    <section className="my-5 py-4">
      <div className="text-center mb-4">
        <h2 className="fs-3 fw-bold mb-1" style={{ color: '#0B2D5B' }}>
          ¿Por qué comprar en Alelil?
        </h2>
        <p className="text-secondary small mb-0">
          Tu satisfacción y confianza son nuestra máxima prioridad
        </p>
      </div>

      <div className="row g-4">
        {beneficios.map((b, i) => (
          <div className="col-12 col-sm-6 col-lg-3" key={i}>
            <div className="p-4 bg-white rounded-4 shadow-sm border-0 h-100 text-center d-flex flex-column align-items-center">
              <div
                className="p-3 rounded-circle mb-3 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: 'rgba(0, 200, 150, 0.1)', width: '64px', height: '64px' }}
              >
                <CIcon icon={b.icon} size="xl" style={{ color: '#00C896' }} />
              </div>
              <h3 className="fs-6 fw-bold mb-2 text-dark">{b.title}</h3>
              <p className="small text-secondary mb-0">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AlelilBenefits
