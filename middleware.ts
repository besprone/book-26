import { NextResponse, type NextRequest } from 'next/server'

/**
 * panel.besprone.com.mx sirve el panel privado desde el mismo proyecto.
 *
 * En el subdominio, cualquier ruta se reescribe a /panel (salvo su API). En el
 * dominio del portafolio, /panel no existe, para que no se descubra ni se indexe.
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  const { pathname } = req.nextUrl
  const esPanel = pathname === '/panel' || pathname.startsWith('/panel/') || pathname.startsWith('/api/panel')

  if (host.startsWith('panel.')) {
    const res = pathname.startsWith('/api/panel') || pathname.startsWith('/panel')
      ? NextResponse.next()
      : NextResponse.rewrite(new URL(`/panel${pathname === '/' ? '' : pathname}${req.nextUrl.search}`, req.url))
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return res
  }

  if (esPanel && /^((www\.)?besprone\.com\.mx|besprone\.vercel\.app)$/.test(host)) {
    return NextResponse.rewrite(new URL('/no-existe', req.url))
  }

  return NextResponse.next()
}

export const config = {
  // Fuera: archivos estáticos, imágenes y la ruta de la analítica.
  matcher: ['/((?!_next/|vista/|.*\\..*).*)'],
}
