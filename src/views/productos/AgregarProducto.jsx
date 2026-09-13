import React, { useState } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
} from '@coreui/react'

import { useProductos } from '../../hooks/useProductos'

const initialForm = {
  nombre: '',
  categoria: '',
  precio: '',
  stock: '',
  imagen_url: '',
}

const AgregarProducto = () => {
  const { agregarProducto, cargando, error } = useProductos()
  const [formulario, setFormulario] = useState(initialForm)
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('success')
  const [guardando, setGuardando] = useState(false)

  const manejarCambio = (evento) => {
    const { name, value } = evento.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
  }

  const manejarSubmit = async (evento) => {
    evento.preventDefault()

    if (!formulario.nombre.trim() || !formulario.categoria.trim()) {
      setTipoMensaje('danger')
      setMensaje('El nombre y la categoría son obligatorios.')
      return
    }

    setGuardando(true)
    setMensaje('')

    const resultado = await agregarProducto(formulario)

    if (resultado?.success) {
      setTipoMensaje('success')
      setMensaje('Producto agregado correctamente a Supabase.')
      setFormulario(initialForm)
    } else {
      setTipoMensaje('danger')
      setMensaje(resultado?.error || 'No se pudo guardar el producto.')
    }

    setGuardando(false)
  }

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>Agregar producto</strong>
      </CCardHeader>

      <CCardBody>
        {mensaje && <CAlert color={tipoMensaje}>{mensaje}</CAlert>}

        {error && !mensaje && <CAlert color="danger">{error}</CAlert>}

        <CForm onSubmit={manejarSubmit}>
          <CRow className="g-3">
            <CCol md={6}>
              <CFormLabel htmlFor="nombre">Nombre</CFormLabel>
              <CFormInput
                id="nombre"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                placeholder="Ej. Camisa formal"
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel htmlFor="categoria">Categoría</CFormLabel>
              <CFormInput
                id="categoria"
                name="categoria"
                value={formulario.categoria}
                onChange={manejarCambio}
                placeholder="Ej. Ropa, Tecnología"
              />
            </CCol>

            <CCol md={4}>
              <CFormLabel htmlFor="precio">Precio</CFormLabel>
              <CFormInput
                id="precio"
                name="precio"
                type="number"
                min="0"
                step="0.01"
                value={formulario.precio}
                onChange={manejarCambio}
                placeholder="0.00"
              />
            </CCol>

            <CCol md={4}>
              <CFormLabel htmlFor="stock">Stock</CFormLabel>
              <CFormInput
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={formulario.stock}
                onChange={manejarCambio}
                placeholder="0"
              />
            </CCol>

            <CCol md={4}>
              <CFormLabel htmlFor="imagen_url">URL de imagen</CFormLabel>
              <CFormInput
                id="imagen_url"
                name="imagen_url"
                type="url"
                value={formulario.imagen_url}
                onChange={manejarCambio}
                placeholder="https://..."
              />
            </CCol>
          </CRow>

          <div className="mt-4 d-flex justify-content-end gap-2">
            <CButton color="secondary" variant="outline" type="reset" onClick={() => setFormulario(initialForm)}>
              Limpiar
            </CButton>
            <CButton color="primary" type="submit" disabled={guardando || cargando}>
              {guardando ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Guardando...
                </>
              ) : (
                'Guardar producto'
              )}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default AgregarProducto
