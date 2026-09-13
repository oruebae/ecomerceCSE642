# BIU eCommerce Admin Platform 2026

<p align="center">
  <img src="public/captura.png" alt="BIU eCommerce Admin Platform" width="900" />
</p>

Plataforma administrativa para un eCommerce, desarrollada con React, CoreUI y Supabase. La interfaz está enfocada en la gestión de productos y el control del catálogo comercial del negocio.

## Descripción

Esta app funciona como un panel administrativo para una tienda online, donde se pueden gestionar:

- Productos
- Catálogo
- Inventario
- Categorías y marcas
- Agregado y consulta de artículos
- Visualización del catálogo comercial

## Menú principal actual

El sidebar de la aplicación incluye secciones orientadas a un eCommerce, por ejemplo:

- Dashboard
- Productos
  - Catálogo de Productos
  - Agregar Producto
  - Lista de Productos
  - Categorías
  - Inventario
  - Marcas
- Clientes
  - Clientes
  - Direcciones
  - Wishlist
  - Favoritos
- Proveedores
  - Proveedores
  - Compras
  - Pedidos a Proveedor
  - Facturas
- Ventas
  - Pedidos
  - Órdenes
  - Pagos
  - Devoluciones
- Marketing
  - Promociones
  - Cupones
  - Campañas
  - Banners
- Configuración
  - Configuración General
  - Usuarios
  - Roles y Permisos
  - Monedas

## Funcionalidades implementadas

### Gestión de productos
- Catálogo visual con imagen, precio y estado de stock
- Botón para agregar al carrito local
- Formulario para registrar nuevos productos
- Listado de productos con búsqueda y paginación
- Edición de productos desde modal
- Eliminación de productos desde modal
- Conexión directa con la tabla `productos` de Supabase

## Rutas principales

- `/dashboard`
- `/productos/catalogo`
- `/productos/agregar`
- `/productos/lista`

## Stack tecnológico

- React 19
- Vite
- CoreUI React
- Supabase JS

## Variables de entorno

Crea un archivo `.env` con estas variables:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_PUBLISHABLE_KEY=tu_clave_publica
```

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm start
```

## Build de producción

```bash
npm run build
```

## Estructura principal

```text
src/
├── hooks/
│   └── useProductos.js
├── lib/
│   └── supabase.js
├── views/
│   └── productos/
│       ├── Catalogo.jsx
│       ├── AgregarProducto.jsx
│       └── Lista.jsx
├── _nav.jsx
├── routes.js
├── App.jsx
└── components/
```

## Nota

La interfaz actual está diseñada como una administración moderna de eCommerce y está preparada para crecer con más módulos de clientes, proveedores, ventas y marketing.