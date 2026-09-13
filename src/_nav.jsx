/**
 * Sidebar Navigation Configuration
 *
 * Defines the structure and content of the sidebar navigation menu.
 * Supports multiple navigation component types from CoreUI React:
 * - CNavItem: Single navigation link
 * - CNavGroup: Collapsible group of links
 * - CNavTitle: Section title/divider
 *
 * @module _nav
 */

import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBug,
  cilCalculator,
  cilChartPie,
  cilDescription,
  cilExternalLink,
  cilLockLocked,
  cilNotes,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

/**
 * Navigation menu structure array
 *
 * @type {Array<Object>}
 * @property {React.ComponentType} component - CoreUI nav component (CNavItem, CNavGroup, CNavTitle)
 * @property {string} name - Display text for the nav item
 * @property {string} [to] - Internal route path (for CNavItem with routing)
 * @property {string} [href] - External URL (for CNavItem with external links)
 * @property {React.ReactNode} [icon] - Icon element to display
 * @property {Object} [badge] - Optional badge configuration
 * @property {string} badge.color - Badge color (info, danger, success, etc.)
 * @property {string} badge.text - Badge text content
 * @property {Array<Object>} [items] - Child items for CNavGroup
 *
 * @example
 * // Simple navigation item
 * {
 *   component: CNavItem,
 *   name: 'Dashboard',
 *   to: '/dashboard',
 *   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
 * }
 *
 * @example
 * // Navigation group with children
 * {
 *   component: CNavGroup,
 *   name: 'Components',
 *   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
 *   items: [
 *     {
 *       component: CNavItem,
 *       name: 'Cards',
 *       to: '/components/cards',
 *     },
 *   ],
 * }
 *
 * @example
 * // Section title
 * {
 *   component: CNavTitle,
 *   name: 'UI Elements',
 * }
 */
const _nav = [
  {
    component: CNavTitle,
    name: 'eCommerce BIU',
  },
  {
    component: CNavGroup,
    name: 'Dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Resumen',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Ventas',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Estadísticas',
        to: '/productos/catalogo',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Productos',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Catálogo de Productos',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Agregar Producto',
        to: '/productos/agregar',
      },
      {
        component: CNavItem,
        name: 'Lista de Productos',
        to: '/productos/lista',
      },
      {
        component: CNavItem,
        name: 'Categorías',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Inventario',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Marcas',
        to: '/productos/catalogo',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Clientes',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Clientes',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Direcciones',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Wishlist',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Favoritos',
        to: '/productos/catalogo',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Proveedores',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Proveedores',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Compras',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Pedidos a Proveedor',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Facturas',
        to: '/productos/catalogo',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Ventas',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Pedidos',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Ordenes',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Pagos',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Devoluciones',
        to: '/productos/catalogo',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Marketing',
    icon: <CIcon icon={cilBug} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Promociones',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Cupones',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Campañas',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Banners',
        to: '/productos/catalogo',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Configuración',
    icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Configuración General',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Usuarios',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Roles y Permisos',
        to: '/productos/catalogo',
      },
      {
        component: CNavItem,
        name: 'Monedas',
        to: '/productos/catalogo',
      },
    ],
  },
]

export default _nav
