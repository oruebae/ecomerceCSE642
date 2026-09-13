import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Catálogo Comercial',
    to: '/productos/catalogo',
  },
  {
    component: CNavTitle,
    name: 'Administración',
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
  },
  {
    component: CNavItem,
    name: 'Gestión CRUD',
    to: '/productos/lista',
  },
  {
    component: CNavItem,
    name: 'Agregar Producto',
    to: '/productos/agregar',
  },
]

export default _nav