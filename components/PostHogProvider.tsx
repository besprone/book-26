'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { getPostHog } from '@/lib/posthog'

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // useSearchParams() devuelve un objeto nuevo en cada render. Si se usa como
  // dependencia directa, el efecto se vuelve a disparar aunque la query no haya
  // cambiado y el $pageview se emite dos veces por carga.
  const query = searchParams?.toString() ?? ''

  useEffect(() => {
    if (!pathname) return

    const url = window.origin + pathname + (query ? `?${query}` : '')
    // getPostHog() importa e inicializa la librería la primera vez, y cachea
    // la promesa. No hace falta esperar a que esté lista antes de emitir:
    // el evento sale cuando resuelve.
    getPostHog().then((posthog) => posthog?.capture('$pageview', { $current_url: url }))
  }, [pathname, query])

  return null
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* useSearchParams obliga a envolver en Suspense para no forzar
          el renderizado dinámico de todas las páginas */}
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </>
  )
}
