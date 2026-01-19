'use client'

import { useEffect, useState } from 'react'
import { getPostHog } from '@/lib/posthog'

export default function PostHogDebug() {
  const [status, setStatus] = useState<{
    initialized: boolean
    key: string | null
    host: string | null
    events: Array<{ event: string; timestamp: number }>
  }>({
    initialized: false,
    key: null,
    host: null,
    events: [],
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkPostHog = () => {
      const posthog = getPostHog()
      const key = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_API_KEY
      const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com'

      setStatus({
        initialized: !!(posthog && (posthog as any).__loaded),
        key: key ? `${key.substring(0, 15)}...` : null,
        host,
        events: [],
      })

      // Interceptar eventos de PostHog para debug
      if (posthog && (posthog as any).__loaded && !(posthog as any).__captureIntercepted) {
        const originalCapture = posthog.capture.bind(posthog)
        posthog.capture = function(eventName: string, properties?: Record<string, any>) {
          // Logs deshabilitados - solo actualizar estado del debug panel
          setStatus((prev) => ({
            ...prev,
            events: [
              ...prev.events,
              { event: eventName, timestamp: Date.now() },
            ].slice(-10), // Mantener solo los últimos 10 eventos
          }))
          return originalCapture(eventName, properties)
        }
        ;(posthog as any).__captureIntercepted = true
      }
    }

    // Verificar cada segundo
    const interval = setInterval(checkPostHog, 1000)
    checkPostHog()

    return () => clearInterval(interval)
  }, [])

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const sendTestEvent = () => {
    const posthog = getPostHog()
    if (posthog && (posthog as any).__loaded) {
      posthog.capture('manual_test_event', {
        test: true,
        timestamp: new Date().toISOString(),
        source: 'debug_panel',
      })
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg text-xs z-50 max-w-sm">
      <div className="font-bold mb-2">🐛 PostHog Debug</div>
      <div className="space-y-1">
        <div>
          <span className="text-gray-400">Status:</span>{' '}
          <span className={status.initialized ? 'text-green-400' : 'text-red-400'}>
            {status.initialized ? '✅ Connected' : '❌ Not Connected'}
          </span>
        </div>
        {status.key && (
          <div>
            <span className="text-gray-400">Key:</span> {status.key}
          </div>
        )}
        {status.host && (
          <div>
            <span className="text-gray-400">Host:</span> {status.host}
          </div>
        )}
        {status.initialized && (
          <button
            onClick={sendTestEvent}
            className="mt-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs"
          >
            🧪 Send Test Event
          </button>
        )}
        {status.events.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            <div className="text-gray-400 mb-1">Recent Events ({status.events.length}):</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {status.events.map((e, i) => (
                <div key={i} className="text-green-400">
                  • {e.event}
                </div>
              ))}
            </div>
          </div>
        )}
        {status.events.length === 0 && status.initialized && (
          <div className="mt-2 pt-2 border-t border-gray-700 text-yellow-400">
            ⚠️ No events captured yet
          </div>
        )}
      </div>
    </div>
  )
}
