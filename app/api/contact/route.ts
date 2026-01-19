import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Rate limiting: almacenamiento en memoria (en producción usar Redis o similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Configuración de rate limiting
const RATE_LIMIT_MAX_REQUESTS = 3 // Máximo de envíos
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hora en milisegundos
const MIN_FORM_TIME_MS = 3000 // Tiempo mínimo de llenado: 3 segundos

// Función para sanitizar HTML y prevenir XSS
function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Función para validar email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// Función para obtener IP del cliente
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIP || 'unknown'
  return ip
}

// Función para verificar rate limiting
function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    // Nueva IP o ventana expirada
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true }
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    // Límite excedido
    return { allowed: false, resetTime: record.resetTime }
  }

  // Incrementar contador
  record.count++
  rateLimitMap.set(ip, record)
  return { allowed: true }
}

// Limpiar entradas antiguas del rate limit map periódicamente
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip)
    }
  }
}, 60 * 60 * 1000) // Limpiar cada hora

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message, company_website, form_load_time } = body

    // 1. VALIDACIÓN DE HONEYPOT
    if (company_website && company_website.trim() !== '') {
      // Honeypot fue llenado = probable bot
      console.warn('Spam detectado: honeypot field llenado')
      return NextResponse.json(
        { error: 'Error al enviar el mensaje' }, // No revelar que es spam
        { status: 400 }
      )
    }

    // 2. VALIDACIÓN DE TIMESTAMP (tiempo mínimo de llenado)
    if (form_load_time) {
      const timeSpent = Date.now() - form_load_time
      if (timeSpent < MIN_FORM_TIME_MS) {
        // Formulario enviado muy rápido = probable bot
        console.warn('Spam detectado: formulario enviado muy rápido')
        return NextResponse.json(
          { error: 'Error al enviar el mensaje' },
          { status: 400 }
        )
      }
    }

    // 3. VALIDACIÓN DE CAMPOS OBLIGATORIOS
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      )
    }

    // 4. VALIDACIÓN DE LONGITUD Y FORMATO
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedMessage = message.trim()

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json(
        { error: 'El nombre debe tener entre 2 y 100 caracteres' },
        { status: 400 }
      )
    }

    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json(
        { error: 'El email no es válido' },
        { status: 400 }
      )
    }

    if (trimmedMessage.length < 10 || trimmedMessage.length > 2000) {
      return NextResponse.json(
        { error: 'El mensaje debe tener entre 10 y 2000 caracteres' },
        { status: 400 }
      )
    }

    // 5. DETECCIÓN DE PATRONES SOSPECHOSOS
    const suspiciousPatterns = [
      /http[s]?:\/\//i, // URLs en el mensaje
      /www\./i,
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, // Múltiples emails
    ]

    const messageLower = trimmedMessage.toLowerCase()
    const hasSuspiciousPattern = suspiciousPatterns.some(pattern => {
      const matches = trimmedMessage.match(pattern)
      return matches && matches.length > 2 // Más de 2 URLs o emails = sospechoso
    })

    if (hasSuspiciousPattern) {
      console.warn('Spam detectado: patrones sospechosos en el mensaje')
      return NextResponse.json(
        { error: 'El mensaje contiene contenido no permitido' },
        { status: 400 }
      )
    }

    // 6. RATE LIMITING
    const clientIP = getClientIP(request)
    const rateLimitCheck = checkRateLimit(clientIP)
    
    if (!rateLimitCheck.allowed) {
      const resetTime = rateLimitCheck.resetTime || Date.now()
      const minutesUntilReset = Math.ceil((resetTime - Date.now()) / (60 * 1000))
      console.warn(`Rate limit excedido para IP: ${clientIP}`)
      return NextResponse.json(
        { 
          error: `Has enviado demasiados mensajes. Intenta de nuevo en ${minutesUntilReset} minuto(s).` 
        },
        { status: 429 }
      )
    }

    // 7. VALIDACIÓN DE CONFIGURACIÓN DEL SERVIDOR
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY no está configurada')
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta' },
        { status: 500 }
      )
    }

    if (!process.env.CONTACT_EMAIL) {
      console.error('CONTACT_EMAIL no está configurada')
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta' },
        { status: 500 }
      )
    }

    // 8. SANITIZACIÓN DE DATOS ANTES DE ENVIAR
    const sanitizedName = sanitizeHtml(trimmedName)
    const sanitizedEmail = sanitizeHtml(trimmedEmail)
    const sanitizedMessage = sanitizeHtml(trimmedMessage).replace(/\n/g, '<br>')

    // 9. ENVIAR EMAIL
    const resend = new Resend(process.env.RESEND_API_KEY)
    const data = await resend.emails.send({
      from: 'Portafolio <onboarding@resend.dev>', // Cambia esto por tu dominio verificado en Resend
      to: [process.env.CONTACT_EMAIL],
      subject: `Nuevo mensaje de contacto de ${sanitizedName}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${sanitizedMessage}</p>
      `,
      reply_to: trimmedEmail,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error enviando email:', error)
    return NextResponse.json(
      { error: 'Error al enviar el mensaje' },
      { status: 500 }
    )
  }
}


