# Alelil OFICIAL — Plataforma eCommerce con Asistente Inteligente (LLM + MCP Server)

Plataforma eCommerce y panel de administración para la marca **Alelil OFICIAL** (BIU 2026), desarrollada con React 19, Node.js (Express), **Model Context Protocol (MCP)**, **Google Gemini 1.5 Flash** y Supabase Auth / PostgreSQL con **Control de Acceso Basado en Roles (RBAC)**, lista para su despliegue en **Microsoft Azure App Services**.

---

## 🌟 Alcance del Proyecto & Asignación No. 5

El sistema integra capacidades avanzadas de Inteligencia Artificial mediante una arquitectura desacoplada de 4 capas:

1. **Tienda Comercial Pública con Asistente IA (`/#/productos/catalogo`):**
   - **Widget Flotante Asistente IA (`AlelilAIAssistant.jsx`):** Interfaz interactiva de conversación en lenguaje natural conectada al servidor MCP.
   - **4 Herramientas MCP Conectadas a Supabase:**
     1. `consultar_productos_disponibles`: Filtra y lista productos con stock activo.
     2. `buscar_productos`: Búsqueda relacional por coincidencia de nombre o categoría.
     3. `consultar_precio_inventario`: Consulta puntual de precio exacto y disponibilidad.
     4. `recomendar_productos`: Sugerencias avanzadas basadas en presupuesto ($ USD/COP) y categoría.
   - **Acción Directa en Chat:** Las sugerencias de productos generadas por el servidor MCP permiten agregarse al carrito de compras en 1-clic.
   - Carrito de compras persistente (`AlelilCartModal.jsx`), catálogo dinámico por volumen de stock, banners promocionales y footer comercial.

2. **Control de Acceso Basado en Roles (RBAC):**
   - Se eliminó el correo hardcodeado `admin@tienda.com` desacoplando la identidad de los permisos del sistema.
   - **Tabla SQL `roles_usuario`:** Registra la asociación `user_id` y su rol (`admin`, `cliente`, `vendedor`).
   - **Función SQL `es_admin(uid)`:** Evalúa dinámicamente el nivel de permisos del usuario en las políticas Row Level Security (RLS) de Supabase.
   - **Guardia de Navegación `RutaProtegida.jsx`:** Protege las vistas administrativas (`/productos/lista`, `/productos/agregar`, `/productos/editar/:id`) exigiendo el rol `admin`.

3. **Servidor MCP & Orquestación LLM (`server_mcp.js`):**
   - Servidor backend en **Node.js (Express.js)** que actúa como puente entre el cliente React, el modelo **Google Gemini 1.5 Flash** y la base de datos Supabase.
   - Orquestación automática de *Function Calling* para invocar las herramientas MCP según la intención detectada en la consulta del usuario.
   - Medidas de seguridad: sanitización de prompts de usuario contra *Prompt Injection* y restricción de herramientas a consultas de solo lectura (`SELECT`).

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 19, React Router (HashRouter), CoreUI React 5, CoreUI Icons, Vite 8.
- **Backend & Servidor MCP:** Node.js, Express.js, `@modelcontextprotocol/sdk`, `@google/genai`.
- **Modelo LLM:** Google Gemini (Gemini 1.5 Flash).
- **Base de Datos & Auth:** Supabase (PostgreSQL + Auth + RLS RBAC).
- **Despliegue Cloud:** Microsoft Azure (Azure App Services PaaS) con GitHub Actions CI/CD.

---

## 📁 Estructura del Proyecto

