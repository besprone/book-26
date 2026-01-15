'use client'

import { useEffect, useRef } from 'react'
import { getPostHog } from '@/lib/posthog'

interface VideoTrackerProps {
  projectSlug: string
  videoUrl: string
}

export default function VideoTracker({ projectSlug, videoUrl }: VideoTrackerProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current || typeof window === 'undefined') return

    // Buscar el iframe de YouTube en el DOM
    const findIframe = () => {
      return document.querySelector('iframe[src*="youtube.com"]') as HTMLIFrameElement
    }

    // Esperar a que el iframe se renderice
    const checkIframe = setInterval(() => {
      const iframe = findIframe()
      if (iframe) {
        clearInterval(checkIframe)

        // Observar cuando el iframe es visible
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !hasTracked.current) {
                // Trackear después de que el iframe sea visible por 2 segundos
                const timer = setTimeout(() => {
                  if (!hasTracked.current && entry.isIntersecting) {
                    try {
                      const posthog = getPostHog()
                      if (posthog && (posthog as any).__loaded) {
                        posthog.capture('video_played', {
                          project_slug: projectSlug,
                          video_url: videoUrl,
                        })
                      }
                    } catch (e) {}
                    hasTracked.current = true
                    observer.disconnect()
                  }
                }, 2000)

                // Cleanup del timer si el componente se desmonta
                return () => clearTimeout(timer)
              }
            })
          },
          { threshold: 0.5 }
        )

        observer.observe(iframe)

        return () => {
          observer.disconnect()
        }
      }
    }, 100)

    // Timeout de seguridad
    const timeout = setTimeout(() => {
      clearInterval(checkIframe)
    }, 5000)

    return () => {
      clearInterval(checkIframe)
      clearTimeout(timeout)
    }
  }, [projectSlug, videoUrl])

  return <></>
}
