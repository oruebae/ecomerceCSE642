import React, { useMemo, useState } from 'react'
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
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
import { useNavigate } from 'react-router-dom'

import { useProductos } from '../../hooks/useProductos'

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

  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false)
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
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

  const productosPorPagina = 10

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    if (!texto) return productos

    return productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(texto) ||
        producto.categoria.toLowerCase().includes(texto),
    )
  }, [productos, busqueda])

  const totalPaginas = Math.max(
    1,
    Math.ceil(productosFiltrados.length / productosPorPagina),
  )
  const paginaActual = Math.min(pagina, totalPaginas)

  const productosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * productosPorPagina
    return productosFiltrados.slice(inicio, inicio + productosPorPagina)
  }, [productosFiltrados, paginaActual])

  const formatearPrecio = (precio) =>
    new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(precio))

  const abrirModalEdicion = (producto) => {
    setProductoSeleccionado(producto)
    setFormulario({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      stock: producto.stock,
      imagen_url: producto.imagen_url || '',
    })
    setMostrarModalEdicion(true)
  }

  const cambiarFormulario = (evento) => {
    const { name, value } = evento.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
  }

  const guardarCambios = async () => {
    if (!productoSeleccionado) return

    setGuardando(true)
    setMensaje('')

    const resultado = await editarProducto(productoSeleccionado.id, formulario)

    if (resultado.success) {
      setTipoMensaje('success')
      setMensaje('Producto actualizado correctamente.')
      setMostrarModalEdicion(false)
      setProductoSeleccionado(null)
    } else {
      setTipoMensaje('danger')
      setMensaje(resultado.error || 'No se pudo actualizar el producto.')
    }

    setGuardando(false)
  }

  const abrirModalEliminar = (producto) => {
    setProductoSeleccionado(producto)
    setMostrarModalEliminar(true)
  }

  const confirmarEliminacion = async () => {
    if (!productoSeleccionado) return

    setGuardando(true)
    const resultado = await eliminarProducto(productoSeleccionado.id)

    if (resultado.success) {
      setTipoMensaje('success')
      setMensaje('Producto eliminado correctamente.')
      setMostrarModalEliminar(false)
      setProductoSeleccionado(null)
    } else {
      setTipoMensaje('danger')
      setMensaje(resultado.error || 'No se pudo eliminar el producto.')
    }

    setGuardando(false)
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <strong>Lista de productos</strong>
            <div className="small text-body-secondary">
              Gestión de productos desde Supabase
            </div>
          </div>

          <div className="d-flex gap-2">
            <CButton color="primary" onClick={() => navigate('/productos/agregar')}>
              Agregar producto
            </CButton>
            <CButton color="secondary" variant="outline" onClick={recargar} disabled={cargando}>
              Actualizar
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          {mensaje && <CAlert color={tipoMensaje}>{mensaje}</CAlert>}

          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
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
              <p className="mt-3">Cargando productos...</p>
            </div>
          )}

          {!cargando && error && (
            <CAlert color="danger">
              No se pudieron cargar los productos: {error}
            </CAlert>
          )}

          {!cargando && !error && (
            <>
              <CTable align="middle" bordered hover responsive striped>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Imagen</CTableHeaderCell>
                    <CTableHeaderCell>Producto</CTableHeaderCell>
                    <CTableHeaderCell>Categoría</CTableHeaderCell>
                    <CTableHeaderCell>Precio</CTableHeaderCell>
                    <CTableHeaderCell>Stock</CTableHeaderCell>
                    <CTableHeaderCell>Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {productosPaginados.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan={7} className="text-center py-4">
                        No se encontraron productos.
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    productosPaginados.map((producto) => (
                      <CTableRow key={producto.id}>
                        <CTableDataCell>{producto.id}</CTableDataCell>
                        <CTableDataCell>
                          <img
                            src={
                              producto.imagen_url ||
                              'https://placehold.co/80x60/edf2f7/64748b?text=IMG'
                            }
                            alt={producto.nombre}
                            width="75"
                            height="55"
                            style={{ objectFit: 'cover', borderRadius: '6px' }}
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <strong>{producto.nombre}</strong>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="info">{producto.categoria}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="fw-semibold text-primary">
                            {formatearPrecio(producto.precio)}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={producto.stock > 0 ? 'success' : 'danger'}>
                            {producto.stock > 0
                              ? `${producto.stock} disponibles`
                              : 'Agotado'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-2">
                            <CButton
                              color="warning"
                              variant="outline"
                              size="sm"
                              onClick={() => abrirModalEdicion(producto)}
                            >
                              Editar
                            </CButton>
                            <CButton
                              color="danger"
                              variant="outline"
                              size="sm"
                              onClick={() => abrirModalEliminar(producto)}
                            >
                              Eliminar
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <small className="text-body-secondary">
                  Página {paginaActual} de {totalPaginas}
                </small>
                <div className="d-flex gap-2">
                  <CButton
                    color="secondary"
                    variant="outline"
                    disabled={paginaActual === 1}
                    onClick={() => setPagina((valor) => Math.max(1, valor - 1))}
                  >
                    Anterior
                  </CButton>
                  <CButton
                    color="primary"
                    variant="outline"
                    disabled={paginaActual === totalPaginas}
                    onClick={() =>
                      setPagina((valor) => Math.min(totalPaginas, valor + 1))
                    }
                  >
                    Siguiente
                  </CButton>
                </div>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>

      <CModal visible={mostrarModalEdicion} onClose={() => setMostrarModalEdicion(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Editar producto</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="g-3">
              <CCol md={6}>
                <CFormLabel htmlFor="edit-nombre">Nombre</CFormLabel>
                <CFormInput
                  id="edit-nombre"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={cambiarFormulario}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="edit-categoria">Categoría</CFormLabel>
                <CFormInput
                  id="edit-categoria"
                  name="categoria"
                  value={formulario.categoria}
                  onChange={cambiarFormulario}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="edit-precio">Precio</CFormLabel>
                <CFormInput
                  id="edit-precio"
                  name="precio"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formulario.precio}
                  onChange={cambiarFormulario}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="edit-stock">Stock</CFormLabel>
                <CFormInput
                  id="edit-stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={formulario.stock}
                  onChange={cambiarFormulario}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="edit-imagen">URL imagen</CFormLabel>
                <CFormInput
                  id="edit-imagen"
                  name="imagen_url"
                  type="url"
                  value={formulario.imagen_url}
                  onChange={cambiarFormulario}
                />
              </CCol>
            </CRow>
          </CForm>
          {mensaje && <CAlert color={tipoMensaje} className="mt-3">{mensaje}</CAlert>}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={() => setMostrarModalEdicion(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={guardarCambios} disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={mostrarModalEliminar} onClose={() => setMostrarModalEliminar(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Eliminar producto</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {productoSeleccionado && (
            <p>
              ¿Deseas eliminar el producto <strong>{productoSeleccionado.nombre}</strong>?
            </p>
          )}
          {mensaje && <CAlert color={tipoMensaje}>{mensaje}</CAlert>}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={() => setMostrarModalEliminar(false)}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={confirmarEliminacion} disabled={guardando}>
            {guardando ? 'Eliminando...' : 'Eliminar'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default ListaProductos