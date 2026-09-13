import React from 'react'
import { CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCart, cilCheck, cilTag } from '@coreui/icons'
import { formatearPrecioCOP } from './AlelilCartModal'

const AlelilOffers = ({ productos = [], carritoItems = [], onAgregarAlCarrito }) => {
  // Filter products in stock
  const productosOferta = productos.filter((p) => Number(p.stock) > 0).slice(0, 4)

  if (productosOferta.length === 0) {
    return null
  }

  return (
    <section className="my-5 p-4 rounded-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
      <div className="d-flex align-items-center gap-2 mb-4">
        <div className="p-2 rounded-circle bg-warning bg-opacity-10">
          <CIcon icon={cilTag} size="lg" style={{ color: '#FF8A00' }} />
        </div>
        <div>
          <h2 className="fs-4 fw-bold mb-0" style={{ color: '#0B2D5B' }}>
            Ofertas Destacadas
          </h2>
          <small className="text-secondary">
            Artículos disponibles con stock entrega inmediata en Colombia
          </small>
        </div>
      </div>

      <CRow className="g-4">
        {productosOferta.map((producto) => {
          const itemEnCarrito = carritoItems.find((item) => item.id === producto.id)

          return (
            <CCol xs={12} sm={6} md={3} key={producto.id}>
              <div className="card alelil-product-card h-100 d-flex flex-column p-3">
                <div className="position-relative ratio ratio-4x3 mb-3 rounded-3 overflow-hidden bg-light">
                  <img
                    src={
                      producto.imagen_url ||
                      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={producto.nombre}
                    className="img-fluid object-fit-cover w-100 h-100"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://placehold.co/600x400/f4f6f8/0b2d5b?text=Alelil'
                    }}
                  />
                  <div className="position-absolute top-0 end-0 p-2">
                    <span
                      className="badge shadow-sm text-white"
                      style={{ backgroundColor: '#FF8A00', fontWeight: 700 }}
                    >
                      En Oferta
                    </span>
                  </div>
                </div>

                <div className="d-flex flex-column flex-grow-1">
                  <h4 className="fs-6 fw-bold text-dark mb-2">{producto.nombre}</h4>
                  <div className="mt-auto pt-2">
                    <div className="d-flex align-items-baseline justify-content-between mb-3">
                      <span className="product-price">{formatearPrecioCOP(producto.precio)}</span>
                      <span className="small text-secondary">Stock: {producto.stock}</span>
                    </div>

                    <button
                      type="button"
                      className={`btn w-100 btn-add-cart py-2 d-flex align-items-center justify-content-center gap-2 ${
                        itemEnCarrito ? 'btn-success text-white' : ''
                      }`}
                      style={{
                        backgroundColor: itemEnCarrito ? '#00C896' : '#FF8A00',
                      }}
                      onClick={() => onAgregarAlCarrito(producto)}
                    >
                      <CIcon icon={itemEnCarrito ? cilCheck : cilCart} size="sm" />
                      <span>
                        {itemEnCarrito
                          ? `En carrito (${itemEnCarrito.cantidad})`
                          : 'Aprovechar oferta'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </CCol>
          )
        })}
      </CRow>
    </section>
  )
}

export default AlelilOffers
