import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_SESION, correoAutorizado, crearToken, DURACION_SESION_S, verificarToken } from '@/lib/panel/sesion'

export async function GET(req: NextRequest) {
  // En el subdominio la raíz ya es el panel; en otros hosts vive en /panel.
  const raiz = (req.headers.get('host') || '').startsWith('panel.') ? '/' : '/panel'
  const carga = verificarToken(req.nextUrl.searchParams.get('t') || undefined, 'enlace')

  if (!carga || carga.correo !== correoAutorizado()) {
    return NextResponse.redirect(new URL(`${raiz}?error=enlace`, req.url))
  }

  const res = NextResponse.redirect(new URL(raiz, req.url))
  res.cookies.set(COOKIE_SESION, crearToken('sesion', carga.correo, DURACION_SESION_S), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: DURACION_SESION_S,
  })
  return res
}
