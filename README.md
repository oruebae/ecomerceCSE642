# Alelil OFICIAL — Plataforma eCommerce & Panel de Administración

Plataforma eCommerce y panel de administración para la marca **Alelil OFICIAL** (Montería / Colombia), desarrollada con React 19, CoreUI React y Supabase Auth / PostgreSQL.

---

## 🌟 Alcance del Proyecto

El sistema ofrece una arquitectura dual:

1. **Tienda Comercial Pública (`/#/productos/catalogo`):**
   - Encabezado comercial único (`AlelilHeader.jsx`) con buscador dinámico e indicador de carrito.
   - Navegación por categorías 100% dinámicas extraídas directamente de la base de datos (`productos.categoria` con `ORDER BY COUNT(*) DESC`).
   - Sección de categorías destacadas (Top 4) con modal expansivo "Ver más categorías".
   - Carrusel de ofertas y beneficios comerciales de la marca Alelil.
   - Carrito de compras completo interactivo (`AlelilCartModal.jsx`) con persistencia en `localStorage`:
     - Agregar productos con control de cantidades.
     - Modificación de cantidades (`+` / `-`).
     - Eliminación individual de productos (`quitarDelCarrito`).
     - Opción de vaciar el carrito y flujo de simulación de pedido/compra.
   - Precios unificados en formato **COP (Pesos Colombianos)** sin centavos.
   - Footer corporativo independiente (`AlelilFooter.jsx`) con datos reales de contacto en **Montería, Colombia** (`contacto@alelil.com.co`, WhatsApp `+57 310 2103434`).

2. **Panel de Administración Full-Width (`/#/productos/lista`):**
   - Vista a pantalla completa (sin sidebar lateral ni headers genéricos de CoreUI).
   - Sticky Header Corporativo en **Azul Navy (`#0B2D5B`)** con badge **PANEL ADMIN** en Verde Menta (`#00C896`).
   - Botón *"← Ver Tienda"* para retornar al catálogo comercial.
   - Visualización dinámica del correo del usuario autenticado (`supabase.auth.getUser()`).
   - Botón de Cierre de Sesión (`supabase.auth.signOut()`).
   - Botón principal **"+ Agregar Producto"** en Naranja Vibrante (`#FF8A00`).
   - Tabla CRUD de inventario con búsqueda en tiempo real, paginación dinámica, badges de stock y acciones rápidas con modales CoreUI (`CModal`).

3. **Seguridad y Control de Acceso (`RutaProtegida.jsx` & RLS):**
   - Guardia de navegación estricto en el frontend (`RutaProtegida.jsx`): Restringe las rutas administrativas (`/productos/lista`, `/productos/agregar`, `/productos/editar/:id`, `/dashboard`) exigiendo sesión activa del correo administrador **`admin@tienda.com`**. Usuarios no administradores o anónimos ven una pantalla de *Acceso Restringido*.
   - Script SQL de Row Level Security (`supabase_rls_policies.sql`): Lectura pública (`SELECT`), escritura restringida a `auth.jwt() -> email = 'admin@tienda.com'`.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 19, React Router (HashRouter), CoreUI React 5, CoreUI Icons.
- **Backend & DB:** Supabase (Auth & PostgreSQL).
- **Estilos:** Vanilla SCSS/CSS de CoreUI + Tokens de Diseño Alelil OFICIAL (`#0B2D5B`, `#00C896`, `#FF8A00`, `#F4F6F8`).
- **Empaquetador:** Vite 8.

---

## 📁 Estructura del Proyecto

```text
c:/ProyectosBIU/eCommerceBIU2026/
├── public/
│   ├── favicon.ico
│   └── logo_alelil.png
├── src/
│   ├── assets/
│   │   ├── brand/           # Logotipos corporativos de Alelil
│   │   └── icons/           # Iconografía CoreUI
│   ├── components/
│   │   ├── alelil/          # Componentes de marca Alelil Oficial
│   │   │   ├── AlelilBenefits.jsx
│   │   │   ├── AlelilCartModal.jsx   # Modal e interacción del Carrito
│   │   │   ├── AlelilCategoriesGrid.jsx
│   │   │   ├── AlelilFooter.jsx     # Footer comercial (Montería/Colombia)
│   │   │   ├── AlelilHeader.jsx     # Header comercial único
│   │   │   ├── AlelilHero.jsx
│   │   │   ├── AlelilNav.jsx        # Subheader de categorías dinámicas
│   │   │   └── AlelilOffers.jsx
│   │   ├── auth/
│   │   │   └── RutaProtegida.jsx    # Guardia de seguridad (admin@tienda.com)
│   │   ├── brand/
│   │   │   └── AlelilLogo.jsx       # SVG oficial Alelil
│   │   ├── AppContent.jsx           # Enrutador interno Full-Width
│   │   ├── AppHeaderDropdown.jsx    # Dropdown con Logout
│   │   ├── AppSidebar.jsx           # Sidebar condicional
│   │   └── index.js
│   ├── hooks/
│   │   └── useProductos.js          # Custom Hook CRUD con Supabase
│   ├── layout/
│   │   └── DefaultLayout.jsx        # Layout principal responsivo
│   ├── lib/
│   │   └── supabase.js              # Cliente e inicialización de Supabase
│   ├── views/
│   │   ├── authentication/          # Módulo de Autenticación
│   │   │   ├── login/Login.jsx
│   │   │   └── register/Register.jsx
│   │   └── productos/               # Módulo de Gestión de Productos
│   │       ├── AgregarProducto.jsx
│   │       ├── Catalogo.jsx
│   │       ├── EditarProducto.jsx
│   │       └── Lista.jsx            # Panel Admin Full-Width
│   ├── App.jsx                      # Configuración de Rutas Globales
│   └── routes.js
├── supabase_rls_policies.sql         # Script RLS de Seguridad en DB
├── package.json
└── README.md
```

---

## 🔑 Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (excluido en `.gitignore`):

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tu-anon-key-de-supabase
```

---

## 🚀 Instalación y Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo en puerto 3000
npm start

# 3. Compilar bundle de producción
npm run build
```

---

## 🔒 Credenciales de Prueba

- **Administrador:** `admin@tienda.com` / `admin123` (Acceso completo al catálogo y panel de administración).
- **Cliente Registrado:** Puede registrarse desde `/#/authentication/register` o iniciar sesión para acceder al catálogo público.