```text
c:/ProyectosBIU/eCommerceBIU2026/
├── .github/
│   └── workflows/
│       └── azure-deploy.yml     # Workflow CI/CD de despliegue a Microsoft Azure
├── public/
├── src/
│   ├── components/
│   │   ├── alelil/
│   │   │   ├── AlelilAIAssistant.jsx  # Widget interactivo del Asistente IA + MCP
│   │   │   ├── AlelilCartModal.jsx
│   │   │   ├── AlelilHeader.jsx
│   │   │   └── AlelilFooter.jsx
│   │   └── auth/
│   │       └── RutaProtegida.jsx      # Guardia RBAC por roles de usuario
│   ├── views/
│   │   └── productos/
│   │       ├── Catalogo.jsx           # Tienda comercial con Asistente IA
│   │       ├── Lista.jsx              # Panel Admin Full-Width
│   │       ├── AgregarProducto.jsx
│   │       └── EditarProducto.jsx
├── server_mcp.js                       # Servidor MCP en Node.js + Puente LLM Gemini
├── supabase_rls_policies.sql           # Script RLS & Esquema RBAC para Supabase
├── web.config                          # Configuración IIS / Azure Windows App Service
├── process.json                        # Configuración PM2 / Azure Linux App Service
├── generate_pdf_report.py              # Script generador de la entrega en PDF
├── package.json
└── README.md
```

---

## 🔑 Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Variables de Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
VITE_SUPABASE_PUBLISHABLE_KEY=tu-anon-key-de-supabase

# Variable para el Servidor MCP & Google Gemini LLM
GEMINI_API_KEY=tu-api-key-de-google-ai-studio
PORT=8000
```

---

## 🚀 Instrucciones de Instalación y Ejecución Local

```bash
# 1. Instalar dependencias del proyecto
npm install

# 2. Iniciar el Servidor MCP & Puente LLM (Backend Node.js en Puerto 8000)
npm run start:backend

# 3. Iniciar la aplicación Frontend en React (Vite en Puerto 3000)
npm start

# 4. Compilar el bundle de producción
npm run build
```

---

## ☁️ Instrucciones de Despliegue en Microsoft Azure

1. **Crear Azure App Service:** Crea un recurso Web App en Azure (Linux o Windows con Runtime Node.js 20 LTS).
2. **Configurar Application Settings en Azure:**
   - `GEMINI_API_KEY`: Tu clave de API de Google Gemini.
   - `VITE_SUPABASE_URL`: La URL del proyecto en Supabase.
   - `VITE_SUPABASE_ANON_KEY`: Clave pública anónima de Supabase.
3. **Despliegue Continuo (CI/CD):**
   - Utiliza la acción configurada en `.github/workflows/azure-deploy.yml`.
   - Agrega el secreto `AZURE_WEBAPP_PUBLISH_PROFILE` en los secretos del repositorio de GitHub.

---

## 📲 Integración con Telegram (Bot de Telegram & Mini App)

El proyecto ofrece integración completa con **Telegram** en dos niveles:

1. **Bot Conversacional Inteligente (Telegram + MCP + LLM):**
   - El archivo `telegram_bot.js` conecta las conversaciones de Telegram directamente con el Servidor MCP en Node.js.
   - Cualquier consulta enviada al bot se procesa con Google Gemini 1.5/3.6 Flash invocando herramientas MCP de Supabase.

2. **Telegram Mini App (WebApp):**
   - Se incluyó el SDK `<script src="https://telegram.org/js/telegram-web-app.js"></script>` en `index.html`.
   - Permite abrir la tienda web e-Commerce directamente dentro de Telegram con un botón interactivo *"🛍️ Abrir Tienda Web"*.

### Pasos para Activar el Bot de Telegram:
1. Habla con **@BotFather** en Telegram y envía `/newbot` para crear tu bot.
2. Copia el `TELEGRAM_BOT_TOKEN` proporcionado por @BotFather.
3. Agrega la variable en tu archivo `.env`:
   ```env
   TELEGRAM_BOT_TOKEN=tu_token_de_botfather
   WEB_APP_URL=https://tu-app-en-azure.azurewebsites.net
   ```
4. Asigna el botón de menú WebApp enviando `/setmenubutton` a @BotFather con la URL de tu aplicación en Azure.

---

## 📄 Entrega del Proyecto (PDF)

Se generó el documento formal de la entrega en PDF `entrega_asignacion_5_mcp_llm.pdf` incluyendo la arquitectura, explicación del servidor MCP, fragmentos de código, tabla de evidencias y guía de Azure.




---

## 🔗 Repositorio GitHub

- **URL Pública:** [https://github.com/oruebae/ecomerceCSE642](https://github.com/oruebae/ecomerceCSE642)