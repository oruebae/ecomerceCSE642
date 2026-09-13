import React, { Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import { routes } from '../routes'
import RutaProtegida from './auth/RutaProtegida'

const AppContent = () => {
  const location = useLocation()
  const isStorefront = location.pathname.includes('/productos/catalogo')

  const content = (
    <Suspense fallback={<CSpinner color="primary" />}>
      <Routes>
        {routes.map((route, idx) => {
          if (!route.element) return null

          const isPublic = route.path === '/productos/catalogo' || route.path === '/'
          const Component = route.element

          return (
            <Route
              key={idx}
              path={route.path}
              exact={route.exact}
              name={route.name}
              element={
                isPublic ? (
                  <Component />
                ) : (
                  <RutaProtegida requireAdmin={true}>
                    <Component />
                  </RutaProtegida>
                )
              }
            />
          )
        })}
        <Route path="/" element={<Navigate to="productos/catalogo" replace />} />
      </Routes>
    </Suspense>
  )

  const isFullWidthPage =
    location.pathname.includes('/productos/catalogo') ||
    location.pathname.includes('/productos/lista') ||
    location.pathname.includes('/productos/agregar') ||
    location.pathname.includes('/productos/editar')

  if (isFullWidthPage) {
    return content
  }

  return (
    <CContainer className="px-4" lg>
      {content}
    </CContainer>
  )
}

export default React.memo(AppContent)
