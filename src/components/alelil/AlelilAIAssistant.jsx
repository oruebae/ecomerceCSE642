import React, { useState, useRef, useEffect } from 'react'
import {
  CBadge,
  CButton,
  CFormInput,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeech,
  cilX,
  cilPaperPlane,
  cilCart,
  cilCheck,
} from '@coreui/icons'

/**
 * AlelilAIAssistant Component
 * Smart AI Assistant connected to the Node.js FastMCP Server & LLM.
 * Features:
 * - Natural Language Query processing over e-Commerce catalog.
 * - Interactive suggestion chips for quick queries.
 * - Real-time MCP tool execution badges.
 * - Interactive product cards with direct "Agregar al carrito" action.
 */
const AlelilAIAssistant = ({ onAgregarAlCarrito, carritoItems = [] }) => {
  const [abierto, setAbierto] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const [historial, setHistorial] = useState([
    {
      remitente: 'asistente',
      texto:
        '¡Hola! 👋 Soy tu **Asistente Virtual con Servidor MCP** de Alelil Oficial. Puedo consultar en tiempo real nuestro catálogo en Supabase, recomendarte productos según tu presupuesto o verificar disponibilidad e inventarios. ¿En qué te puedo ayudar hoy?',
      mcp_executed: false,
      tool_results: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])

  const chatEndRef = useRef(null)

  // Scroll smooth to bottom on new messages
  useEffect(() => {
    if (abierto) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [historial, abierto])

  // Suggested prompt chips
  const sugerencias = [
    '🛍️ Productos en stock',
    '🔍 Buscar en categoría Monitores',
    '💡 Recomiéndame productos menores a $300',
    '💲 ¿Cuál es el precio de la Laptop ProCore 15?',
  ]

  const enviarMensaje = async (textoAEnviar) => {
    const prompt = textoAEnviar || mensaje
    if (!prompt.trim() || cargando) return

    const mensajeUsuario = {
      remitente: 'usuario',
      texto: prompt.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setHistorial((prev) => [...prev, mensajeUsuario])
    if (!textoAEnviar) setMensaje('')
    setCargando(true)

    try {
      // API call to Node.js MCP server bridge endpoint
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt.trim() }),
      })

      if (!response.ok) {
        throw new Error('Error al conectar con el servidor MCP en Node.js.')
      }

      const data = await response.json()

      // Extract products returned by MCP tools (if any) to render product action cards
      let productosExtraidos = []
      if (data.tool_results && Array.isArray(data.tool_results)) {
        for (const tr of data.tool_results) {
          const res = tr.resultado || tr
          if (res.productos && Array.isArray(res.productos)) {
            productosExtraidos.push(...res.productos)
          } else if (res.resultados && Array.isArray(res.resultados)) {
            productosExtraidos.push(...res.resultados)
          } else if (res.recomendaciones && Array.isArray(res.recomendaciones)) {
            productosExtraidos.push(...res.recomendaciones)
          }
        }
      }

      const mensajeAsistente = {
        remitente: 'asistente',
        texto: data.reply || 'He procesado tu consulta.',
        mcp_executed: data.mcp_executed || false,
        tool_results: data.tool_results || [],
        productos: productosExtraidos,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setHistorial((prev) => [...prev, mensajeAsistente])
    } catch (err) {
      console.error('[AI Assistant Client Error]:', err)
      setHistorial((prev) => [
        ...prev,
        {
          remitente: 'asistente',
          texto:
            '⚠️ No pude conectarme con el Servidor MCP en este momento. Por favor verifica que el backend `npm run start:backend` se encuentre corriendo.',
          mcp_executed: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setCargando(false)
    }
  }

  // Format markdown bold text inside chat bubble
  const renderTextoFormateado = (text) => {
    if (!text) return ''
    const lineas = text.split('\n')
    return lineas.map((linea, index) => {
      // Simple parse bold **text**
      const partes = linea.split(/(\*\*.*?\*\*)/g)
      return (
        <div key={index} className={linea.startsWith('•') ? 'ms-2 mb-1 fw-medium' : 'mb-1'}>
          {partes.map((p, i) => {
            if (p.startsWith('**') && p.endsWith('**')) {
              return <strong key={i}>{p.slice(2, -2)}</strong>
            }
            return p
          })}
        </div>
      )
    })
  }

  return (
    <div className="position-fixed bottom-0 end-0 p-3 p-md-4 z-3 font-sans">
      {/* 1. FLOATING CHAT TRIGGER BUTTON */}
      {!abierto && (
        <button
          type="button"
          className="btn rounded-circle shadow-lg d-flex align-items-center justify-content-center position-relative border-0"
          style={{
            width: '62px',
            height: '62px',
            backgroundColor: '#0B2D5B',
            color: '#FFFFFF',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          }}
          onClick={() => setAbierto(true)}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
          title="Abrir Asistente IA con Servidor MCP"
        >
          <CIcon icon={cilSpeech} size="xl" />
          <span
            className="position-absolute top-0 start-100 translate-middle p-2 bg-success border border-light rounded-circle"
            style={{ backgroundColor: '#00C896' }}
          >
            <span className="visually-hidden">MCP Activo</span>
          </span>
        </button>
      )}

      {/* 2. CHAT DRAWER / WINDOW */}
      {abierto && (
        <div
          className="card shadow-lg border-0 rounded-4 overflow-hidden d-flex flex-column"
          style={{
            width: 'min(420px, 92vw)',
            height: '560px',
            maxHeight: '85vh',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 20px 40px rgba(11, 45, 91, 0.2)',
          }}
        >
          {/* Header */}
          <div
            className="p-3 text-white d-flex align-items-center justify-content-between"
            style={{ backgroundColor: '#0B2D5B' }}
          >
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center font-monospace fw-bold"
                style={{ width: '36px', height: '36px', backgroundColor: '#00C896', color: '#0B2D5B' }}
              >
                MCP
              </div>
              <div>
                <h3 className="h6 fw-bold mb-0 text-white">Asistente IA Alelil</h3>
                <div className="d-flex align-items-center gap-1">
                  <span
                    className="d-inline-block rounded-circle"
                    style={{ width: '7px', height: '7px', backgroundColor: '#00C896' }}
                  ></span>
                  <small className="opacity-75 font-monospace" style={{ fontSize: '0.7rem' }}>
                    FastMCP Node.js + Gemini
                  </small>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-sm text-white opacity-75 opacity-100-hover border-0 p-1"
              onClick={() => setAbierto(false)}
            >
              <CIcon icon={cilX} size="lg" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-grow-1 p-3 overflow-auto bg-light d-flex flex-column gap-3">
            {historial.map((msg, index) => {
              const esUsuario = msg.remitente === 'usuario'

              return (
                <div
                  key={index}
                  className={`d-flex flex-column ${esUsuario ? 'align-items-end' : 'align-items-start'}`}
                >
                  {/* Badge indicating MCP tool execution */}
                  {!esUsuario && msg.mcp_executed && (
                    <div className="mb-1">
                      <CBadge
                        className="px-2 py-1 font-monospace fw-semibold rounded-pill"
                        style={{ backgroundColor: '#E2F8F0', color: '#008B67', fontSize: '0.65rem' }}
                      >
                        ⚡ Herramienta MCP Ejecutada
                      </CBadge>
                    </div>
                  )}

                  {/* Text Bubble */}
                  <div
                    className="p-3 rounded-4 shadow-sm"
                    style={{
                      maxWidth: '88%',
                      backgroundColor: esUsuario ? '#0B2D5B' : '#FFFFFF',
                      color: esUsuario ? '#FFFFFF' : '#1E293B',
                      borderBottomRightRadius: esUsuario ? '4px' : '16px',
                      borderBottomLeftRadius: esUsuario ? '16px' : '4px',
                      border: esUsuario ? 'none' : '1px solid #E2E8F0',
                      fontSize: '0.88rem',
                      lineHeight: '1.45',
                    }}
                  >
                    {renderTextoFormateado(msg.texto)}

                    {/* Interactive Product Cards inside chat */}
                    {msg.productos && msg.productos.length > 0 && (
                      <div className="mt-3 pt-2 border-top d-flex flex-column gap-2">
                        <small className="fw-bold text-secondary font-monospace" style={{ fontSize: '0.72rem' }}>
                          PRODUCTOS DESTACADOS CONSULTADOS:
                        </small>
                        {msg.productos.slice(0, 3).map((prod) => {
                          const enCarrito = carritoItems.some((item) => item.id === prod.id)
                          return (
                            <div
                              key={prod.id}
                              className="d-flex align-items-center justify-content-between p-2 rounded-3 border bg-light"
                            >
                              <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
                                <img
                                  src={
                                    prod.imagen_url ||
                                    'https://placehold.co/60x60/f4f6f8/0b2d5b?text=Alelil'
                                  }
                                  alt={prod.nombre}
                                  width="38"
                                  height="38"
                                  className="rounded-2 border object-fit-cover flex-shrink-0"
                                />
                                <div className="text-truncate">
                                  <div className="fw-bold text-dark text-truncate small">{prod.nombre}</div>
                                  <div className="small font-monospace text-secondary">${prod.precio} USD</div>
                                </div>
                              </div>

                              {onAgregarAlCarrito && (
                                <CButton
                                  size="sm"
                                  className="py-1 px-2 text-nowrap border-0 fw-semibold"
                                  style={{
                                    backgroundColor: enCarrito ? '#00C896' : '#FF8A00',
                                    color: '#FFFFFF',
                                    fontSize: '0.72rem',
                                  }}
                                  onClick={() => onAgregarAlCarrito(prod)}
                                >
                                  <CIcon icon={enCarrito ? cilCheck : cilCart} size="sm" className="me-1" />
                                  {enCarrito ? 'En carrito' : 'Agregar'}
                                </CButton>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <span className="small text-secondary font-monospace px-1 mt-1" style={{ fontSize: '0.65rem' }}>
                    {msg.timestamp}
                  </span>
                </div>
              )
            })}

            {/* Loading Indicator */}
            {cargando && (
              <div className="d-flex align-items-center gap-2 text-secondary p-2 bg-white rounded-3 border shadow-sm w-fit">
                <CSpinner size="sm" style={{ color: '#00C896' }} />
                <span className="small font-monospace">Consultando Servidor MCP en Node.js...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-white border-top overflow-x-auto d-flex gap-1 no-scrollbar">
            {sugerencias.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-pill text-nowrap py-1 px-2 font-sans opacity-85"
                style={{ fontSize: '0.72rem', borderColor: '#CBD5E1', color: '#0B2D5B' }}
                onClick={() => enviarMensaje(sug.replace(/^[^\s]+\s/, ''))}
                disabled={cargando}
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              enviarMensaje()
            }}
            className="p-3 bg-white border-top d-flex align-items-center gap-2"
          >
            <CFormInput
              type="text"
              placeholder="Pregunta en lenguaje natural sobre productos..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              className="py-2 px-3 border-secondary-subtle rounded-pill small"
              disabled={cargando}
            />
            <CButton
              type="submit"
              className="rounded-circle d-flex align-items-center justify-content-center p-2 border-0 flex-shrink-0"
              style={{ width: '40px', height: '40px', backgroundColor: '#FF8A00', color: '#FFFFFF' }}
              disabled={cargando || !mensaje.trim()}
            >
              <CIcon icon={cilPaperPlane} />
            </CButton>
          </form>
        </div>
      )}
    </div>
  )
}

export default AlelilAIAssistant
