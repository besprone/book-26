'use client'

import { useCallback, useEffect, useState } from 'react'
import { diagnosticarPostHog, hostPostHog, type DiagnosticoPostHog } from '@/lib/posthog'

type Estado = DiagnosticoPostHog['estado'] | 'cargando'

/**
 * Panel de depuración de la analítica. Sólo en desarrollo.
 *
 * Antes decía "Not Connected" en rojo y nada más, con lo que no se podía saber
 * si faltaba la clave, si un bloqueador se había comido la librería o si algo
 * se había roto de verdad. Como en local nunca hay clave —vive en Vercel— el
 * caso más común era además el más alarmante de leer.
 *
 * Ahora nombra el motivo, y sólo pinta en rojo lo que de verdad lo merece.
 * Además se puede plegar: estaba fijo sobre la esquina inferior derecha de
 * todas las páginas y tapaba el contenido que uno está revisando.
 */
const textos: Record<Estado, { punto: string; texto: string; detalle: string }> = {
  cargando: {
    punto: 'bg-gray-500',
    texto: 'text-gray-400',
    detalle: 'Comprobando…',
  },
  conectado: {
    punto: 'bg-green-400',
    texto: 'text-green-400',
    detalle: 'Emitiendo eventos.',
  },
  'sin-clave': {
    punto: 'bg-gray-500',
    texto: 'text-gray-400',
    detalle:
      'Sin NEXT_PUBLIC_POSTHOG_PROJECT_API_KEY en este entorno. Es lo normal en local: la clave vive en Vercel.',
  },
  bloqueado: {
    punto: 'bg-amber-400',
    texto: 'text-amber-400',
    detalle: 'La clave está, pero no se pudo cargar la librería. Suele ser un bloqueador de rastreadores.',
  },
}

const etiquetas: Record<Estado, string> = {
  cargando: 'Cargando',
  conectado: 'Conectado',
  'sin-clave': 'Sin clave',
  bloqueado: 'Bloqueado',
}

const RECORDAR = 'debug-posthog-plegado'

export default function PostHogDebug() {
  const [estado, setEstado] = useState<Estado>('cargando')
  const [eventos, setEventos] = useState<string[]>([])
  const [plegado, setPlegado] = useState(true)

  // La preferencia se lee después de montar para no desincronizar el HTML del
  // servidor con el del cliente.
  useEffect(() => {
    setPlegado(window.localStorage.getItem(RECORDAR) !== 'no')
  }, [])

  const alternar = useCallback(() => {
    setPlegado((p) => {
      window.localStorage.setItem(RECORDAR, p ? 'no' : 'si')
      return !p
    })
  }, [])

  useEffect(() => {
    let vivo = true

    diagnosticarPostHog().then((d) => {
      if (!vivo) return
      setEstado(d.estado)
      if (d.estado !== 'conectado') return

      const ph = d.posthog as unknown as { __captureIntercepted?: boolean }
      if (ph.__captureIntercepted) return

      const original = d.posthog.capture.bind(d.posthog)
      d.posthog.capture = function (nombre: string, props?: Record<string, unknown>) {
        setEventos((prev) => [...prev, nombre].slice(-10))
        return original(nombre, props)
      }
      ph.__captureIntercepted = true
    })

    return () => {
      vivo = false
    }
  }, [])

  if (process.env.NODE_ENV !== 'development') return null

  const { punto, texto, detalle } = textos[estado]

  if (plegado) {
    return (
      <button
        type="button"
        onClick={alternar}
        aria-label={`Depuración de analítica: ${etiquetas[estado]}. Abrir panel`}
        className="fixed bottom-4 right-4 z-50 flex h-9 items-center gap-2 rounded-full bg-gray-900/90 px-3 text-xs text-white shadow-lg backdrop-blur-sm transition hover:bg-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <span className={`h-2 w-2 shrink-0 rounded-full ${punto}`} aria-hidden="true" />
        <span className="font-medium">Analítica</span>
        <span className={texto}>{etiquetas[estado]}</span>
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs rounded-lg bg-gray-900/95 p-4 text-xs text-white shadow-lg backdrop-blur-sm">
      <div className="mb-2 flex items-center gap-2">
        <span className={`h-2 w-2 shrink-0 rounded-full ${punto}`} aria-hidden="true" />
        <span className="font-medium">Analítica</span>
        <span className={texto}>{etiquetas[estado]}</span>
        <button
          type="button"
          onClick={alternar}
          aria-label="Plegar panel"
          className="ml-auto -mr-1 rounded px-1.5 py-0.5 text-gray-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          ✕
        </button>
      </div>

      <p className="leading-relaxed text-gray-400">{detalle}</p>

      {estado === 'conectado' && (
        <p className="mt-2 break-all text-gray-500">{hostPostHog}</p>
      )}

      {estado === 'conectado' && (
        <button
          type="button"
          onClick={() =>
            diagnosticarPostHog().then(
              (d) =>
                d.estado === 'conectado' &&
                d.posthog.capture('manual_test_event', { source: 'debug_panel' })
            )
          }
          className="mt-3 rounded bg-white/10 px-2 py-1 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          Enviar evento de prueba
        </button>
      )}

      {estado === 'conectado' && (
        <div className="mt-3 border-t border-gray-700 pt-2">
          {eventos.length === 0 ? (
            <p className="text-gray-500">Sin eventos todavía.</p>
          ) : (
            <>
              <p className="mb-1 text-gray-400">Últimos eventos ({eventos.length})</p>
              <ul className="max-h-32 space-y-0.5 overflow-y-auto">
                {eventos.map((e, i) => (
                  <li key={`${e}-${i}`} className="text-green-400">
                    {e}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
