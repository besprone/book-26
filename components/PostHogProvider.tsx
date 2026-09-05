'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'

// La inicialización va a nivel de módulo, no dentro de un useEffect: los
// efectos se ejecutan de hijo a padre, así que el useEffect de PostHogPageView
// correría antes que el del provider y el primer $pageview se perdería.
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_PROJECT_API_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_API_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com',
    // Los $pageview los emite PostHogPageView en cada cambio de ruta. Con la
    // captura automática activada además, la carga inicial se contaba dos veces.
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
  })
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  // useSearchParams() devuelve un objeto nuevo en cada render. Si se usa como
  // dependencia directa, el efecto se vuelve a disparar aunque la query no haya
  // cambiado y el $pageview se emite dos veces por carga.
  const query = searchParams?.toString() ?? ''

  useEffect(() => {
    if (!pathname || !posthog) return

    const url = window.origin + pathname + (query ? `?${query}` : '')
    posthog.capture('$pageview', { $current_url: url })
  }, [pathname, query, posthog])

  return null
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      {/* useSearchParams obliga a envolver en Suspense para no forzar
          el renderizado dinámico de todas las páginas */}
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  )
}
