import { NextResponse, type NextRequest } from 'next/server'
import { rutaEquivalente } from '@/lib/i18n'
import { COOKIE_IDIOMA } from '@/lib/cookie-idioma'

/**
 * Lleva a quien llega con el navegador en inglés a la versión en inglés.
 *
 * El sitio vive en español en la raíz y en inglés bajo `/en`. Sin esto, un
 * reclutador anglófono aterrizaba en español y tenía que encontrar el
 * conmutador por su cuenta.
 *
 * Tres reglas que evitan que la detección se vuelva un incordio:
 *
 *   1. Si la persona ya eligió idioma, se respeta y no se redirige nunca más.
 *      Sin esto, pulsar el conmutador para ver español y navegar a otra
 *      página la devolvería a inglés: el sitio peleando contra el usuario.
 *   2. No se toca a los rastreadores. Google desaconseja redirigir por idioma
 *      precisamente porque puede impedir que indexe ambas versiones, y aquí
 *      el hreflang ya le dice cuál es cuál; que decida él.
 *   3. Sólo redirige de español a inglés. Quien pide `/en` explícitamente se
 *      queda donde está, venga de donde venga.
 */
const RASTREADORES =
  /bot|crawler|spider|crawling|googlebot|bingbot|duckduckbot|slurp|baiduspider|yandex|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|petalbot|ia_archiver|lighthouse|headlesschrome/i

/**
 * Primer idioma del `Accept-Language` que el sitio conoce.
 *
 * Se recorre por orden de preferencia y se compara por prefijo, no por
 * igualdad: "en-GB" y "en-US" son inglés, y "es-419" o "es-MX" son español.
 */
function prefiereIngles(accept: string | null): boolean {
  if (!accept) return false

  const idiomas = accept
    .split(',')
    .map((parte) => {
      const [etiqueta, q] = parte.trim().split(';q=')
      return { etiqueta: etiqueta.trim().toLowerCase(), peso: q ? Number(q) : 1 }
    })
    .filter((x) => x.etiqueta && !Number.isNaN(x.peso))
    .sort((a, b) => b.peso - a.peso)

  for (const { etiqueta } of idiomas) {
    if (etiqueta === '*') continue
    if (etiqueta.startsWith('es')) return false
    if (etiqueta.startsWith('en')) return true
  }
  return false
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (RASTREADORES.test(request.headers.get('user-agent') ?? '')) {
    return NextResponse.next()
  }

  // Elección explícita: manda siempre sobre la detección.
  if (request.cookies.get(COOKIE_IDIOMA)) return NextResponse.next()

  if (!prefiereIngles(request.headers.get('accept-language'))) {
    return NextResponse.next()
  }

  const destino = rutaEquivalente(pathname, 'en')
  if (destino === pathname) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = destino
  url.search = search
  // Temporal, no 301: la redirección depende del navegador de cada visitante,
  // así que no debe quedarse cacheada para los demás.
  return NextResponse.redirect(url, 307)
}

export const config = {
  // Sólo las rutas en español; el resto ni siquiera entra al middleware.
  matcher: ['/', '/sobre-mi', '/proyectos', '/proyectos/:slug*', '/contacto'],
}
