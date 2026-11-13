import type { Actividad, Cifra, DatosPanel, Enlace, Periodo, PersonaAhora } from './tipos'

/**
 * Datos del panel, leídos de PostHog con la llave personal de solo lectura.
 *
 * Las consultas usan `{filters}` con filterTestAccounts, así que aplican los
 * mismos filtros que el tablero de PostHog: sin bots, sin /render y sin las
 * visitas de casa. Si esos filtros cambian en PostHog, el panel los sigue.
 */

const PROYECTO = process.env.POSTHOG_PROJECT_ID || '214407'
const API = process.env.POSTHOG_API_HOST || 'https://us.posthog.com'
const ZONA = 'America/Mexico_City'

const NOMBRES_CASO: Record<string, string> = {
  'calipso-sistema-diseno': 'Calipso',
  'prediccion-abandono-neobank': 'Neo Bank',
  'marco-discovery-continuo': 'Discovery',
  'ruta-ingles': 'Ruta de Inglés',
  'autogestivo-credito-adicional': 'Autogestivo',
  'credito-respaldo-inversiones': 'Crédito Respaldo',
  'solicitud-credito-asesores': 'Solicitud de crédito',
}

const paises = new Intl.DisplayNames(['es'], { type: 'region' })

export function llavePostHog(): string | null {
  return process.env.POSTHOG_PERSONAL_API_KEY || null
}

type Fila = Record<string, unknown>

