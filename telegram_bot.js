/**
 * ==============================================================================
 * INTEGRACIÓN DE BOT DE TELEGRAM CON SERVIDOR MCP Y LLM (ALELIL OFICIAL)
 * Proyecto: eCommerce BIU 2026 - Alelil Oficial
 * ==============================================================================
 * Conecta el bot de Telegram directamente con el Servidor MCP en Node.js y Gemini.
 * Permite:
 * 1. Consultas en lenguaje natural desde Telegram.
 * 2. Abrir la tienda web e-Commerce directamente como Telegram Mini App (WebApp).
 * 3. Enviar botones interactivos de productos e inventarios.
 */

import dotenv from 'dotenv'

dotenv.config()

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const MCP_API_URL = process.env.MCP_API_URL || 'http://localhost:8000/api/chat'
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://alelil-ecommerce.azurewebsites.net'

if (!TELEGRAM_BOT_TOKEN) {
  console.log('[Telegram Bot Info] No se configuró TELEGRAM_BOT_TOKEN en el archivo .env.')
  console.log('Para activar el bot de Telegram, crea un bot en Telegram con @BotFather y agrega TELEGRAM_BOT_TOKEN=tu_token en .env')
}

// Helper para realizar peticiones HTTP a la API de Telegram
async function telegramFetch(method, data = {}) {
  if (!TELEGRAM_BOT_TOKEN) return null

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    return await response.json()
  } catch (err) {
    console.error(`[Telegram Error] Error en método ${method}:`, err.message)
    return null
  }
}

// Iniciar Long Polling para escuchar mensajes de usuarios en Telegram
async function iniciarTelegramBotPolling() {
  if (!TELEGRAM_BOT_TOKEN) return

  console.log('🤖 Escuchando mensajes del Bot de Telegram en tiempo real...')
  let offset = 0

  while (true) {
    try {
      const updates = await telegramFetch('getUpdates', { offset, timeout: 20 })

      if (updates && updates.ok && updates.result.length > 0) {
        for (const update of updates.result) {
          offset = update.update_id + 1
          if (update.message && update.message.text) {
            await procesarMensajeTelegram(update.message)
          }
        }
      }
    } catch (err) {
      console.error('[Telegram Polling Error]:', err.message)
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }
  }
}

// Procesar el mensaje enviado por el usuario en Telegram
async function procesarMensajeTelegram(message) {
  const chatId = message.chat.id
  const text = message.text.trim()
  const nombreUsuario = message.from.first_name || 'Cliente'

  console.log(`[Telegram Message] De: ${nombreUsuario} (${chatId}): "${text}"`)

  // Comando /start
  if (text === '/start' || text.toLowerCase() === 'hola') {
    const mensajeBienvenida =
      `¡Hola *${nombreUsuario}*! 👋 Bienvenido al bot oficial de *Alelil Oficial*.\n\n` +
      `Soy tu *Asistente Inteligente con Servidor MCP*. Puedo consultar en tiempo real nuestro catálogo en Supabase, recomendarte productos y verificar inventario.\n\n` +
      `Escríbeme lo que buscas o abre nuestra tienda virtual directamente:`

    return await telegramFetch('sendMessage', {
      chat_id: chatId,
      text: mensajeBienvenida,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🛍️ Abrir Tienda Web (Mini App)',
              web_app: { url: WEB_APP_URL },
            },
          ],
          [
            { text: '💻 Ver Laptops', callback_data: 'ver_laptops' },
            { text: '📱 Ver Celulares', callback_data: 'ver_celulares' },
          ],
        ],
      },
    })
  }

  // Indicar que el bot está procesando la respuesta (Escribiendo...)
  await telegramFetch('sendChatAction', { chat_id: chatId, action: 'typing' })

  try {
    // Consultar al Servidor MCP y LLM
    const response = await fetch(MCP_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    })

    const data = await response.json()
    const respuestaTexto = data.reply || 'He procesado tu consulta.'

    return await telegramFetch('sendMessage', {
      chat_id: chatId,
      text: respuestaTexto,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🛒 Ir a la Tienda Alelil',
              web_app: { url: WEB_APP_URL },
            },
          ],
        ],
      },
    })
  } catch (err) {
    console.error('[Telegram MCP Error]:', err.message)
    return await telegramFetch('sendMessage', {
      chat_id: chatId,
      text: '⚠️ No pude conectarme con el Servidor MCP en este momento. Inténtalo de nuevo en unos momentos.',
    })
  }
}

// Iniciar polling si el archivo se ejecuta directamente
if (process.argv[1].includes('telegram_bot.js')) {
  iniciarTelegramBotPolling()
}

export { iniciarTelegramBotPolling }
