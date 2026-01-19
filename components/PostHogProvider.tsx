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
          try {
            posthog.capture('$pageview', {
              $current_url: url,
            })
          } catch (error) {
            // Silenciar errores de tracking
          }
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
    
    // Interceptación de red deshabilitada para reducir logs
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
