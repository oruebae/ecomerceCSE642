-- ==========================================================================
-- POLÍTICAS DE SEGURIDAD RLS (ROW LEVEL SECURITY) Y RBAC PARA SUPABASE
-- Proyecto: eCommerce BIU 2026 - Alelil Oficial
-- Control de Acceso Basado en Roles (RBAC - Role-Based Access Control)
-- ==========================================================================

-- 1. Crear tabla de roles de usuario para desacoplar permisos de la identidad del correo
CREATE TABLE IF NOT EXISTS public.roles_usuario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'cliente', 'vendedor')),
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en la tabla roles_usuario
ALTER TABLE public.roles_usuario ENABLE ROW LEVEL SECURITY;

-- Política de lectura de roles: un usuario puede ver su propio rol
CREATE POLICY "Permitir lectura del propio rol"
ON public.roles_usuario FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. Función de seguridad helper para verificar si un usuario es Administrador (RBAC)
CREATE OR REPLACE FUNCTION public.es_admin(uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.roles_usuario
    WHERE user_id = uid AND rol = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Habilitar Row Level Security (RLS) en la tabla 'productos'
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas previas para evitar conflictos
DROP POLICY IF EXISTS "Permitir lectura publica de productos" ON public.productos;
DROP POLICY IF EXISTS "Permitir insercion solo a admin autenticado" ON public.productos;
DROP POLICY IF EXISTS "Permitir actualizacion solo a admin autenticado" ON public.productos;
DROP POLICY IF EXISTS "Permitir eliminacion solo a admin autenticado" ON public.productos;

-- 4. POLÍTICA DE LECTURA PÚBLICA (SELECT)
CREATE POLICY "Permitir lectura publica de productos"
ON public.productos FOR SELECT
USING (true);

-- 5. POLÍTICA DE INSERCIÓN (INSERT) RESTRINGIDA A ADMINISTRADOR (RBAC)
CREATE POLICY "Permitir insercion solo a admin autenticado"
ON public.productos FOR INSERT
TO authenticated
WITH CHECK (
  public.es_admin(auth.uid()) OR (auth.jwt() ->> 'email') = 'admin@tienda.com'
);

-- 6. POLÍTICA DE ACTUALIZACIÓN (UPDATE) RESTRINGIDA A ADMINISTRADOR (RBAC)
CREATE POLICY "Permitir actualizacion solo a admin autenticado"
ON public.productos FOR UPDATE
TO authenticated
USING (
  public.es_admin(auth.uid()) OR (auth.jwt() ->> 'email') = 'admin@tienda.com'
)
WITH CHECK (
  public.es_admin(auth.uid()) OR (auth.jwt() ->> 'email') = 'admin@tienda.com'
);

-- 7. POLÍTICA DE ELIMINACIÓN (DELETE) RESTRINGIDA A ADMINISTRADOR (RBAC)
CREATE POLICY "Permitir eliminacion solo a admin autenticado"
ON public.productos FOR DELETE
TO authenticated
USING (
  public.es_admin(auth.uid()) OR (auth.jwt() ->> 'email') = 'admin@tienda.com'
);

