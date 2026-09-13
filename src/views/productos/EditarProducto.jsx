import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
import { supabase } from '../../lib/supabase'

const DEFAULT_FALLBACK_IMAGE = 'https://placehold.co/600x400/f4f6f8/0b2d5b?text=Alelil'

const EditarProducto = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { editarProducto } = useProductos()

  const [formulario, setFormulario] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    stock: '',
    imagen_url: '',
  })
  const [cargandoProducto, setCargandoProducto] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('success')

  useEffect(() => {
    const cargarProductoExistente = async () => {
      if (!id) return
      setCargandoProducto(true)

      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        setTipoMensaje('danger')
        setMensaje('No se pudo encontrar el producto especificado.')
      } else {
        setFormulario({
          nombre: data.nombre || '',
          categoria: data.categoria || '',
          precio: data.precio || '',
          stock: data.stock || '',
          imagen_url: data.imagen_url || '',
        })
      }
      setCargandoProducto(false)
    }

    cargarProductoExistente()
  }, [id])

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

    const payload = {
      ...formulario,
      imagen_url: formulario.imagen_url.trim() || DEFAULT_FALLBACK_IMAGE,
    }

    const resultado = await editarProducto(id, payload)

    if (resultado?.success) {
      setTipoMensaje('success')
      setMensaje('Producto actualizado correctamente en Supabase.')
      setTimeout(() => {
        navigate('/productos/lista')
      }, 1200)
    } else {
      setTipoMensaje('danger')
      setMensaje(resultado?.error || 'No se pudo actualizar el producto.')
    }

    setGuardando(false)
  }

  if (cargandoProducto) {
    return (
      <div className="text-center py-5">
        <CSpinner style={{ color: '#00C896' }} />
        <p className="mt-3 text-secondary">Cargando datos del producto...</p>
      </div>
    )
  }

  return (
    <CCard className="mb-4 shadow-sm border-0 rounded-4 overflow-hidden">
      <CCardHeader className="p-3 text-white" style={{ backgroundColor: '#0B2D5B' }}>
        <strong>Editar Producto (ID: {id})</strong>
      </CCardHeader>

      <CCardBody className="p-4">
        {mensaje && <CAlert color={tipoMensaje}>{mensaje}</CAlert>}

        <CForm onSubmit={manejarSubmit}>
          <CRow className="g-3">
            <CCol md={6}>
              <CFormLabel htmlFor="nombre" className="fw-semibold">Nombre del producto</CFormLabel>
              <CFormInput
                id="nombre"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                placeholder="Ej. Celular Alelil X"
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel htmlFor="categoria" className="fw-semibold">Categoría</CFormLabel>
              <CFormInput
                id="categoria"
                name="categoria"
                value={formulario.categoria}
                onChange={manejarCambio}
                placeholder="Ej. Celulares, Audio"
                required
              />
            </CCol>

            <CCol md={4}>
              <CFormLabel htmlFor="precio" className="fw-semibold">Precio ($)</CFormLabel>
              <CFormInput
                id="precio"
                name="precio"
                type="number"
                min="0"
                step="0.01"
                value={formulario.precio}
                onChange={manejarCambio}
                placeholder="0.00"
                required
              />
            </CCol>

            <CCol md={4}>
              <CFormLabel htmlFor="stock" className="fw-semibold">Stock (Unidades)</CFormLabel>
              <CFormInput
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={formulario.stock}
                onChange={manejarCambio}
                placeholder="0"
                required
              />
            </CCol>

            <CCol md={4}>
              <CFormLabel htmlFor="imagen_url" className="fw-semibold">URL de imagen (opcional)</CFormLabel>
              <CFormInput
                id="imagen_url"
                name="imagen_url"
                type="url"
                value={formulario.imagen_url}
                onChange={manejarCambio}
                placeholder="https://..."
              />
              <small className="text-secondary">Si se deja vacío, se usará imagen por defecto.</small>
            </CCol>
          </CRow>

          <div className="mt-4 d-flex justify-content-end gap-2">
            <CButton
              color="secondary"
              variant="outline"
              type="button"
              onClick={() => navigate('/productos/lista')}
            >
              Cancelar
            </CButton>
            <CButton
              type="submit"
              style={{ backgroundColor: '#FF8A00', color: '#FFFFFF' }}
              disabled={guardando}
              className="fw-bold border-0"
            >
              {guardando ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Actualizando...
                </>
              ) : (
                'Actualizar Producto'
              )}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default EditarProducto