async function consultar(sql: string, desde: string, fresco = false): Promise<Fila[]> {
  const res = await fetch(`${API}/api/projects/${PROYECTO}/query/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${llavePostHog()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'panel-portafolio',
      refresh: fresco ? 'force_blocking' : 'blocking',
      query: {
        kind: 'HogQLQuery',
        query: sql,
        filters: { dateRange: { date_from: desde }, filterTestAccounts: true },
      },
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`PostHog respondió ${res.status}`)
  const json = (await res.json()) as { columns: string[]; results: unknown[][] }
  return json.results.map((fila) => Object.fromEntries(json.columns.map((c, i) => [c, fila[i]])))
}

// Una fila por sesión con todo lo que el panel necesita contar.
const SQL_SESIONES = `
SELECT
  properties.$session_id AS sesion,
  any(person_id) AS persona,
  min(timestamp) AS inicio,
  max(timestamp) AS fin,
  argMin(properties.$geoip_country_code, timestamp) AS pais,
  argMin(properties.$referring_domain, timestamp) AS referente,
  anyIf(properties.utm_source, notEmpty(toString(properties.utm_source))) AS utm_fuente,
  anyIf(properties.utm_medium, notEmpty(toString(properties.utm_medium))) AS utm_medio,
  anyIf(properties.utm_campaign, notEmpty(toString(properties.utm_campaign))) AS utm_campana,
  argMin(properties.$pathname, timestamp) AS entrada,
  groupUniqArrayIf(toString(properties.project_slug), event = 'project_viewed') AS casos,
  countIf(event = 'cv_downloaded') AS cv,
  countIf(event = 'contact_form_submitted' AND properties.form_status = 'success') AS mensajes
FROM events
WHERE {filters} AND notEmpty(toString(properties.$session_id))
GROUP BY sesion
ORDER BY fin DESC
LIMIT 2000`

// Sesiones con actividad en los últimos 5 minutos que no se han ido.
const SQL_AHORA = `
SELECT
  properties.$session_id AS sesion,
  argMax(properties.$pathname, timestamp) AS pagina,
  argMin(properties.$geoip_country_code, timestamp) AS pais,
  argMin(properties.$referring_domain, timestamp) AS referente,
  anyIf(properties.utm_source, notEmpty(toString(properties.utm_source))) AS utm_fuente,
  anyIf(properties.utm_campaign, notEmpty(toString(properties.utm_campaign))) AS utm_campana,
  min(timestamp) AS inicio,
  max(timestamp) AS fin,
  argMax(event, timestamp) AS ultimo_evento
FROM events
WHERE {filters} AND notEmpty(toString(properties.$session_id))
GROUP BY sesion
HAVING fin >= now() - INTERVAL 5 MINUTE AND ultimo_evento != '$pageleave'
ORDER BY fin DESC
LIMIT 20`

interface Sesion {
  persona: string
  inicio: Date
  fin: Date
  pais: string
  fuente: string
  enlace: string | null
  entrada: string
  casos: string[]
  cv: number
  mensajes: number
}

const fecha = (v: unknown) => new Date(String(v).replace(/(\.\d{3})\d+/, '$1'))
const texto = (v: unknown) => (v === null || v === undefined ? '' : String(v))

function nombrePais(codigo: string): string {
  if (!codigo) return 'un lugar desconocido'
  try {
    return paises.of(codigo) || codigo
  } catch {
    return codigo
  }
}

function nombreCaso(slug: string): string {
  return NOMBRES_CASO[slug] || slug
}

export function nombrePagina(ruta: string): string {
  const r = ruta.replace(/\/$/, '') || '/'
  const caso = r.match(/^\/(?:proyectos|en\/work)\/([^/]+)$/)
  if (caso) return `Caso ${nombreCaso(caso[1])}`
  const fijas: Record<string, string> = {
    '/': 'Home',
    '/en': 'Home en inglés',
    '/proyectos': 'Proyectos',
    '/en/work': 'Proyectos en inglés',
    '/sobre-mi': 'Sobre mí',
    '/en/about': 'Sobre mí en inglés',
    '/contacto': 'Contacto',
    '/en/contact': 'Contacto en inglés',
  }
  return fijas[r] || r
}

function capital(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

/** Nombre legible del enlace con seguimiento, o null si no llegó con uno. */
function etiquetaEnlace(fuente: string, medio: string, campana: string): string | null {
  if (!fuente) return null
  const f = fuente.toLowerCase()
  if (f === 'cv') return 'CV'
  if (f === 'postulacion') return `Postulación · ${campana || 'sin nombre'}`
  const nombres: Record<string, string> = { linkedin: 'LinkedIn', instagram: 'Instagram' }
  const extra = campana || medio
  return `${nombres[f] || capital(fuente)}${extra ? ` · ${extra.replace(/_/g, ' ')}` : ''}`
}

function fuenteDe(referente: string, utmFuente: string): string {
  const u = utmFuente.toLowerCase()
  if (u === 'cv') return 'CV'
  if (u === 'postulacion') return 'Postulación'
  if (u.includes('linkedin')) return 'LinkedIn'
  if (u.includes('instagram')) return 'Instagram'
  if (u) return capital(utmFuente)
  const r = referente.toLowerCase()
  if (!r || r === '$direct') return 'Directo'
  if (r.includes('linkedin') || r === 'lnkd.in') return 'LinkedIn'
  if (r.includes('google')) return 'Google'
  if (r.includes('instagram') || r.includes('facebook')) return 'Instagram'
  if (r.includes('besprone')) return 'Directo'
  return r.replace(/^www\./, '')
}

function aSesion(f: Fila): Sesion {
  const utmFuente = texto(f.utm_fuente)
  const casos = Array.isArray(f.casos) ? (f.casos as unknown[]).map(texto).filter(Boolean) : []
  return {
    persona: texto(f.persona),
    inicio: fecha(f.inicio),
    fin: fecha(f.fin),
    pais: texto(f.pais),
    fuente: fuenteDe(texto(f.referente), utmFuente),
    enlace: etiquetaEnlace(utmFuente, texto(f.utm_medio), texto(f.utm_campana)),
    entrada: texto(f.entrada),
    casos,
    cv: Number(f.cv) || 0,
    mensajes: Number(f.mensajes) || 0,
  }
}

// Inicio del día en la zona de Marco, para que «Hoy» sea su hoy y no el de UTC.
function inicioDelDia(d: Date): Date {
  const dia = new Intl.DateTimeFormat('en-CA', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
  const medianocheUtc = new Date(`${dia}T00:00:00Z`)
  const zona = new Intl.DateTimeFormat('en-US', { timeZone: ZONA, timeZoneName: 'longOffset' })
    .formatToParts(medianocheUtc)
    .find((p) => p.type === 'timeZoneName')?.value
  const m = zona?.match(/GMT([+-])(\d{2}):(\d{2})/)
  const minutos = m ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) : 0
  return new Date(medianocheUtc.getTime() - minutos * 60000)
}

function rangos(periodo: Periodo, ahora: Date) {
  if (periodo === 'hoy') {
    const hoy = inicioDelDia(ahora)
    return { desde: '-3d', inicio: hoy, anterior: new Date(hoy.getTime() - 86400000) }
  }
  const dias = periodo === '7d' ? 7 : 30
  const inicio = new Date(ahora.getTime() - dias * 86400000)
  return { desde: `-${dias * 2 + 1}d`, inicio, anterior: new Date(inicio.getTime() - dias * 86400000) }
}

const unicos = (s: Sesion[]) => new Set(s.map((x) => x.persona)).size

function lista(nombres: string[]): string {
  if (nombres.length <= 1) return nombres.join('')
  return `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`
}

function frase(s: Sesion): string {
  const quien = `Alguien desde ${nombrePais(s.pais)}`
  const llego =
    s.enlace && s.fuente === 'Postulación'
      ? `llegó con el enlace de ${s.enlace.replace('Postulación · ', '')}`
      : s.fuente === 'Directo'
        ? 'entró directo'
        : s.fuente === 'CV'
          ? 'abrió tu CV'
          : `llegó por ${s.fuente}`
  const acciones: string[] = []
  if (s.casos.length) acciones.push(`vio ${lista(s.casos.map(nombreCaso))}`)
  else acciones.push(`vio ${nombrePagina(s.entrada)}`)
  if (s.cv) acciones.push('descargó tu CV')
  if (s.mensajes) acciones.push('te escribió desde Contacto')
  return `${quien} ${llego} y ${lista(acciones)}.`
}

function contar(pares: Map<string, Set<string>>): [string, number][] {
  return [...pares.entries()].map(([k, v]) => [k, v.size] as [string, number]).sort((a, b) => b[1] - a[1])
}

export async function leerDatos(periodo: Periodo): Promise<DatosPanel> {
  const ahora = new Date()
  const { desde, inicio, anterior } = rangos(periodo, ahora)
  const [filasSesiones, filasAhora] = await Promise.all([consultar(SQL_SESIONES, desde), consultar(SQL_AHORA, '-2h', true)])

  const sesiones = filasSesiones.map(aSesion)
  const actuales = sesiones.filter((s) => s.fin >= inicio)
  const previas = sesiones.filter((s) => s.fin >= anterior && s.fin < inicio)

  const cifra = (clave: Cifra['clave'], etiqueta: string, f: (l: Sesion[]) => number): Cifra => ({
    clave,
    etiqueta,
    valor: f(actuales),
    anterior: f(previas),
  })
  const cifras = [
    cifra('visitantes', 'Visitantes', unicos),
    cifra('casos', 'Vieron un caso', (l) => unicos(l.filter((s) => s.casos.length))),
    cifra('cv', 'Descargaron el CV', (l) => l.reduce((n, s) => n + s.cv, 0)),
    cifra('mensajes', 'Te escribieron', (l) => l.reduce((n, s) => n + s.mensajes, 0)),
  ]

  const porFuente = new Map<string, Set<string>>()
  const porCaso = new Map<string, Set<string>>()
  const porEnlace = new Map<string, { visitas: number; casos: Set<string>; segundos: number; ultimo: Date }>()
  for (const s of actuales) {
    if (!porFuente.has(s.fuente)) porFuente.set(s.fuente, new Set())
    porFuente.get(s.fuente)!.add(s.persona)
    for (const c of s.casos) {
      const n = nombreCaso(c)
      if (!porCaso.has(n)) porCaso.set(n, new Set())
      porCaso.get(n)!.add(s.persona)
    }
    if (s.enlace) {
      const e = porEnlace.get(s.enlace) || { visitas: 0, casos: new Set<string>(), segundos: 0, ultimo: s.fin }
      e.visitas += 1
      s.casos.forEach((c) => e.casos.add(nombreCaso(c)))
      e.segundos += Math.max(0, (s.fin.getTime() - s.inicio.getTime()) / 1000)
      if (s.fin > e.ultimo) e.ultimo = s.fin
      porEnlace.set(s.enlace, e)
    }
  }

  const enlaces: Enlace[] = [...porEnlace.entries()]
    .sort((a, b) => b[1].ultimo.getTime() - a[1].ultimo.getTime())
    .map(([etiqueta, e]) => {
      const minutos = Math.round(e.segundos / 60)
      const partes = [
        e.casos.size ? `Vio ${lista([...e.casos])}` : `${e.visitas} ${e.visitas === 1 ? 'visita' : 'visitas'}`,
      ]
      if (minutos > 0) partes.push(`${minutos} min`)
      return { etiqueta, detalle: partes.join(' · '), ultimo: e.ultimo.toISOString() }
    })

  const personasAhora: PersonaAhora[] = filasAhora.map((f) => ({
    pagina: nombrePagina(texto(f.pagina)),
    pais: nombrePais(texto(f.pais)),
    fuente: etiquetaEnlace(texto(f.utm_fuente), '', texto(f.utm_campana)) || fuenteDe(texto(f.referente), texto(f.utm_fuente)),
    segundos: Math.max(0, Math.round((fecha(f.fin).getTime() - fecha(f.inicio).getTime()) / 1000)),
  }))

  const ultima = sesiones[0]
  const actividad: Actividad[] = actuales.slice(0, 8).map((s) => ({ texto: frase(s), cuando: s.fin.toISOString() }))

  return {
    actualizado: ahora.toISOString(),
    periodo,
    muestra: false,
    ahora: personasAhora,
    ultimaVisita: ultima
      ? { cuando: ultima.fin.toISOString(), pais: nombrePais(ultima.pais), pagina: nombrePagina(ultima.entrada) }
      : null,
    cifras,
    enlaces,
    fuentes: contar(porFuente).slice(0, 6),
    casos: contar(porCaso).slice(0, 7),
    actividad,
  }
}
