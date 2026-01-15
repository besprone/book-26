'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initPostHog, getPostHog } from '@/lib/posthog'

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page views cuando cambia la ruta
    if (pathname && typeof window !== 'undefined') {
      // Esperar a que posthog esté inicializado
      const trackPageView = () => {
        const posthog = getPostHog()
        if (posthog && (posthog as any).__loaded) {
          let url = window.origin + pathname
          if (searchParams && searchParams.toString()) {
            url = url + `?${searchParams.toString()}`
          }
          posthog.capture('$pageview', {
            $current_url: url,
          })
        } else {
          // Reintentar después de un breve delay
          setTimeout(trackPageView, 100)
        }
      }
      trackPageView()
    }
  }, [pathname, searchParams])

  return <></>
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inicializar PostHog solo una vez
    initPostHog()
    
    // En desarrollo local, silenciar errores comunes de PostHog que no afectan funcionalidad
    // Estos errores (404, 401, MIME type) son normales en local y desaparecen en producción
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const originalError = console.error
      
      console.error = (...args: any[]) => {
        const message = args.join(' ')
        // Filtrar errores conocidos de PostHog en desarrollo local
        if (
          message.includes('posthog') &&
          (message.includes('404') || 
           message.includes('401') || 
           message.includes('MIME type') ||
           message.includes('Failed to load resource') ||
           message.includes('ERR_ABORTED'))
        ) {
          // Silenciar estos errores en desarrollo (son normales en local)
          return
        }
        originalError.apply(console, args)
      }
    }
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </>
  )
}
