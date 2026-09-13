import React from 'react'
import AlelilLogo from '../brand/AlelilLogo'

const AlelilFooter = ({ categorias = [], onSelectCategory }) => {
  return (
    <footer className="alelil-footer pt-5 pb-4 mt-5">
      <div className="container-xxl">
        <div className="row g-4 mb-4">
          {/* Col 1: Brand Info */}
          <div className="col-12 col-md-4">
            <div className="mb-3">
              <AlelilLogo theme="dark" height={36} showSlogan={true} />
            </div>
            <p className="small text-white-50 mt-3" style={{ maxWidth: '320px', lineHeight: 1.6 }}>
              Tu centro comercial digital de confianza. Encuentra la mejor variedad en tecnología, hogar, herramientas y moda al mejor precio.
            </p>
          </div>

          {/* Col 2: Dynamic Categories Links */}
          <div className="col-6 col-md-3">
            <h4 className="fs-6 fw-bold text-white mb-3 text-uppercase" style={{ letterSpacing: '1px' }}>
              Categorías
            </h4>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              {categorias.slice(0, 5).map((cat) => (
                <li key={cat.nombre}>
                  <button
                    type="button"
                    className="btn btn-link p-0 text-white-50 text-decoration-none small text-start hover-mint"
                    onClick={() => onSelectCategory(cat.nombre)}
                  >
                    {cat.nombre}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div className="col-6 col-md-2">
            <h4 className="fs-6 fw-bold text-white mb-3 text-uppercase" style={{ letterSpacing: '1px' }}>
              Atención
            </h4>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0 opacity-75">
              <li>Centro de ayuda</li>
              <li>Estado de mi pedido</li>
              <li>Políticas de envío</li>
              <li>Devoluciones</li>
              <li>Términos y condiciones</li>
            </ul>
          </div>

          {/* Col 4: Contact & Info */}
          <div className="col-12 col-md-3">
            <h4 className="fs-6 fw-bold text-white mb-3 text-uppercase" style={{ letterSpacing: '1px' }}>
              Contacto
            </h4>
            <div className="small opacity-75 d-flex flex-column gap-2">
              <div>📍 Montería / Colombia</div>
              <div>✉️ contacto@alelil.com.co</div>
              <div>💬 WhatsApp: +57 310 2103434</div>
            </div>
          </div>
        </div>

        <hr className="border-secondary opacity-25 my-4" />

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 small opacity-75">
          <div>© 2026 Alelil Oficial. Todos los derechos reservados.</div>
          <div>Todo lo que necesitas, en un solo lugar</div>
        </div>
      </div>
    </footer>
  )
}

export default AlelilFooter
