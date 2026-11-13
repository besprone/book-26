import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_SESION, panelConfigurado, sesionValida } from '@/lib/panel/sesion'
import { leerDatos, llavePostHog } from '@/lib/panel/datos'
import { datosDeMuestra } from '@/lib/panel/muestra'
import type { DatosPanel, Periodo } from '@/lib/panel/tipos'

export const dynamic = 'force-dynamic'

// Treinta segundos alcanzan para «ahora mismo» y mantienen las consultas a
// PostHog muy por debajo de su límite de lectura por hora.
const VIDA_CACHE_MS = 30_000
const cache = new Map<Periodo, { en: number; datos: DatosPanel }>()

export async function GET(req: NextRequest) {
  if (!panelConfigurado()) return NextResponse.json({ error: 'Panel sin configurar' }, { status: 503 })
  if (!sesionValida(req.cookies.get(COOKIE_SESION)?.value)) {
    return NextResponse.json({ error: 'Sin sesión' }, { status: 401 })
  }

  const p = req.nextUrl.searchParams.get('periodo')
  const periodo: Periodo = p === 'hoy' || p === '30d' ? p : '7d'

  if (!llavePostHog()) {
    if (process.env.NODE_ENV === 'development') return NextResponse.json(datosDeMuestra(periodo))
    return NextResponse.json({ error: 'Falta POSTHOG_PERSONAL_API_KEY' }, { status: 503 })
  }

  const guardado = cache.get(periodo)
  if (guardado && Date.now() - guardado.en < VIDA_CACHE_MS) {
    return NextResponse.json(guardado.datos, { headers: { 'Cache-Control': 'no-store' } })
  }

  try {
    const datos = await leerDatos(periodo)
    cache.set(periodo, { en: Date.now(), datos })
    return NextResponse.json(datos, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Panel: no se pudo leer PostHog', error)
    return NextResponse.json({ error: 'No se pudo leer PostHog' }, { status: 502 })
  }
}
