import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const normalizarProducto = (producto = {}) => ({
  id: producto.id ?? null,
  nombre: typeof producto.nombre === 'string' ? producto.nombre.trim() : '',
  categoria:
    typeof producto.categoria === 'string' ? producto.categoria.trim() : '',
  precio: Number(producto.precio ?? 0),
  stock: Number(producto.stock ?? 0),
  imagen_url:
    typeof producto.imagen_url === 'string' ? producto.imagen_url.trim() : '',
})

export const useProductos = () => {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargarProductos = useCallback(async () => {
    setCargando(true)
    setError('')

    const { data, error: errorSupabase } = await supabase
      .from('productos')
      .select('id, nombre, categoria, precio, stock, imagen_url')
      .order('nombre', { ascending: true })

    if (errorSupabase) {
      setError(errorSupabase.message)
      setProductos([])
    } else {
      setProductos((data ?? []).map(normalizarProducto))
    }

    setCargando(false)
  }, [])

  const agregarProducto = useCallback(async (producto) => {
    setError('')

    const payload = normalizarProducto(producto)

    if (!payload.nombre || !payload.categoria) {
      const mensaje = 'El nombre y la categoría son obligatorios.'
      setError(mensaje)
      return { success: false, error: mensaje, data: null }
    }

    const { data, error: errorSupabase } = await supabase
      .from('productos')
      .insert([
        {
          nombre: payload.nombre,
          categoria: payload.categoria,
          precio: payload.precio,
          stock: payload.stock,
          imagen_url: payload.imagen_url,
        },
      ])
      .select('id, nombre, categoria, precio, stock, imagen_url')

    if (errorSupabase) {
      const mensaje = errorSupabase.message || 'No se pudo guardar el producto.'
      setError(mensaje)
      return { success: false, error: mensaje, data: null }
    }

    const nuevoProducto = data?.[0] ? normalizarProducto(data[0]) : null

    if (nuevoProducto) {
      setProductos((actual) =>
        [...actual, nuevoProducto].sort((a, b) =>
          a.nombre.localeCompare(b.nombre),
        ),
      )
    }

    return { success: true, error: '', data: nuevoProducto }
  }, [])

  const editarProducto = useCallback(async (id, producto) => {
    setError('')

    const payload = normalizarProducto(producto)

    if (!payload.nombre || !payload.categoria) {
      const mensaje = 'El nombre y la categoría son obligatorios.'
      setError(mensaje)
      return { success: false, error: mensaje, data: null }
    }

    const { data, error: errorSupabase } = await supabase
      .from('productos')
      .update({
        nombre: payload.nombre,
        categoria: payload.categoria,
        precio: payload.precio,
        stock: payload.stock,
        imagen_url: payload.imagen_url,
      })
      .eq('id', id)
      .select('id, nombre, categoria, precio, stock, imagen_url')

    if (errorSupabase) {
      const mensaje = errorSupabase.message || 'No se pudo actualizar el producto.'
      setError(mensaje)
      return { success: false, error: mensaje, data: null }
    }

    const productoActualizado = data?.[0] ? normalizarProducto(data[0]) : null

    if (productoActualizado) {
      setProductos((actual) =>
        actual
          .map((item) => (item.id === id ? productoActualizado : item))
          .sort((a, b) => a.nombre.localeCompare(b.nombre)),
      )
    }

    return { success: true, error: '', data: productoActualizado }
  }, [])

  const eliminarProducto = useCallback(async (id) => {
    setError('')

    const { error: errorSupabase } = await supabase
      .from('productos')
      .delete()
      .eq('id', id)

    if (errorSupabase) {
      const mensaje = errorSupabase.message || 'No se pudo eliminar el producto.'
      setError(mensaje)
      return { success: false, error: mensaje }
    }

    setProductos((actual) => actual.filter((item) => item.id !== id))
    return { success: true, error: '' }
  }, [])

  useEffect(() => {
    cargarProductos()
  }, [cargarProductos])

  return {
    productos,
    cargando,
    error,
    recargar: cargarProductos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
  }
}
