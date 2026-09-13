import React, { useMemo, useState } from 'react'
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CRow,
  CSpinner,
} from '@coreui/react'

import { useProductos } from '../../hooks/useProductos'

const CatalogoProductos = () => {
  const { productos, cargando, error, recargar } = useProductos()
  const [busqueda, setBusqueda] = useState('')
  const [carrito, setCarrito] = useState([])

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    if (!texto) return productos

    return productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(texto) ||
        producto.categoria.toLowerCase().includes(texto),
    )
  }, [productos, busqueda])

  const formatearPrecio = (precio) =>
    new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(precio))

  const agregarAlCarrito = (producto) => {
    setCarrito((actual) => [...actual, producto.id])
  }

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <strong>Catálogo de productos</strong>
          <div className="small text-body-secondary">
            Vista comercial del eCommerce
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <CBadge color="success">Carrito: {carrito.length}</CBadge>
          <CButton color="primary" onClick={recargar} disabled={cargando}>
            Actualizar
          </CButton>
        </div>
      </CCardHeader>

      <CCardBody>
        <div className="d-flex justify-content-between align-items-center mb-4 gap-3 flex-wrap">
          <CFormInput
            type="search"
            placeholder="Buscar producto o categoría..."
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            style={{ maxWidth: '350px' }}
          />
          <span className="text-body-secondary">
            {productosFiltrados.length} productos
          </span>
        </div>

        {cargando && (
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <p className="mt-3">Cargando catálogo...</p>
          </div>
        )}

        {!cargando && error && (
          <CAlert color="danger">
            No se pudieron cargar los productos: {error}
          </CAlert>
        )}

        {!cargando && !error && (
          <CRow className="g-4">
            {productosFiltrados.length === 0 ? (
              <CCol xs={12}>
                <div className="text-center py-4 text-body-secondary">
                  No se encontraron productos.
                </div>
              </CCol>
            ) : (
              productosFiltrados.map((producto) => {
                const yaEstaEnCarrito = carrito.includes(producto.id)
                const enStock = Number(producto.stock) > 0

                return (
                  <CCol xs={12} sm={6} md={4} lg={3} key={producto.id}>
                    <CCard className="h-100 shadow-sm border-0">
                      <div className="ratio ratio-4x3">
                        <img
                          src={
                            producto.imagen_url ||
                            'https://placehold.co/600x400/edf2f7/64748b?text=Producto'
                          }
                          alt={producto.nombre}
                          className="img-fluid object-fit-cover w-100 h-100"
                          style={{ borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }}
                        />
                      </div>

                      <CCardBody className="d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                          <strong>{producto.nombre}</strong>
                          <CBadge color={enStock ? 'success' : 'warning'}>
                            {enStock ? 'Disponible' : 'Sin stock'}
                          </CBadge>
                        </div>

                        <div className="mb-3">
                          <CBadge color="info" className="mb-2">
                            {producto.categoria}
                          </CBadge>
                          <div className="fs-5 fw-bold text-primary">
                            {formatearPrecio(producto.precio)}
                          </div>
                          <small className="text-body-secondary">
                            Stock: {producto.stock}
                          </small>
                        </div>

                        <div className="mt-auto">
                          <CButton
                            color={yaEstaEnCarrito ? 'success' : 'primary'}
                            className="w-100"
                            onClick={() => agregarAlCarrito(producto)}
                            disabled={yaEstaEnCarrito || !enStock}
                          >
                            {yaEstaEnCarrito ? 'Agregado' : 'Agregar al carrito'}
                          </CButton>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                )
              })
            )}
          </CRow>
        )}
      </CCardBody>
    </CCard>
  )
}

export default CatalogoProductos
