import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilReload, cilPencil, cilTrash, cilArrowLeft, cilAccountLogout, cilUser } from '@coreui/icons'
import AlelilLogo from '../../components/brand/AlelilLogo'
import { useProductos } from '../../hooks/useProductos'
import { supabase } from '../../lib/supabase'

const ListaProductos = () => {
  const navigate = useNavigate()
  const {
    productos,
    cargando,
    error,
    recargar,
    editarProducto,
    eliminarProducto,
  } = useProductos()

  // Authenticated user state
  const [userEmail, setUserEmail] = useState('Cargando...')
  
  // Table & Filter state
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)
  
  // Modal states
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false)
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  
  // Edit Form state
  const [formulario, setFormulario] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    stock: '',
    imagen_url: '',
  })
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('success')

  // Fetch logged in user email from Supabase Auth
  useEffect(() => {
    let isMounted = true

    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (isMounted) {
          if (user?.email) {
            setUserEmail(user.email)
          } else {
            const { data: { session } } = await supabase.auth.getSession()
            setUserEmail(session?.user?.email || 'admin@tienda.com')
          }
        }
      } catch (err) {
        if (isMounted) setUserEmail('admin@tienda.com')
      }
    }

    fetchUser()

    return () => {
      isMounted = false
    }
  }, [])

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    } finally {
      navigate('/productos/catalogo')
    }
  }

  const productosPorPagina = 10

  // Real-time search filter
  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    if (!texto) return productos

    return productos.filter(
      (producto) =>
        (producto.nombre && producto.nombre.toLowerCase().includes(texto)) ||
        (producto.categoria && producto.categoria.toLowerCase().includes(texto))
    )
  }, [productos, busqueda])

  // Pagination calculations
  const totalPaginas = Math.max(
    1,
    Math.ceil(productosFiltrados.length / productosPorPagina)
  )
  const paginaActual = Math.min(pagina, totalPaginas)

  const productosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * productosPorPagina
    return productosFiltrados.slice(inicio, inicio + productosPorPagina)
  }, [productosFiltrados, paginaActual])

  // Price formatter (USD / COP)
  const formatearPrecio = (precio) =>
    new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(precio))

  // Open Edit Modal
  const abrirModalEdicion = (producto) => {
    setProductoSeleccionado(producto)
    setFormulario({
      nombre: producto.nombre || '',
      categoria: producto.categoria || '',
      precio: producto.precio ?? '',
      stock: producto.stock ?? '',
      imagen_url: producto.imagen_url || '',
    })
    setMensaje('')
    setMostrarModalEdicion(true)
  }

  const cambiarFormulario = (evento) => {
    const { name, value } = evento.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
  }

  // Save edits
  const guardarCambios = async () => {
    if (!productoSeleccionado) return

    setGuardando(true)
    setMensaje('')

    const resultado = await editarProducto(productoSeleccionado.id, formulario)

    if (resultado.success) {
      setTipoMensaje('success')
      setMensaje('Producto actualizado correctamente en Supabase.')
      setTimeout(() => {
        setMostrarModalEdicion(false)
        setProductoSeleccionado(null)
      }, 1000)
    } else {
      setTipoMensaje('danger')
      setMensaje(resultado.error || 'No se pudo actualizar el producto.')
    }

    setGuardando(false)
  }

  // Open Delete Modal
  const abrirModalEliminar = (producto) => {
    setProductoSeleccionado(producto)
    setMensaje('')
    setMostrarModalEliminar(true)
  }

  // Confirm Delete
  const confirmarEliminacion = async () => {
    if (!productoSeleccionado) return

    setGuardando(true)
    const resultado = await eliminarProducto(productoSeleccionado.id)

    if (resultado.success) {
      setTipoMensaje('success')
      setMensaje('Producto eliminado correctamente.')
      setTimeout(() => {
        setMostrarModalEliminar(false)
        setProductoSeleccionado(null)
      }, 800)
    } else {
      setTipoMensaje('danger')
      setMensaje(resultado.error || 'No se pudo eliminar el producto.')
    }

    setGuardando(false)
  }

  return (
    <div className="w-100 min-vh-100 d-flex flex-column" style={{ backgroundColor: '#F4F6F8' }}>
      {/* 2. Barra Superior Administrativa Corporativa */}
      <header
        className="w-100 position-sticky top-0 z-3 px-3 px-md-4 py-2 text-white shadow"
        style={{ backgroundColor: '#0B2D5B' }}
      >
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          {/* Logo & Brand Section */}
          <div className="d-flex align-items-center gap-3">
            <AlelilLogo theme="dark" height={36} showSlogan={false} />
            <span className="badge px-2 py-1 rounded-2 text-uppercase font-monospace fw-bold" style={{ backgroundColor: '#00C896', color: '#0B2D5B', fontSize: '0.75rem' }}>
              Panel Admin
            </span>

            <CButton
              variant="outline"
              size="sm"
              className="d-inline-flex align-items-center gap-1 border-0 fw-semibold text-white px-3 py-1 rounded-pill ms-md-2"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
              onClick={() => navigate('/productos/catalogo')}
            >
              <CIcon icon={cilArrowLeft} size="sm" />
              <span>Ver Tienda</span>
            </CButton>
          </div>

          {/* User Session Info & Logout Button */}
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2 bg-white bg-opacity-10 px-3 py-1 rounded-pill">
              <CIcon icon={cilUser} style={{ color: '#00C896' }} />
              <span className="small text-white fw-medium font-monospace">{userEmail}</span>
            </div>

            <CButton
              size="sm"
              className="d-flex align-items-center gap-1 border-0 fw-bold px-3 py-1 rounded-pill shadow-sm"
              style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
              onClick={handleSignOut}
            >
              <CIcon icon={cilAccountLogout} size="sm" />
              <span>Cerrar Sesión</span>
            </CButton>
          </div>
        </div>
      </header>

      {/* Main Admin Body (Full Width Container) */}
      <main className="flex-grow-1 p-3 p-md-4 w-100">
        <CContainer fluid className="px-0">
          {/* Global Alert Notification */}
          {mensaje && !mostrarModalEdicion && !mostrarModalEliminar && (
            <CAlert color={tipoMensaje} dismissible onClick={() => setMensaje('')} className="mb-4 shadow-sm border-0">
              {mensaje}
            </CAlert>
          )}

          {/* Main Content Card */}
          <CCard className="border-0 shadow-sm rounded-4 overflow-hidden">
            <CCardHeader className="bg-white border-bottom p-3 p-md-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h1 className="h4 fw-bold mb-1" style={{ color: '#0B2D5B' }}>
                  Catálogo de Productos
                </h1>
                <p className="text-secondary small mb-0">
                  Gestión integral de inventario y datos comerciales desde Supabase
                </p>
              </div>

              {/* 3. Botonera Principal (Agregar Producto en #FF8A00) */}
              <div className="d-flex align-items-center gap-2">
                <CButton
                  className="d-flex align-items-center gap-2 border-0 fw-bold px-4 py-2 rounded-3 shadow-sm"
                  style={{ backgroundColor: '#FF8A00', color: '#FFFFFF' }}
                  onClick={() => navigate('/productos/agregar')}
                >
                  <CIcon icon={cilPlus} />
                  <span>+ Agregar Producto</span>
                </CButton>

                <CButton
                  variant="outline"
                  className="d-flex align-items-center gap-2 fw-semibold px-3 py-2 rounded-3"
                  style={{ borderColor: '#CBD5E1', color: '#0B2D5B' }}
                  onClick={recargar}
                  disabled={cargando}
                >
                  <CIcon icon={cilReload} className={cargando ? 'spin' : ''} />
                  <span className="d-none d-sm-inline">Actualizar</span>
                </CButton>
              </div>
            </CCardHeader>

            <CCardBody className="p-3 p-md-4">
              {/* Search & Counter Bar */}
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div className="w-100" style={{ maxWidth: '380px' }}>
                  <CFormInput
                    type="search"
                    placeholder="🔍 Buscar por nombre o categoría..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="py-2 border-secondary-subtle rounded-3"
                  />
                </div>
                <div className="text-secondary small font-monospace bg-light px-3 py-2 rounded-3 border">
                  Total filtrados: <strong className="text-dark">{productosFiltrados.length}</strong> de {productos.length}
                </div>
              </div>

              {/* Loading State */}
              {cargando && (
                <div className="text-center py-5">
                  <CSpinner style={{ color: '#00C896' }} />
                  <p className="mt-3 text-secondary fw-medium">Cargando datos desde Supabase...</p>
                </div>
              )}

              {/* Error State */}
              {!cargando && error && (
                <CAlert color="danger" className="border-0 shadow-sm">
                  Error al cargar el catálogo de productos: {error}
                </CAlert>
              )}

              {/* Data Table */}
              {!cargando && !error && (
                <>
                  <div className="table-responsive rounded-3 border overflow-hidden">
                    <CTable align="middle" hover className="mb-0">
                      <CTableHead style={{ backgroundColor: '#0B2D5B', color: '#FFFFFF' }}>
                        <CTableRow>
                          <CTableHeaderCell className="text-white bg-transparent py-3">ID</CTableHeaderCell>
                          <CTableHeaderCell className="text-white bg-transparent py-3">Imagen</CTableHeaderCell>
                          <CTableHeaderCell className="text-white bg-transparent py-3">Producto</CTableHeaderCell>
                          <CTableHeaderCell className="text-white bg-transparent py-3">Categoría</CTableHeaderCell>
                          <CTableHeaderCell className="text-white bg-transparent py-3">Precio</CTableHeaderCell>
                          <CTableHeaderCell className="text-white bg-transparent py-3">Stock</CTableHeaderCell>
                          <CTableHeaderCell className="text-white bg-transparent py-3 text-end pe-4">Acciones</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {productosPaginados.length === 0 ? (
                          <CTableRow>
                            <CTableDataCell colSpan={7} className="text-center py-5 text-secondary">
                              No se encontraron productos que coincidan con la búsqueda.
                            </CTableDataCell>
                          </CTableRow>
                        ) : (
                          productosPaginados.map((producto) => (
                            <CTableRow key={producto.id} className="bg-white">
                              <CTableDataCell className="fw-semibold text-secondary font-monospace">
                                #{producto.id}
                              </CTableDataCell>
                              <CTableDataCell>
                                <img
                                  src={
                                    producto.imagen_url ||
                                    'https://placehold.co/80x60/f4f6f8/0b2d5b?text=Alelil'
                                  }
                                  alt={producto.nombre}
                                  width="64"
                                  height="48"
                                  className="rounded-2 shadow-sm border"
                                  style={{ objectFit: 'cover' }}
                                  onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = 'https://placehold.co/80x60/f4f6f8/0b2d5b?text=Alelil'
                                  }}
                                />
                              </CTableDataCell>
                              <CTableDataCell>
                                <div className="fw-bold" style={{ color: '#0B2D5B' }}>
                                  {producto.nombre}
                                </div>
                              </CTableDataCell>
                              <CTableDataCell>
                                <span
                                  className="badge px-2 py-1 rounded-2 fw-semibold"
                                  style={{ backgroundColor: '#E2F8F0', color: '#008B67' }}
                                >
                                  {producto.categoria}
                                </span>
                              </CTableDataCell>
                              <CTableDataCell>
                                <span className="fw-bold text-dark font-monospace">
                                  {formatearPrecio(producto.precio)}
                                </span>
                              </CTableDataCell>
                              <CTableDataCell>
                                {producto.stock > 0 ? (
                                  <CBadge color="success" className="px-2 py-1">
                                    {producto.stock} disponibles
                                  </CBadge>
                                ) : (
                                  <CBadge color="danger" className="px-2 py-1">
                                    Agotado
                                  </CBadge>
                                )}
                              </CTableDataCell>
                              <CTableDataCell className="text-end pe-3">
                                <div className="d-inline-flex gap-2">
                                  <CButton
                                    size="sm"
                                    variant="outline"
                                    className="d-flex align-items-center gap-1 fw-semibold"
                                    style={{ borderColor: '#0B2D5B', color: '#0B2D5B' }}
                                    onClick={() => abrirModalEdicion(producto)}
                                  >
                                    <CIcon icon={cilPencil} size="sm" />
                                    <span>Editar</span>
                                  </CButton>
                                  <CButton
                                    size="sm"
                                    variant="outline"
                                    color="danger"
                                    className="d-flex align-items-center gap-1 fw-semibold"
                                    onClick={() => abrirModalEliminar(producto)}
                                  >
                                    <CIcon icon={cilTrash} size="sm" />
                                    <span>Eliminar</span>
                                  </CButton>
                                </div>
                              </CTableDataCell>
                            </CTableRow>
                          ))
                        )}
                      </CTableBody>
                    </CTable>
                  </div>

                  {/* Pagination Footer */}
                  <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
                    <small className="text-secondary font-monospace">
                      Página <strong>{paginaActual}</strong> de <strong>{totalPaginas}</strong>
                    </small>
                    <div className="d-flex gap-2">
                      <CButton
                        variant="outline"
                        size="sm"
                        disabled={paginaActual === 1}
                        onClick={() => setPagina((val) => Math.max(1, val - 1))}
                        style={{ borderColor: '#CBD5E1', color: '#0B2D5B' }}
                      >
                        ← Anterior
                      </CButton>
                      <CButton
                        variant="outline"
                        size="sm"
                        disabled={paginaActual === totalPaginas}
                        onClick={() => setPagina((val) => Math.min(totalPaginas, val + 1))}
                        style={{ borderColor: '#CBD5E1', color: '#0B2D5B' }}
                      >
                        Siguiente →
                      </CButton>
                    </div>
                  </div>
                </>
              )}
            </CCardBody>
          </CCard>
        </CContainer>
      </main>

      {/* Edit Modal (CModal) */}
      <CModal visible={mostrarModalEdicion} onClose={() => setMostrarModalEdicion(false)} alignment="center" size="lg">
        <CModalHeader style={{ backgroundColor: '#0B2D5B', color: '#FFFFFF' }}>
          <CModalTitle className="h5 fw-bold text-white mb-0">Editar Producto #{productoSeleccionado?.id}</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4">
          {mensaje && <CAlert color={tipoMensaje} className="mb-3">{mensaje}</CAlert>}
          <CForm className="row g-3">
            <CCol md={6}>
              <CFormLabel htmlFor="edit-nombre" className="fw-semibold small">Nombre del Producto</CFormLabel>
              <CFormInput
                id="edit-nombre"
                name="nombre"
                value={formulario.nombre}
                onChange={cambiarFormulario}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="edit-categoria" className="fw-semibold small">Categoría</CFormLabel>
              <CFormInput
                id="edit-categoria"
                name="categoria"
                value={formulario.categoria}
                onChange={cambiarFormulario}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="edit-precio" className="fw-semibold small">Precio (USD / COP)</CFormLabel>
              <CFormInput
                id="edit-precio"
                name="precio"
                type="number"
                min="0"
                step="0.01"
                value={formulario.precio}
                onChange={cambiarFormulario}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="edit-stock" className="fw-semibold small">Stock Disponible</CFormLabel>
              <CFormInput
                id="edit-stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={formulario.stock}
                onChange={cambiarFormulario}
                required
              />
            </CCol>
            <CCol xs={12}>
              <CFormLabel htmlFor="edit-imagen" className="fw-semibold small">URL de Imagen</CFormLabel>
              <CFormInput
                id="edit-imagen"
                name="imagen_url"
                type="url"
                value={formulario.imagen_url}
                onChange={cambiarFormulario}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </CCol>
          </CForm>
        </CModalBody>
        <CModalFooter className="border-top-0 pt-0">
          <CButton variant="outline" color="secondary" onClick={() => setMostrarModalEdicion(false)}>
            Cancelar
          </CButton>
          <CButton
            className="border-0 fw-bold"
            style={{ backgroundColor: '#00C896', color: '#0B2D5B' }}
            onClick={guardarCambios}
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'Guardar Cambios'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Modal (CModal) */}
      <CModal visible={mostrarModalEliminar} onClose={() => setMostrarModalEliminar(false)} alignment="center">
        <CModalHeader className="bg-danger text-white">
          <CModalTitle className="h5 fw-bold text-white mb-0">Confirmar Eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4 text-center">
          {productoSeleccionado && (
            <p className="mb-0 fs-6">
              ¿Estás seguro de que deseas eliminar permanentemente el producto{' '}
              <strong style={{ color: '#0B2D5B' }}>"{productoSeleccionado.nombre}"</strong>?
            </p>
          )}
          {mensaje && <CAlert color={tipoMensaje} className="mt-3 mb-0">{mensaje}</CAlert>}
        </CModalBody>
        <CModalFooter className="justify-content-center border-top-0">
          <CButton variant="outline" color="secondary" onClick={() => setMostrarModalEliminar(false)}>
            Cancelar
          </CButton>
          <CButton color="danger" className="fw-bold" onClick={confirmarEliminacion} disabled={guardando}>
            {guardando ? 'Eliminando...' : 'Sí, Eliminar Producto'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default ListaProductos