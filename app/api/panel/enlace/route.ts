import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { correoAutorizado, crearToken, DURACION_ENLACE_S, panelConfigurado } from '@/lib/panel/sesion'

const intentos = new Map<string, { n: number; hasta: number }>()
const MAX_INTENTOS = 5
const VENTANA_MS = 15 * 60 * 1000

// El enlace del correo solo se arma con hosts conocidos. Si se usara el host
// tal cual llega, alguien podría pedir un enlace que apunte a otro dominio.
function base(req: NextRequest): string {
  const host = req.headers.get('host') || ''
  if (/^panel\.besprone\.com\.mx$/.test(host) || /\.vercel\.app$/.test(host)) return `https://${host}`
  if (process.env.NODE_ENV === 'development' && /^localhost(:\d+)?$/.test(host)) return `http://${host}`
  return 'https://panel.besprone.com.mx'
}

export async function POST(req: NextRequest) {
  if (!panelConfigurado() || !process.env.PANEL_SECRET) {
    return NextResponse.json({ error: 'El panel todavía no está configurado.' }, { status: 503 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'desconocida'
  const ahora = Date.now()
  const registro = intentos.get(ip)
  if (registro && registro.hasta > ahora && registro.n >= MAX_INTENTOS) {
    return NextResponse.json({ error: 'Demasiados intentos. Prueba en unos minutos.' }, { status: 429 })
  }
  intentos.set(ip, registro && registro.hasta > ahora ? { ...registro, n: registro.n + 1 } : { n: 1, hasta: ahora + VENTANA_MS })

  const { correo } = (await req.json().catch(() => ({}))) as { correo?: string }
  const autorizado = correoAutorizado()
  const pedido = typeof correo === 'string' ? correo.trim().toLowerCase() : ''

  // La respuesta es la misma con cualquier correo, para no revelar cuál abre el panel.
  if (autorizado && pedido === autorizado && process.env.RESEND_API_KEY) {
    const token = crearToken('enlace', autorizado, DURACION_ENLACE_S)
    const enlace = `${base(req)}/api/panel/entrar?t=${encodeURIComponent(token)}`
    try {
      await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: 'Panel del portafolio <onboarding@resend.dev>',
        to: [autorizado],
        subject: 'Tu enlace para entrar al panel',
        text: `Entra al panel con este enlace: ${enlace}\n\nVence en 15 minutos. Si no lo pediste, ignora este correo.`,
        html: `<p>Entra al panel con este enlace:</p><p><a href="${enlace}" style="display:inline-block;padding:12px 20px;background:#6244c7;color:#fff;border-radius:8px;text-decoration:none">Entrar al panel</a></p><p style="color:#58616e">Vence en 15 minutos. Si no lo pediste, ignora este correo.</p>`,
      })
    } catch (error) {
      console.error('Panel: no se pudo enviar el enlace', error)
    }
  }

  return NextResponse.json({ ok: true })
}
