/**
 * Application Routes Configuration
 *
 * Defines all protected routes in the application using React lazy loading
 * for code splitting and performance optimization.
 *
 * Each route object contains:
 * - path: URL path for the route
 * - name: Human-readable name for breadcrumbs
 * - element: Lazy-loaded React component
 * - exact: (optional) Requires exact path match
 *
 * @module routes
 */

import React from 'react'

// Dashboard
  const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Productos
    const CatalogoProductos = React.lazy(() => import('./views/productos/Catalogo'))
    const AgregarProducto = React.lazy(() => import('./views/productos/AgregarProducto'))
    const ListaProductos = React.lazy(() => import('./views/productos/Lista'))

//Clientes

//Proveedores


/**
 * Array of route configuration objects
 *
 * @type {Array<Object>}
 * @property {string} path - URL path pattern
 * @property {string} name - Display name for breadcrumbs and navigation
 * @property {React.LazyExoticComponent} element - Lazy-loaded component
 * @property {boolean} [exact] - Whether to match path exactly
 *
 * @example
 * // Route renders when URL matches '/dashboard'
 * { path: '/dashboard', name: 'Dashboard', element: Dashboard }
 *
 * @example
 * // Route with exact match required
 * { path: '/components', name: 'Components', element: Cards, exact: true }
 */
export const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: CatalogoProductos },
  { path: '/productos/catalogo', name: 'Catálogo de Productos', element: CatalogoProductos },
  { path: '/productos/agregar', name: 'Agregar Producto', element: AgregarProducto },
  { path: '/productos/lista', name: 'Lista de Productos', element: ListaProductos },

]

export default routes
