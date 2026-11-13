import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Firma y verificación de los tokens del panel.
 *
 * No hay base de datos: el enlace del correo y la cookie de sesión son el mismo
 * tipo de token firmado con PANEL_SECRET, cada uno con su propósito y su
 * caducidad. Sin la clave en producción el panel queda cerrado.
 */

export const COOKIE_SESION = 'panel_sesion'
export const DURACION_ENLACE_S = 15 * 60
export const DURACION_SESION_S = 30 * 24 * 60 * 60

type Proposito = 'enlace' | 'sesion'
interface Carga {
  p: Proposito
  correo: string
  exp: number
}

const enDesarrollo = process.env.NODE_ENV === 'development'

function clave(): string | null {
  return process.env.PANEL_SECRET || null
}

/** En local, sin clave, el panel abre directo para poder trabajarlo. */
export function accesoLibreEnLocal(): boolean {
  return enDesarrollo && !clave()
}

export function panelConfigurado(): boolean {
  return Boolean(clave()) || accesoLibreEnLocal()
}

function firma(datos: string, secreto: string): string {
  return createHmac('sha256', secreto).update(datos).digest('base64url')
}

export function crearToken(proposito: Proposito, correo: string, duracionS: number): string {
  const secreto = clave()
  if (!secreto) throw new Error('PANEL_SECRET no está configurada')
  const carga: Carga = { p: proposito, correo, exp: Math.floor(Date.now() / 1000) + duracionS }
  const datos = Buffer.from(JSON.stringify(carga)).toString('base64url')
  return `${datos}.${firma(datos, secreto)}`
}

export function verificarToken(token: string | undefined, proposito: Proposito): Carga | null {
  const secreto = clave()
  if (!secreto || !token) return null
  const [datos, recibida] = token.split('.')
  if (!datos || !recibida) return null

  const esperada = firma(datos, secreto)
  const a = Buffer.from(recibida)
  const b = Buffer.from(esperada)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  try {
    const carga = JSON.parse(Buffer.from(datos, 'base64url').toString()) as Carga
    if (carga.p !== proposito || carga.exp < Date.now() / 1000) return null
    return carga
  } catch {
    return null
  }
}

/** Correo autorizado: el mismo que recibe los mensajes del formulario. */
export function correoAutorizado(): string | null {
  const correo = process.env.PANEL_EMAIL || process.env.CONTACT_EMAIL
  return correo ? correo.trim().toLowerCase() : null
}

export function sesionValida(valorCookie: string | undefined): boolean {
  if (accesoLibreEnLocal()) return true
  const carga = verificarToken(valorCookie, 'sesion')
  return Boolean(carga && carga.correo === correoAutorizado())
}
