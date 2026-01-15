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
      if (posthog && (posthog as any).__loaded) {
        const originalCapture = posthog.capture.bind(posthog)
        posthog.capture = function(eventName: string, properties?: Record<string, any>) {
          console.log('📊 PostHog Event:', eventName, properties)
          setStatus((prev) => ({
            ...prev,
            events: [
              ...prev.events,
              { event: eventName, timestamp: Date.now() },
            ].slice(-10), // Mantener solo los últimos 10 eventos
          }))
          return originalCapture(eventName, properties)
        }
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
        {status.events.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            <div className="text-gray-400 mb-1">Recent Events:</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {status.events.map((e, i) => (
                <div key={i} className="text-green-400">
                  • {e.event}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
