-- ==========================================================================
-- POLÍTICAS DE SEGURIDAD RLS (ROW LEVEL SECURITY) PARA SUPABASE
-- Proyecto: eCommerce BIU 2026 - Alelil Oficial
-- Tabla: productos
-- ==========================================================================

-- 1. Habilitar Row Level Security (RLS) en la tabla 'productos'
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas previas si existen para evitar conflictos
DROP POLICY IF EXISTS "Permitir lectura publica de productos" ON productos;
DROP POLICY IF EXISTS "Permitir insercion solo a admin autenticado" ON productos;
DROP POLICY IF EXISTS "Permitir actualizacion solo a admin autenticado" ON productos;
DROP POLICY IF EXISTS "Permitir eliminacion solo a admin autenticado" ON productos;

-- 3. POLÍTICA DE LECTURA PÚBLICA (SELECT)
-- Permite que cualquier usuario (autenticado o no) consulte el catálogo de productos
CREATE POLICY "Permitir lectura publica de productos"
ON productos FOR SELECT
USING (true);

-- 4. POLÍTICA DE INSERCIÓN (INSERT) RESTRINGIDA A ADMINISTRADOR
-- Permite insertar productos únicamente si la sesión está autenticada y el correo es admin@tienda.com
CREATE POLICY "Permitir insercion solo a admin autenticado"
ON productos FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() ->> 'email') = 'admin@tienda.com'
);

-- 5. POLÍTICA DE ACTUALIZACIÓN (UPDATE) RESTRINGIDA A ADMINISTRADOR
-- Permite actualizar productos únicamente al administrador autenticado
CREATE POLICY "Permitir actualizacion solo a admin autenticado"
ON productos FOR UPDATE
TO authenticated
USING (
  (auth.jwt() ->> 'email') = 'admin@tienda.com'
)
WITH CHECK (
  (auth.jwt() ->> 'email') = 'admin@tienda.com'
);

-- 6. POLÍTICA DE ELIMINACIÓN (DELETE) RESTRINGIDA A ADMINISTRADOR
-- Permite eliminar productos únicamente al administrador autenticado
CREATE POLICY "Permitir eliminacion solo a admin autenticado"
ON productos FOR DELETE
TO authenticated
USING (
  (auth.jwt() ->> 'email') = 'admin@tienda.com'
);
