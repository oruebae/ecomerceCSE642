import React from 'react'

// Dashboard
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Productos
const CatalogoProductos = React.lazy(() => import('./views/productos/Catalogo'))
const AgregarProducto = React.lazy(() => import('./views/productos/AgregarProducto'))
const EditarProducto = React.lazy(() => import('./views/productos/EditarProducto'))
const ListaProductos = React.lazy(() => import('./views/productos/Lista'))

export const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/productos/catalogo', name: 'Catálogo de Productos', element: CatalogoProductos },
  { path: '/productos/agregar', name: 'Agregar Producto', element: AgregarProducto },
  { path: '/productos/editar/:id', name: 'Editar Producto', element: EditarProducto },
  { path: '/productos/lista', name: 'Lista de Productos', element: ListaProductos },
]

export default routes
