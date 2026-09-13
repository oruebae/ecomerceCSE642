import React, { useState } from 'react'
import {
  CButton,
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilDevices,
  cilHouse,
  cilOptions,
  cilWc,
  cilFolder,
  cilArrowRight,
  cilGrid,
  cilSearch,
} from '@coreui/icons'

// Visual presets for known category names (appearance enhancement ONLY)
const categoryVisualPresets = {
  'tecnología y gadgets': {
    badgeClass: 'cat-tech',
    icon: cilDevices,
    imgUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
  'tecnología': {
    badgeClass: 'cat-tech',
    icon: cilDevices,
    imgUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
  'hogar y bienestar': {
    badgeClass: 'cat-home',
    icon: cilHouse,
    imgUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
  },
  'hogar': {
    badgeClass: 'cat-home',
    icon: cilHouse,
    imgUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
  },
  'herramientas y ferretería': {
    badgeClass: 'cat-tools',
    icon: cilOptions,
    imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  },
  'herramientas': {
    badgeClass: 'cat-tools',
    icon: cilOptions,
    imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  },
  'moda y estilo': {
    badgeClass: 'cat-fashion',
    icon: cilWc,
    imgUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
  },
  'moda': {
    badgeClass: 'cat-fashion',
    icon: cilWc,
    imgUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
  },
}

const defaultCategoryVisual = {
  badgeClass: 'cat-tech',
  icon: cilFolder,
  imgUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80',
}

const getCategoryVisuals = (nombreCategoria) => {
  const clave = (nombreCategoria || '').toLowerCase().trim()
  return categoryVisualPresets[clave] || defaultCategoryVisual
}

const AlelilCategoriesGrid = ({ topCategorias = [], todasCategorias = [], onSelectCategory }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [busquedaModal, setBusquedaModal] = useState('')

  const categoriasFiltradasModal = todasCategorias.filter((cat) =>
    cat.nombre.toLowerCase().includes(busquedaModal.trim().toLowerCase()),
  )

  const handleCategoryClick = (nombreCat) => {
    setModalVisible(false)
    onSelectCategory(nombreCat)
  }

  if (!topCategorias || topCategorias.length === 0) {
    return null
  }

  return (
    <section className="my-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fs-3 fw-bold mb-1" style={{ color: '#0B2D5B' }}>
            Compra por categoría
          </h2>
          <p className="text-secondary small mb-0">
            Categorías destacadas con mayor presencia en nuestro catálogo
          </p>
        </div>
      </div>

      {/* Exactly 4 Top Featured Category Cards in 1 Row (Desktop) / 2 Cols (Mobile) */}
      <div className="row g-3 g-md-4">
        {topCategorias.map((cat) => {
          const visuals = getCategoryVisuals(cat.nombre)
          const cantidadTexto =
            cat.cantidad === 1 ? '1 producto' : `${cat.cantidad} productos`

          return (
            <div className="col-6 col-lg-3" key={cat.nombre}>
              <div
                className={`card alelil-cat-card ${visuals.badgeClass} h-100 d-flex flex-column justify-content-between p-3 p-md-4 shadow-sm cursor-pointer`}
                onClick={() => handleCategoryClick(cat.nombre)}
              >
                {/* Background Overlay */}
                <div className="position-absolute top-0 end-0 bottom-0 start-0 opacity-25 overflow-hidden rounded-4">
                  <img
                    src={visuals.imgUrl}
                    alt={cat.nombre}
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>

                {/* Icon */}
                <div className="position-relative z-1 mb-2 mb-md-3">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle p-2 p-md-3 shadow-sm"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(8px)',
                      width: '48px',
                      height: '48px',
                    }}
                  >
                    <CIcon icon={visuals.icon} size="lg" className="text-white" />
                  </div>
                </div>

                {/* Category Name & Count */}
                <div className="position-relative z-1 mb-3">
                  <h3 className="fs-5 fw-bold mb-1 text-white text-truncate">
                    {cat.nombre}
                  </h3>
                  <span
                    className="badge bg-white text-dark shadow-sm"
                    style={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      color: '#0B2D5B',
                    }}
                  >
                    {cantidadTexto}
                  </span>
                </div>

                {/* Button */}
                <div className="position-relative z-1">
                  <button
                    type="button"
                    className="btn cat-btn-outline w-100 d-flex align-items-center justify-content-center gap-1 py-1 py-md-2"
                  >
                    <span>Explorar</span>
                    <CIcon icon={cilArrowRight} size="sm" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* "Ver más categorías →" Button */}
      {todasCategorias.length > 4 && (
        <div className="text-center mt-4">
          <button
            type="button"
            className="btn d-inline-flex align-items-center gap-2 fw-bold border-0 px-4 py-2"
            style={{
              color: '#0B2D5B',
              backgroundColor: 'rgba(11, 45, 91, 0.06)',
              borderRadius: '50px',
              fontFamily: "'Montserrat', sans-serif",
            }}
            onClick={() => setModalVisible(true)}
          >
            <CIcon icon={cilGrid} size="sm" style={{ color: '#00C896' }} />
            <span>Ver más categorías</span>
            <CIcon icon={cilArrowRight} size="sm" />
          </button>
        </div>
      )}

      {/* Modal / Dialog "Todas las Categorías" */}
      <CModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        alignment="center"
        size="lg"
      >
        <CModalHeader className="border-bottom pb-3">
          <CModalTitle className="fw-bold" style={{ color: '#0B2D5B' }}>
            Todas las Categorías
          </CModalTitle>
        </CModalHeader>

        <CModalBody className="p-4">
          <div className="mb-4 position-relative">
            <CFormInput
              type="search"
              placeholder="Buscar categoría..."
              value={busquedaModal}
              onChange={(e) => setBusquedaModal(e.target.value)}
              className="py-2 pe-4"
            />
          </div>

          <div className="row g-3" style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {categoriasFiltradasModal.length === 0 ? (
              <div className="col-12 text-center text-secondary py-4">
                No se encontraron categorías con ese término.
              </div>
            ) : (
              categoriasFiltradasModal.map((cat) => (
                <div className="col-12 col-sm-6 col-md-4" key={cat.nombre}>
                  <button
                    type="button"
                    className="btn btn-outline-light text-start text-dark w-100 p-3 rounded-3 border d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: '#F8FAFC' }}
                    onClick={() => handleCategoryClick(cat.nombre)}
                  >
                    <div>
                      <div className="fw-bold text-dark mb-1">{cat.nombre}</div>
                      <small className="text-secondary">{cat.cantidad} productos</small>
                    </div>
                    <CIcon icon={cilArrowRight} size="sm" style={{ color: '#00C896' }} />
                  </button>
                </div>
              ))
            )}
          </div>
        </CModalBody>
      </CModal>
    </section>
  )
}

export default AlelilCategoriesGrid
