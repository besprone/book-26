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
let cargando: Promise<PostHog | null> | null = null

export function getPostHog(): Promise<PostHog | null> {
  if (typeof window === 'undefined') return Promise.resolve(null)

  if (!cargando) {
    cargando = import('posthog-js')
      .then(({ default: posthog }) => {
        const key = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_API_KEY
        if (!key) return null

        if (!(posthog as unknown as { __loaded?: boolean }).__loaded) {
          posthog.init(key, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com',
            // Los $pageview los emite PostHogProvider en cada cambio de ruta.
            // Con la captura automática activada además, la carga inicial se
            // contaba dos veces.
            capture_pageview: false,
            capture_pageleave: true,
            autocapture: true,
          })
        }
        return posthog
      })
      .catch(() => null) // adblocker o red caída: la web sigue funcionando
  }

  return cargando
}
