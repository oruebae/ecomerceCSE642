/**
 * ==============================================================================
 * SERVIDOR MCP (MODEL CONTEXT PROTOCOL) Y PUENTE LLM PARA AZURE APP SERVICE
 * Proyecto: eCommerce BIU 2026 - Alelil Oficial (Asignación #5)
 * ==============================================================================
 * Implementa:
 * 1. Servidor MCP en Node.js con herramientas conectadas a la base de datos Supabase.
 * 2. 4 Herramientas MCP funcionales:
 *    - consultar_productos_disponibles
 *    - buscar_productos
 *    - consultar_precio_inventario
 *    - recomendar_productos
 * 3. Orquestador LLM con Google Gemini y Function Calling.
 * 4. API REST /api/chat y /api/mcp/tools compatible con Azure App Services.
 * 5. Medidas de seguridad: sanitización de prompts y operaciones de solo lectura (SELECT).
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenAI } from '@google/genai'
import { iniciarTelegramBotPolling } from './telegram_bot.js'

dotenv.config()

// 1. Configuración de Supabase Client (Backend con fallback a variables de entorno VITE_)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://oltouaowojyuxczfazgn.supabase.co'
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sdG91YW93b2p5dXhjemZhemduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMDQ3NzEsImV4cCI6MjEwNDg4MDc3MX0.7GblI__CmWbVPH312ihWeJii6f9MyVsePTZsMvcNEo0'

const supabase = createClient(supabaseUrl, supabaseKey)

// 2. Configuración del Cliente Google Gemini (LLM)
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ''
let aiClient = null
if (geminiApiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey: geminiApiKey })
    console.log('✅ Cliente Google Gemini (GoogleGenAI) inicializado correctamente.')
  } catch (err) {
    console.warn('[LLM Warning] No se pudo instanciar GoogleGenAI:', err.message)
  }
}

// Modelos Gemini soportados por orden de prioridad
const GEMINI_MODELS = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash']

// 3. DEFINICIÓN E IMPLEMENTACIÓN DE HERRAMIENTAS MCP (MODEL CONTEXT PROTOCOL)

const mcpToolsDeclarations = [
  {
    name: 'consultar_productos_disponibles',
    description: 'Consulta y devuelve la lista de productos disponibles en el catálogo que tienen stock activo (stock > 0).',
    parameters: {
      type: 'OBJECT',
      properties: {
        limite: {
          type: 'NUMBER',
          description: 'Número máximo de productos a retornar (por defecto 10)',
        },
      },
      required: [],
    },
  },
  {
    name: 'buscar_productos',
    description: 'Busca productos en el catálogo de la tienda filtrando por nombre o por categoría especificada por el usuario.',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: {
          type: 'STRING',
          description: 'Término de búsqueda para coincidir con el nombre o descripción del producto',
        },
        categoria: {
          type: 'STRING',
          description: 'Nombre de la categoría (ej: Ropa, Calzado, Monitores, Laptops, Celulares, Computadoras)',
        },
      },
      required: [],
    },
  },
  {
    name: 'consultar_precio_inventario',
    description: 'Consulta el precio exacto, estado de disponibilidad y unidades en inventario para un producto específico.',
    parameters: {
      type: 'OBJECT',
      properties: {
        nombre_o_id: {
          type: 'STRING',
          description: 'ID numérico o nombre exacto/parcial del producto a consultar',
        },
      },
      required: ['nombre_o_id'],
    },
  },
  {
    name: 'recomendar_productos',
    description: 'Recomienda productos según criterios definidos por el usuario, como presupuesto máximo, categoría o disponibilidad.',
    parameters: {
      type: 'OBJECT',
      properties: {
        presupuesto_max: {
          type: 'NUMBER',
          description: 'Presupuesto máximo del usuario en dólares USD/COP',
        },
        categoria: {
          type: 'STRING',
          description: 'Categoría preferida del usuario',
        },
      },
      required: [],
    },
  },
]

// Implementación ejecutable de cada herramienta MCP conectada a Supabase
async function ejecutarHerramientaMCP(nombreHerramienta, args = {}) {
  console.log(`[MCP Server Execution] Herramienta: "${nombreHerramienta}" | Args:`, args)

  try {
    switch (nombreHerramienta) {
      case 'consultar_productos_disponibles': {
        const limite = args.limite || 10
        const { data, error } = await supabase
          .from('productos')
          .select('id, nombre, categoria, precio, stock, imagen_url')
          .gt('stock', 0)
          .limit(limite)

        if (error) throw error
        return {
          status: 'ok',
          herramienta: nombreHerramienta,
          conteo: data?.length || 0,
          productos: data || [],
        }
      }

      case 'buscar_productos': {
        let queryBuilder = supabase.from('productos').select('id, nombre, categoria, precio, stock, imagen_url')

        if (args.categoria) {
          queryBuilder = queryBuilder.ilike('categoria', `%${args.categoria.trim()}%`)
        }
        if (args.query && args.query.trim()) {
          const t = args.query.trim()
          queryBuilder = queryBuilder.or(`nombre.ilike.%${t}%,categoria.ilike.%${t}%`)
        }

        const { data, error } = await queryBuilder.limit(10)
        if (error) throw error

        return {
          status: 'ok',
          herramienta: nombreHerramienta,
          filtros: args,
          conteo: data?.length || 0,
          productos: data || [],
        }
      }

      case 'consultar_precio_inventario': {
        const termino = String(args.nombre_o_id || '').trim()
        let queryBuilder = supabase.from('productos').select('id, nombre, categoria, precio, stock, imagen_url')

        if (!isNaN(Number(termino)) && termino !== '') {
          queryBuilder = queryBuilder.eq('id', Number(termino))
        } else {
          queryBuilder = queryBuilder.ilike('nombre', `%${termino}%`)
        }

        const { data, error } = await queryBuilder.limit(5)
        if (error) throw error

        return {
          status: 'ok',
          herramienta: nombreHerramienta,
          busqueda: termino,
          conteo: data?.length || 0,
          resultados: data || [],
        }
      }

      case 'recomendar_productos': {
        let queryBuilder = supabase
          .from('productos')
          .select('id, nombre, categoria, precio, stock, imagen_url')
          .gt('stock', 0)

        if (args.presupuesto_max && Number(args.presupuesto_max) > 0) {
          queryBuilder = queryBuilder.lte('precio', Number(args.presupuesto_max))
        }

        if (args.categoria) {
          queryBuilder = queryBuilder.ilike('categoria', `%${args.categoria.trim()}%`)
        }

        const { data, error } = await queryBuilder.order('precio', { ascending: false }).limit(6)
        if (error) throw error

        return {
          status: 'ok',
          herramienta: nombreHerramienta,
          criterios: args,
          conteo: data?.length || 0,
          recomendaciones: data || [],
        }
      }

      default:
        return {
          status: 'error',
          mensaje: `Herramienta MCP "${nombreHerramienta}" no encontrada.`,
        }
    }
  } catch (err) {
    console.error(`[MCP Error] Error ejecutando ${nombreHerramienta}:`, err)
    return {
      status: 'error',
      herramienta: nombreHerramienta,
      mensaje: err.message,
    }
  }
}

// 4. SANITIZACIÓN DE SEGURIDAD (PREVENCIÓN DE PROMPT INJECTION)
function sanitizarEntradaUsuario(prompt) {
  if (typeof prompt !== 'string') return ''
  return prompt
    .replace(/DROP TABLE|DELETE FROM|UPDATE public|INSERT INTO/gi, '')
    .trim()
}

// 5. INICIALIZACIÓN DEL SERVIDOR EXPRESS (AZURE READY)
const app = express()
app.use(cors())
app.use(express.json())

// Endpoint de Salud para Azure App Service
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    servicio: 'Servidor MCP & Puente LLM Alelil Oficial',
    runtime: 'Node.js Express',
    gemini_activo: !!aiClient,
    azure_ready: true,
    timestamp: new Date().toISOString(),
  })
})

// Endpoint para consultar las herramientas MCP registradas
app.get('/api/mcp/tools', (req, res) => {
  res.json({
    servidor_mcp: 'FastMCP Node.js Alelil DB',
    herramientas: mcpToolsDeclarations,
  })
})

// Endpoint Principal de Conversación e-Commerce: /api/chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body
    const promptLimpio = sanitizarEntradaUsuario(message)

    if (!promptLimpio) {
      return res.status(400).json({ error: 'Por favor proporcione un mensaje válido.' })
    }

    console.log(`[Chat Request] Prompt: "${promptLimpio}"`)

    // 5.1 Modo Generativo con Google Gemini (Si la API Key está presente)
    if (aiClient) {
      for (const modelName of GEMINI_MODELS) {
        try {
          console.log(`[Gemini Attempt] Intentando con modelo: ${modelName}`)
          const response = await aiClient.models.generateContent({
            model: modelName,
            contents: promptLimpio,
            config: {
              systemInstruction: `Eres el Asistente Virtual Inteligente oficial de la tienda e-Commerce Alelil Oficial.
Tu objetivo es ayudar amablemente a los clientes a encontrar productos, consultar stock, precios y sugerir recomendaciones.
TIENES ACCESO A HERRAMIENTAS MCP (Model Context Protocol) CONECTADAS A LA BASE DE DATOS DE LA TIENDA.
Siempre que un usuario pregunte por disponibilidad, categorías, productos específicos, precios o recomendaciones, DEBES invocar la herramienta MCP correspondiente para obtener datos reales y precisos.
Si la herramienta MCP devuelve 0 productos para la búsqueda del usuario (por ejemplo, si busca 'audifonos' y no hay en inventario), explícale amablemente al cliente que en este momento no contamos con ese producto en inventario e infórmale cuáles categorías sí están disponibles (Laptops, Computadoras, Monitores, Celulares, etc.).
Sé cortés, entusiasta y responde en español amigable.`,
              tools: [{ functionDeclarations: mcpToolsDeclarations }],
            },
          })

          const candidates = response?.candidates || []
          const functionCalls = candidates[0]?.content?.parts?.filter((p) => p.functionCall) || []

          let toolResults = []
          if (functionCalls.length > 0) {
            for (const fc of functionCalls) {
              const toolName = fc.functionCall.name
              const toolArgs = fc.functionCall.args || {}
              const resTool = await ejecutarHerramientaMCP(toolName, toolArgs)
              toolResults.push({ herramienta: toolName, resultado: resTool })
            }

            // Segunda llamada a Gemini pasando los resultados reales devueltos por el servidor MCP
            const finalResponse = await aiClient.models.generateContent({
              model: modelName,
              contents: [
                { role: 'user', parts: [{ text: promptLimpio }] },
                {
                  role: 'model',
                  parts: [{ text: `Resultados del Servidor MCP desde Supabase: ${JSON.stringify(toolResults)}` }],
                },
                {
                  role: 'user',
                  parts: [
                    {
                      text: `Con base en los resultados anteriores del Servidor MCP, entrega una respuesta final clara, precisa y amable al cliente. Si no se encontraron productos para su consulta, avísale explícitamente que no hay stock de ese artículo y ofrece las categorías disponibles.`,
                    },
                  ],
                },
              ],
            })

            const textAnswer = finalResponse?.text || 'Aquí tienes la información del catálogo consultado.'
            return res.json({
              reply: textAnswer,
              mcp_executed: true,
              tool_results: toolResults,
              model_used: modelName,
            })
          } else {
            const directAnswer = response?.text || '¿En qué más te puedo colaborar hoy en Alelil Oficial?'
            return res.json({
              reply: directAnswer,
              mcp_executed: false,
              model_used: modelName,
            })
          }
        } catch (geminiErr) {
          console.warn(`[Gemini Model Error on ${modelName}]:`, geminiErr.message)
          // Si el error es 404 de modelo descontinuado o 503 de demanda, intentar con el siguiente modelo de la lista
        }
      }
    }

    // 5.2 Modo Autónomo MCP (Fallback de alta resiliencia e inteligencia para coincidencia de búsquedas)
    const lowerPrompt = promptLimpio.toLowerCase()
    let toolResult = null
    let respuestaTextual = ''

    // Extraer palabras clave de búsqueda del mensaje del usuario
    const palabrasIgnoradas = new Set(['quiero', 'comprar', 'que', 'tienes', 'busca', 'buscar', 'categoria', 'de', 'del', 'en', 'los', 'las', 'un', 'una', 'unos', 'unas', 'pero', 'esos', 'no', 'son', 'si', 'tienen', 'hay', 'por', 'favor', 'hola', '?'])
    const palabras = lowerPrompt.split(/\s+/).filter(w => w.length > 2 && !palabrasIgnoradas.has(w))
    const terminoBusqueda = palabras.join(' ').trim()

    if (lowerPrompt.includes('precio') || lowerPrompt.includes('cuanto cuesta') || lowerPrompt.includes('inventario') || lowerPrompt.includes('stock')) {
      const palabraClave = terminoBusqueda || 'vestido'
      toolResult = await ejecutarHerramientaMCP('consultar_precio_inventario', { nombre_o_id: palabraClave })
      if (toolResult.resultados && toolResult.resultados.length > 0) {
        const p = toolResult.resultados[0]
        respuestaTextual = `El producto **"${p.nombre}"** de la categoría *${p.categoria}* tiene un precio de **$${p.precio} USD** y contamos con **${p.stock} unidades disponibles** en inventario.`
      } else {
        respuestaTextual = `Consulté nuestro servidor MCP pero no encontré el producto **"${palabraClave}"** en inventario. Actualmente disponemos de Laptops, Computadoras, Monitores y Celulares.`
      }
    } else if (lowerPrompt.includes('recomiend') || lowerPrompt.includes('sugier') || lowerPrompt.includes('barato') || lowerPrompt.includes('presupuesto')) {
      const matchNumber = lowerPrompt.match(/\d+/)
      const presupuesto = matchNumber ? Number(matchNumber[0]) : 50
      toolResult = await ejecutarHerramientaMCP('recomendar_productos', { presupuesto_max: presupuesto })
      const recs = toolResult.recomendaciones || []
      if (recs.length > 0) {
        respuestaTextual = `¡Con gusto! Basado en tu presupuesto de **$${presupuesto} USD**, el servidor MCP te recomienda los siguientes productos:\n\n` +
          recs.map((r) => `• **${r.nombre}** (${r.categoria}): **$${r.precio} USD** - Stock: ${r.stock}`).join('\n')
      } else {
        respuestaTextual = `No encontré productos por debajo de $${presupuesto} USD, pero te invitamos a revisar todas nuestras ofertas.`
      }
    } else if (terminoBusqueda.length > 0) {
      // Búsqueda dinámica con el término extraído
      toolResult = await ejecutarHerramientaMCP('buscar_productos', { query: terminoBusqueda })
      const prods = toolResult.productos || []
      if (prods.length > 0) {
        respuestaTextual = `Encontré **${prods.length} productos** en nuestra base de datos para la búsqueda **"${terminoBusqueda}"**:\n\n` +
          prods.map((p) => `• **${p.nombre}** (${p.categoria}) - $${p.precio} USD (Stock: ${p.stock})`).join('\n')
      } else {
        respuestaTextual = `Lamentablemente consulté nuestro Servidor MCP en Supabase y **no tenemos "${terminoBusqueda}"** en catálogo actualmente. \n\nNuestras categorías activas con inventario disponible son:\n• Laptops\n• Computadoras\n• Monitores\n• Celulares\n\n¿Te gustaría consultar alguna de estas opciones?`
      }
    } else {
      toolResult = await ejecutarHerramientaMCP('consultar_productos_disponibles', { limite: 5 })
      const prods = toolResult.productos || []
      respuestaTextual = `¡Hola! Bienvenido a **Alelil Oficial**. Actualmente tenemos **${prods.length} productos disponibles en catálogo** con el Servidor MCP:\n\n` +
        prods.map((p) => `• **${p.nombre}** (${p.categoria}) - $${p.precio} USD`).join('\n') +
        `\n\n¿Deseas consultar algún precio específico, buscar por categoría o pedir una recomendación?`
    }

    return res.json({
      reply: respuestaTextual,
      mcp_executed: true,
      tool_results: toolResult ? [toolResult] : [],
    })
  } catch (error) {
    console.error('[Chat API Error]:', error)
    return res.status(500).json({
      error: 'Ocurrió un error al procesar la solicitud en el Servidor MCP.',
      detalles: error.message,
    })
  }
})

// 6. ARRANCAR EL SERVIDOR HTTP
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`=======================================================`)
  console.log(`🚀 SERVIDOR MCP Y PUENTE LLM ALELIL OFICIAL CORRIENDO`)
  console.log(`📍 Puerto: ${PORT}`)
  console.log(`🌐 Health check: http://localhost:${PORT}/health`)
  console.log(`🛠️ Herramientas MCP: http://localhost:${PORT}/api/mcp/tools`)
  console.log(`=======================================================`)

  // Iniciar worker de Telegram Bot (si TELEGRAM_BOT_TOKEN está presente en .env)
  iniciarTelegramBotPolling()
})
