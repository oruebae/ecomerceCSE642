import React, { useState } from 'react'
import {
  CAlert,
  CBadge,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilCart, cilPlus, cilMinus, cilCheck, cilArrowRight } from '@coreui/icons'

// Formatter utility for COP prices
export const formatearPrecioCOP = (precio) => {
  const valor = Number(precio) || 0
  const valorCOP = valor < 1000 ? Math.round(valor * 4000) : valor
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valorCOP)
}

const AlelilCartModal = ({
  visible,
  onClose,
  items = [],
  onUpdateCantidad,
  onRemoveItem,
  onVaciarCarrito,
}) => {
  const [compraExitosa, setCompraExitosa] = useState(false)

  // Calculate total
  const totalGeneral = items.reduce((acc, item) => {
    const valor = Number(item.precio) || 0
    const valorCOP = valor < 1000 ? Math.round(valor * 4000) : valor
    return acc + valorCOP * (item.cantidad || 1)
  }, 0)

  const handleFinalizarCompra = () => {
    setCompraExitosa(true)
    setTimeout(() => {
      onVaciarCarrito()
      setCompraExitosa(false)
      onClose()
    }, 2500)
  }

  return (
    <CModal visible={visible} onClose={onClose} alignment="center" size="lg" className="alelil-cart-modal">
      <CModalHeader style={{ backgroundColor: '#0B2D5B', color: '#FFFFFF' }}>
        <CModalTitle className="h5 fw-bold text-white mb-0 d-flex align-items-center gap-2">
          <CIcon icon={cilCart} size="lg" style={{ color: '#00C896' }} />
          <span>Carrito de Compras (Alelil Oficial)</span>
          <CBadge shape="rounded-pill" style={{ backgroundColor: '#00C896', color: '#0B2D5B' }}>
            {items.reduce((sum, item) => sum + (item.cantidad || 1), 0)} ítems
          </CBadge>
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="p-4">
        {compraExitosa && (
          <CAlert color="success" className="d-flex align-items-center gap-3 border-0 shadow-sm mb-4">
            <CIcon icon={cilCheck} size="xl" />
            <div>
              <h4 className="alert-heading h6 fw-bold mb-1">¡Pedido procesado con éxito!</h4>
              <p className="mb-0 small">
                Gracias por tu compra en Alelil Oficial. Nos pondremos en contacto para gestionar el envío.
              </p>
            </div>
          </CAlert>
        )}

        {items.length === 0 ? (
          <div className="text-center py-5">
            <CIcon icon={cilCart} size="4xl" className="text-secondary opacity-25 mb-3" />
            <h4 className="h6 fw-bold text-secondary mb-2">Tu carrito está vacío</h4>
            <p className="small text-secondary mb-3">
              Explora nuestro catálogo e incluye tus productos favoritos.
            </p>
            <CButton
              className="border-0 fw-bold px-4 py-2"
              style={{ backgroundColor: '#FF8A00', color: '#FFFFFF' }}
              onClick={onClose}
            >
              Ver Catálogo Comercial
            </CButton>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            <div className="table-responsive rounded-3 border overflow-hidden">
              <table className="table align-middle mb-0">
                <thead style={{ backgroundColor: '#F4F6F8' }}>
                  <tr className="small text-secondary font-monospace">
                    <th className="py-2 ps-3">Producto</th>
                    <th className="py-2">Precio Unit.</th>
                    <th className="py-2 text-center">Cantidad</th>
                    <th className="py-2 text-end">Subtotal</th>
                    <th className="py-2 text-center pe-3">Quitar</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const valor = Number(item.precio) || 0
                    const valorCOP = valor < 1000 ? Math.round(valor * 4000) : valor
                    const subtotal = valorCOP * (item.cantidad || 1)

                    return (
                      <tr key={item.id} className="bg-white border-bottom">
                        <td className="ps-3 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={
                                item.imagen_url ||
                                'https://placehold.co/60x60/f4f6f8/0b2d5b?text=Alelil'
                              }
                              alt={item.nombre}
                              width="50"
                              height="50"
                              className="rounded-2 border object-fit-cover"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = 'https://placehold.co/60x60/f4f6f8/0b2d5b?text=Alelil'
                              }}
                            />
                            <div>
                              <strong className="d-block text-dark small">{item.nombre}</strong>
                              {item.categoria && (
                                <span className="badge bg-light text-secondary font-monospace" style={{ fontSize: '0.68rem' }}>
                                  {item.categoria}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="small font-monospace text-secondary">
                          {formatearPrecioCOP(item.precio)}
                        </td>
                        <td>
                          <div className="d-flex align-items-center justify-content-center gap-1">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary p-1 d-flex align-items-center"
                              onClick={() => onUpdateCantidad(item.id, -1)}
                              title="Reducir cantidad"
                            >
                              <CIcon icon={cilMinus} size="sm" />
                            </button>
                            <span className="px-2 fw-bold font-monospace small">{item.cantidad || 1}</span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary p-1 d-flex align-items-center"
                              onClick={() => onUpdateCantidad(item.id, 1)}
                              title="Aumentar cantidad"
                            >
                              <CIcon icon={cilPlus} size="sm" />
                            </button>
                          </div>
                        </td>
                        <td className="text-end fw-bold font-monospace small" style={{ color: '#0B2D5B' }}>
                          {formatearPrecioCOP(subtotal)}
                        </td>
                        <td className="text-center pe-3">
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-danger p-1"
                            onClick={() => onRemoveItem(item.id)}
                            title="Eliminar del carrito"
                          >
                            <CIcon icon={cilTrash} size="sm" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Total summary */}
            <div className="p-3 rounded-3 bg-light d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <span className="text-secondary small d-block">Resumen del pedido</span>
                <span className="fs-5 fw-bold" style={{ color: '#0B2D5B' }}>
                  Total: {formatearPrecioCOP(totalGeneral)}
                </span>
              </div>
              <CButton
                variant="outline"
                color="danger"
                size="sm"
                className="d-flex align-items-center gap-1"
                onClick={onVaciarCarrito}
              >
                <CIcon icon={cilTrash} size="sm" />
                <span>Vaciar Carrito</span>
              </CButton>
            </div>
          </div>
        )}
      </CModalBody>

      {items.length > 0 && (
        <CModalFooter className="d-flex justify-content-between align-items-center border-top">
          <CButton variant="outline" color="secondary" onClick={onClose}>
            Seguir Comprando
          </CButton>
          <CButton
            className="border-0 fw-bold px-4 py-2 d-flex align-items-center gap-2"
            style={{ backgroundColor: '#FF8A00', color: '#FFFFFF' }}
            onClick={handleFinalizarCompra}
            disabled={compraExitosa}
          >
            <span>Finalizar Compra</span>
            <CIcon icon={cilArrowRight} />
          </CButton>
        </CModalFooter>
      )}
    </CModal>
  )
}

export default AlelilCartModal
