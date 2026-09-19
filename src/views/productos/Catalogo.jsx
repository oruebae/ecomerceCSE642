import React, { useEffect, useMemo, useState } from 'react'
import {
  CAlert,
  CButton,
  CCol,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCart, cilCheck, cilReload, cilFilter, cilArrowRight, cilTrash } from '@coreui/icons'

import { useProductos } from '../../hooks/useProductos'
import AlelilHeader from '../../components/alelil/AlelilHeader'
import AlelilNav from '../../components/alelil/AlelilNav'
import AlelilHero from '../../components/alelil/AlelilHero'
import AlelilCategoriesGrid from '../../components/alelil/AlelilCategoriesGrid'
import AlelilOffers from '../../components/alelil/AlelilOffers'
import AlelilBenefits from '../../components/alelil/AlelilBenefits'
import AlelilFooter from '../../components/alelil/AlelilFooter'
import AlelilCartModal, { formatearPrecioCOP } from '../../components/alelil/AlelilCartModal'
import AlelilAIAssistant from '../../components/alelil/AlelilAIAssistant'

const CatalogoProductos = () => {
  const { productos, cargando, error, recargar } = useProductos()
  const [busqueda, setBusqueda] = useState('')
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos')
  const [verTodosProductos, setVerTodosProductos] = useState(false)
  const [mostrarCartModal, setMostrarCartModal] = useState(false)

  // Persistent shopping cart state in localStorage
  const [carritoItems, setCarritoItems] = useState(() => {
    try {
      const guardado = localStorage.getItem('alelil_carrito')
      return guardado ? JSON.parse(guardado) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('alelil_carrito', JSON.stringify(carritoItems))
    } catch (e) {
      console.error('Error guardando el carrito:', e)
    }
  }, [carritoItems])

  // Cart operations
  const agregarAlCarrito = (producto) => {
    setCarritoItems((actual) => {
      const existe = actual.find((item) => item.id === producto.id)
      if (existe) {
        return actual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        )
      } else {
        return [...actual, { ...producto, cantidad: 1 }]
      }
    })
  }

  const quitarDelCarrito = (productoId) => {
    setCarritoItems((actual) => actual.filter((item) => item.id !== productoId))
  }

  const modificarCantidad = (productoId, delta) => {
    setCarritoItems((actual) => {
      return actual
        .map((item) => {
          if (item.id === productoId) {
            const nuevaCantidad = (item.cantidad || 1) + delta
            return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null
          }
          return item
        })
        .filter(Boolean)
    })
  }

  const vaciarCarrito = () => {
    setCarritoItems([])
  }

  const totalUnidadesCarrito = useMemo(() => {
    return carritoItems.reduce((sum, item) => sum + (item.cantidad || 1), 0)
  }, [carritoItems])

  // 1. Dynamic extraction of categories ordered by product volume DESC
  const categoriasDinamicas = useMemo(() => {
    const conteoMap = {}
    for (const p of productos) {
      const catLimpia = (p.categoria || '').trim()
      if (catLimpia) {
        conteoMap[catLimpia] = (conteoMap[catLimpia] || 0) + 1
      }
    }
    return Object.keys(conteoMap)
      .map((nombreCat) => ({
        nombre: nombreCat,
        cantidad: conteoMap[nombreCat],
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
  }, [productos])

  // Top 4 featured categories by count
  const top4Categorias = useMemo(() => {
    return categoriasDinamicas.slice(0, 4)
  }, [categoriasDinamicas])

  // 2. Dynamic Filtering
  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const texto = busqueda.trim().toLowerCase()
      const catLimpia = (producto.categoria || '').trim()
      const coincideTexto =
        !texto ||
        producto.nombre.toLowerCase().includes(texto) ||
        catLimpia.toLowerCase().includes(texto)

      if (!coincideTexto) return false

      if (categoriaSeleccionada === 'todos') return true
      if (categoriaSeleccionada === 'ofertas') return Number(producto.stock) > 0
      if (categoriaSeleccionada === 'nuevos') return true

      return catLimpia.toLowerCase() === categoriaSeleccionada.trim().toLowerCase()
    })
  }, [productos, busqueda, categoriaSeleccionada])

  // Initial limit: 12 products in Featured section unless filtered or expanded
  const esVistaInicial = categoriaSeleccionada === 'todos' && !busqueda.trim() && !verTodosProductos
  const productosAmostrar = esVistaInicial ? productosFiltrados.slice(0, 12) : productosFiltrados

  const handleSelectCategoria = (catId) => {
    setCategoriaSeleccionada(catId)
    const prodSection = document.getElementById('seccion-productos')
    if (prodSection) {
      prodSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="alelil-store-view bg-light min-vh-100 p-0 m-0">
      {/* 1. Store Header with active cart trigger */}
      <AlelilHeader
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        totalCarrito={totalUnidadesCarrito}
        onCartClick={() => setMostrarCartModal(true)}
      />

      {/* 2. Subheader Navigation Bar (Dynamic Categories) */}
      <AlelilNav
        categorias={categoriasDinamicas}
        categoriaSeleccionada={categoriaSeleccionada}
        onSelectCategoria={handleSelectCategoria}
      />

      <div className="container-xxl py-3">
        {/* 3. Hero Promo Banner */}
        <AlelilHero
          onVerOfertasClick={() => handleSelectCategoria('ofertas')}
        />

        {/* 4. Section: Compra por Categoría */}
        <AlelilCategoriesGrid
          topCategorias={top4Categorias}
          todasCategorias={categoriasDinamicas}
          onSelectCategory={handleSelectCategoria}
        />

        {/* 5. Section: Productos Destacados */}
        <section id="seccion-productos" className="my-5">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h2 className="fs-3 fw-bold mb-1" style={{ color: '#0B2D5B' }}>
                {categoriaSeleccionada === 'todos'
                  ? 'Productos destacados'
                  : `Categoría: ${categoriaSeleccionada}`}
              </h2>
              <span className="text-secondary small">
                {productosAmostrar.length} de {productosFiltrados.length} productos
                {categoriaSeleccionada !== 'todos' && (
                  <button
                    type="button"
                    className="btn btn-link p-0 ms-2 text-decoration-none small text-primary fw-semibold"
                    onClick={() => handleSelectCategoria('todos')}
                  >
                    (Ver todos los productos)
                  </button>
                )}
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <CButton
                color="light"
                className="border d-flex align-items-center gap-2 fw-semibold text-secondary"
                onClick={recargar}
                disabled={cargando}
              >
                <CIcon icon={cilReload} size="sm" />
                <span>Actualizar</span>
              </CButton>
            </div>
          </div>

          {cargando && (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
              <CSpinner style={{ color: '#00C896' }} />
              <p className="mt-3 fw-semibold text-secondary">
                Cargando productos de Alelil Oficial...
              </p>
            </div>
          )}

          {!cargando && error && (
            <CAlert color="danger" className="rounded-3 shadow-sm">
              No se pudieron cargar los productos: {error}
            </CAlert>
          )}

          {!cargando && !error && (
            <>
              <CRow className="g-3 g-md-4">
                {productosAmostrar.length === 0 ? (
                  <CCol xs={12}>
                    <div className="text-center py-5 bg-white rounded-4 border text-secondary">
                      <CIcon icon={cilFilter} size="xl" className="mb-2 opacity-50" />
                      <p className="fs-5 mb-1">No se encontraron productos en esta categoría.</p>
                      <small>Intenta buscar con otros términos o seleccionar otra categoría.</small>
                    </div>
                  </CCol>
                ) : (
                  productosAmostrar.map((producto) => {
                    const itemEnCarrito = carritoItems.find((item) => item.id === producto.id)
                    const enStock = Number(producto.stock) > 0

                    return (
                      <CCol xs={6} md={4} lg={3} key={producto.id}>
                        <div className="card alelil-product-card h-100 d-flex flex-column p-3">
                          {/* Image Container */}
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
                                style={{
                                  backgroundColor: enStock ? '#00C896' : '#FF8A00',
                                  fontWeight: 700,
                                }}
                              >
                                {enStock ? 'Disponible' : 'Sin stock'}
                              </span>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="d-flex flex-column flex-grow-1">
                            {producto.categoria && (
                              <div className="mb-1">
                                <span
                                  className="badge text-uppercase mb-2 text-truncate max-w-100"
                                  style={{
                                    backgroundColor: 'rgba(11, 45, 91, 0.08)',
                                    color: '#0B2D5B',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                  }}
                                >
                                  {producto.categoria.trim()}
                                </span>
                              </div>
                            )}

                            <h4 className="fs-6 fw-bold text-dark mb-2 text-truncate-2" style={{ lineHeight: 1.3 }}>
                              {producto.nombre}
                            </h4>

                            <div className="mt-auto pt-2">
                              <div className="d-flex align-items-baseline justify-content-between mb-3">
                                <span className="product-price">
                                  {formatearPrecioCOP(producto.precio)}
                                </span>
                                {producto.stock !== undefined && (
                                  <span className="small text-secondary font-monospace">
                                    Stock: {producto.stock}
                                  </span>
                                )}
                              </div>

                              <div className="d-flex gap-2">
                                <button
                                  type="button"
                                  className={`btn flex-grow-1 btn-add-cart py-2 d-flex align-items-center justify-content-center gap-2 ${
                                    itemEnCarrito ? 'btn-success text-white' : ''
                                  }`}
                                  style={{
                                    backgroundColor: itemEnCarrito ? '#00C896' : '#0B2D5B',
                                  }}
                                  onClick={() => agregarAlCarrito(producto)}
                                  disabled={!enStock}
                                >
                                  <CIcon icon={itemEnCarrito ? cilCheck : cilCart} size="sm" />
                                  <span>
                                    {itemEnCarrito
                                      ? `En el carrito (${itemEnCarrito.cantidad})`
                                      : 'Agregar al carrito'}
                                  </span>
                                </button>

                                {itemEnCarrito && (
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger p-2 d-flex align-items-center justify-content-center"
                                    onClick={() => quitarDelCarrito(producto.id)}
                                    title="Quitar del carrito"
                                  >
                                    <CIcon icon={cilTrash} size="sm" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CCol>
                    )
                  })
                )}
              </CRow>

              {esVistaInicial && productosFiltrados.length > 12 && (
                <div className="text-center mt-5">
                  <button
                    type="button"
                    className="btn btn-alelil-orange btn-lg d-inline-flex align-items-center gap-2"
                    onClick={() => setVerTodosProductos(true)}
                  >
                    <span>Ver todos los productos</span>
                    <CIcon icon={cilArrowRight} size="lg" />
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* 6. Section: Ofertas */}
        <AlelilOffers
          productos={productos}
          carritoItems={carritoItems}
          onAgregarAlCarrito={agregarAlCarrito}
        />

        {/* 7. Section: Beneficios */}
        <AlelilBenefits />
      </div>

      {/* 8. Cart Modal View */}
      <AlelilCartModal
        visible={mostrarCartModal}
        onClose={() => setMostrarCartModal(false)}
        items={carritoItems}
        onUpdateCantidad={modificarCantidad}
        onRemoveItem={quitarDelCarrito}
        onVaciarCarrito={vaciarCarrito}
      />

      {/* 9. Asistente Inteligente IA con Servidor MCP */}
      <AlelilAIAssistant
        onAgregarAlCarrito={agregarAlCarrito}
        carritoItems={carritoItems}
      />

      {/* 10. Commercial Footer */}
      <AlelilFooter
        categorias={categoriasDinamicas}
        onSelectCategory={handleSelectCategoria}
      />
    </div>
  )
}

export default CatalogoProductos
