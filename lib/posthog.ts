import type { PostHog } from 'posthog-js'

/**
 * Carga diferida de posthog-js.
 *
 * La librería pesa unos 54 kB y no hace falta para pintar la página, así que
 * importarla de forma estática la metía en el bundle inicial de todas las
 * rutas. Aquí se importa bajo demanda y la promesa se cachea, de modo que
 * `posthog-js` acaba en su propio chunk.
 *
 * Como todo pasa por esta promesa, los eventos que se disparen antes de que
 * termine la carga no se pierden: se emiten cuando resuelve.
 */

/**
 * Por qué no hay analítica, cuando no la hay.
 *
 * `getPostHog()` devuelve `null` en tres situaciones muy distintas y antes no
 * se podían distinguir: el panel de depuración pintaba el mismo rojo tanto si
 * faltaba la clave (lo normal en local) como si un bloqueador había impedido
 * descargar la librería. Diagnosticar eso a ojo costaba más que arreglarlo.
 *
 *   sin-clave   No hay NEXT_PUBLIC_POSTHOG_PROJECT_API_KEY en el entorno. Es
 *               lo esperado en local: la clave sólo vive en Vercel.
 *   bloqueado   La clave está, pero el import falló. Casi siempre es un
 *               bloqueador de rastreadores; también puede ser la red.
 *   conectado   Inicializado y emitiendo.
 */
export type DiagnosticoPostHog =
  | { estado: 'conectado'; posthog: PostHog }
  | { estado: 'sin-clave' }
  | { estado: 'bloqueado' }

const CLAVE = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_API_KEY
export const hostPostHog = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com'

let cargando: Promise<DiagnosticoPostHog> | null = null

/** Estado de la analítica, con el motivo cuando no está disponible. */
export function diagnosticarPostHog(): Promise<DiagnosticoPostHog> {
  if (typeof window === 'undefined') return Promise.resolve({ estado: 'sin-clave' })

  if (!cargando) {
    // Sin clave ni siquiera se descarga la librería: son 54 kB que no van a
    // servir para nada.
    if (!CLAVE) {
      cargando = Promise.resolve({ estado: 'sin-clave' })
    } else {
      cargando = import('posthog-js')
        .then(({ default: posthog }): DiagnosticoPostHog => {
          if (!(posthog as unknown as { __loaded?: boolean }).__loaded) {
            posthog.init(CLAVE, {
              api_host: hostPostHog,
              // Los $pageview los emite PostHogProvider en cada cambio de
              // ruta. Con la captura automática activada además, la carga
              // inicial se contaba dos veces.
              capture_pageview: false,
              capture_pageleave: true,
              autocapture: true,
            })
          }
          return { estado: 'conectado', posthog }
        })
        // Bloqueador o red caída: la web sigue funcionando.
        .catch((): DiagnosticoPostHog => ({ estado: 'bloqueado' }))
    }
  }

  return cargando
}

/**
 * La instancia de PostHog, o `null` si no hay analítica.
 *
 * Es la vía normal: a quien emite un evento no le importa por qué no hay
 * analítica, sólo si la hay. El motivo lo usa el panel de depuración.
 */
export function getPostHog(): Promise<PostHog | null> {
  return diagnosticarPostHog().then((d) => (d.estado === 'conectado' ? d.posthog : null))
}
