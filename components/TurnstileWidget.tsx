'use client'

import { useEffect, useRef } from 'react'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
const SCRIPT_ID = 'cf-turnstile-script'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id?: string) => void
      remove: (id?: string) => void
    }
  }
}

/** Carga el script de Cloudflare una sola vez, aunque haya varios widgets. */
let cargaScript: Promise<void> | null = null
function cargarTurnstile(): Promise<void> {
  if (cargaScript) return cargaScript

  cargaScript = new Promise((resolve, reject) => {
    if (window.turnstile) return resolve()

    const existente = document.getElementById(SCRIPT_ID)
    if (existente) {
      existente.addEventListener('load', () => resolve())
      existente.addEventListener('error', () => reject(new Error('turnstile')))
      return
    }

    const s = document.createElement('script')
    s.id = SCRIPT_ID
    s.src = SCRIPT_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('turnstile'))
    document.head.appendChild(s)
  })

  return cargaScript
}

interface TurnstileWidgetProps {
  /** Se llama con el token al resolverse, y con null al expirar o fallar. */
  onToken: (token: string | null) => void
}

/**
 * Widget invisible de Cloudflare Turnstile.
 *
 * Solo se monta si NEXT_PUBLIC_TURNSTILE_SITE_KEY está configurada: sin ella
 * este componente no renderiza nada y el formulario sigue funcionando igual.
 */
export default function TurnstileWidget({ onToken }: TurnstileWidgetProps) {
  const contenedor = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  // Se guarda en ref para no re-renderizar el widget si cambia la identidad
  // de la función entre renders del formulario.
  const onTokenRef = useRef(onToken)
  onTokenRef.current = onToken

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!siteKey || !contenedor.current) return

    let cancelado = false

    cargarTurnstile()
      .then(() => {
        if (cancelado || !contenedor.current || !window.turnstile) return

        widgetId.current = window.turnstile.render(contenedor.current, {
          sitekey: siteKey,
          size: 'flexible',
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => onTokenRef.current(null),
        })
      })
      .catch(() => {
        // Si el script no carga (bloqueador, red caída) no se deja al visitante
        // atrapado: el servidor decidirá si acepta el envío sin token.
        if (!cancelado) onTokenRef.current(null)
      })

    return () => {
      cancelado = true
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current)
        widgetId.current = null
      }
    }
  }, [siteKey])

  if (!siteKey) return null

  return <div ref={contenedor} className="min-h-[65px]" />
}

/** Reinicia el widget: los tokens son de un solo uso. */
export function reiniciarTurnstile() {
  window.turnstile?.reset()
}
