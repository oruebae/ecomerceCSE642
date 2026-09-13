import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilTags,
  cilStar,
  cilFolder,
  cilDevices,
  cilHouse,
  cilOptions,
  cilWc,
} from '@coreui/icons'

// Map icons for known category names (visual enhancement only)
const knownIcons = {
  'tecnología y gadgets': cilDevices,
  'tecnología': cilDevices,
  'hogar y bienestar': cilHouse,
  'hogar': cilHouse,
  'herramientas y ferretería': cilOptions,
  'herramientas': cilOptions,
  'ferretería': cilOptions,
  'moda y estilo': cilWc,
  'moda': cilWc,
}

const getCategoryIcon = (nombreCat) => {
  const normalizado = (nombreCat || '').toLowerCase().trim()
  return knownIcons[normalizado] || cilFolder
}

const AlelilNav = ({ categorias = [], categoriaSeleccionada, onSelectCategoria }) => {
  return (
    <nav className="alelil-nav-bar">
      <div className="container-xxl">
        <div className="d-flex align-items-center flex-nowrap overflow-x-auto py-1 text-nowrap hide-scrollbar">
          {/* 1. Inicio */}
          <button
            type="button"
            className={`nav-link-item border-0 bg-transparent cursor-pointer ${
              categoriaSeleccionada === 'todos' ? 'active' : ''
            }`}
            onClick={() => onSelectCategoria('todos')}
          >
            <CIcon
              icon={cilHome}
              size="sm"
              style={{ color: categoriaSeleccionada === 'todos' ? '#00C896' : '#64748B' }}
            />
            <span>Inicio</span>
          </button>

          {/* 2. Dynamic Categories from DB */}
          {categorias.map((cat) => {
            const isActive = categoriaSeleccionada === cat.nombre
            const icon = getCategoryIcon(cat.nombre)
            return (
              <button
                key={cat.nombre}
                type="button"
                className={`nav-link-item border-0 bg-transparent cursor-pointer ${
                  isActive ? 'active' : ''
                }`}
                onClick={() => onSelectCategoria(cat.nombre)}
              >
                <CIcon
                  icon={icon}
                  size="sm"
                  style={{ color: isActive ? '#00C896' : '#64748B' }}
                />
                <span>{cat.nombre}</span>
              </button>
            )
          })}

          {/* 3. Ofertas */}
          <button
            type="button"
            className={`nav-link-item border-0 bg-transparent cursor-pointer ${
              categoriaSeleccionada === 'ofertas' ? 'active' : ''
            }`}
            onClick={() => onSelectCategoria('ofertas')}
          >
            <CIcon
              icon={cilTags}
              size="sm"
              style={{ color: categoriaSeleccionada === 'ofertas' ? '#00C896' : '#64748B' }}
            />
            <span>Ofertas</span>
          </button>

          {/* 4. Nuevos */}
          <button
            type="button"
            className={`nav-link-item border-0 bg-transparent cursor-pointer ${
              categoriaSeleccionada === 'nuevos' ? 'active' : ''
            }`}
            onClick={() => onSelectCategoria('nuevos')}
          >
            <CIcon
              icon={cilStar}
              size="sm"
              style={{ color: categoriaSeleccionada === 'nuevos' ? '#00C896' : '#64748B' }}
            />
            <span>Nuevos</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default AlelilNav
