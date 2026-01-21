'use client'

import { useEffect, useRef } from 'react'
import { analytics } from '@/lib/analytics'

interface VideoTrackerProps {
  projectSlug: string
  videoUrl: string
}

// Declarar tipos para YouTube API
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export default function VideoTracker({ projectSlug, videoUrl }: VideoTrackerProps) {
  const hasTracked = useRef(false)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    if (hasTracked.current || typeof window === 'undefined') return

    const trackVideoPlayed = () => {
      if (hasTracked.current) return
      
      // Log temporal para debug (solo en desarrollo)
      if (process.env.NODE_ENV === 'development') {
        console.log(`▶️ Video played: ${projectSlug}`)
      }
      
      analytics.videoPlayed(projectSlug, videoUrl)
      hasTracked.current = true
    }

    // Buscar el iframe de YouTube en el DOM
    const findIframe = () => {
      return document.querySelector('iframe[src*="youtube.com"]') as HTMLIFrameElement
    }

    // Función para inicializar el reproductor de YouTube
    const initPlayer = () => {
      const iframe = findIframe()
      if (!iframe || !window.YT || !window.YT.Player) return

      try {
        // Crear instancia del reproductor
        playerRef.current = new window.YT.Player(iframe, {
          events: {
            onStateChange: (event: any) => {
              // Estado 1 = PLAYING
              if (event.data === 1 && !hasTracked.current) {
                trackVideoPlayed()
              }
            },
          },
        })
      } catch (error) {
        // Si falla, usar método alternativo con postMessage
        if (process.env.NODE_ENV === 'development') {
          console.warn('Failed to create YT.Player, using postMessage fallback')
        }
        setupPostMessageListener(iframe)
      }
    }

    // Método alternativo: escuchar mensajes postMessage
    const setupPostMessageListener = (iframe: HTMLIFrameElement) => {
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== 'https://www.youtube.com') return

        try {
          let data
          if (typeof event.data === 'string') {
            try {
              data = JSON.parse(event.data)
            } catch {
              data = event.data
            }
          } else {
            data = event.data
          }
          
          // Detectar cuando el video se reproduce
          if (data) {
            // Formato: {event: "onStateChange", info: 1} donde 1 = playing
            if (data.event === 'onStateChange' && data.info === 1) {
              if (!hasTracked.current) {
                trackVideoPlayed()
              }
            }
            // Formato alternativo
            else if (data.info && data.info.playerState === 1) {
              if (!hasTracked.current) {
                trackVideoPlayed()
              }
            }
          }
        } catch (e) {
          // Ignorar errores
        }
      }

      window.addEventListener('message', handleMessage)

      // Fallback: detectar click en el iframe
      const clickHandler = () => {
        setTimeout(() => {
          if (!hasTracked.current) {
            trackVideoPlayed()
          }
        }, 1500)
      }

      iframe.addEventListener('click', clickHandler)

      return () => {
        window.removeEventListener('message', handleMessage)
        iframe.removeEventListener('click', clickHandler)
      }
    }

    // Cargar YouTube IFrame API si no está cargada
    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        // API ya cargada
        const iframe = findIframe()
        if (iframe) {
          initPlayer()
        } else {
          // Esperar a que el iframe se renderice
          const checkIframe = setInterval(() => {
            const iframe = findIframe()
            if (iframe) {
              clearInterval(checkIframe)
              initPlayer()
            }
          }, 100)

          setTimeout(() => clearInterval(checkIframe), 5000)
        }
        return
      }

      // Cargar el script de la API
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

        // Callback cuando la API está lista
        window.onYouTubeIframeAPIReady = () => {
          const iframe = findIframe()
          if (iframe) {
            initPlayer()
          } else {
            // Esperar a que el iframe se renderice
            const checkIframe = setInterval(() => {
              const iframe = findIframe()
              if (iframe) {
                clearInterval(checkIframe)
                initPlayer()
              }
            }, 100)

            setTimeout(() => clearInterval(checkIframe), 5000)
          }
        }
      } else {
        // Script ya existe, esperar a que esté listo
        const checkAPI = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(checkAPI)
            const iframe = findIframe()
            if (iframe) {
              initPlayer()
            } else {
              const checkIframe = setInterval(() => {
                const iframe = findIframe()
                if (iframe) {
                  clearInterval(checkIframe)
                  initPlayer()
                }
              }, 100)
              setTimeout(() => clearInterval(checkIframe), 5000)
            }
          }
        }, 100)

        setTimeout(() => clearInterval(checkAPI), 5000)
      }
    }

    // Esperar a que el iframe se renderice antes de inicializar
    const checkIframe = setInterval(() => {
      const iframe = findIframe()
      if (iframe) {
        clearInterval(checkIframe)
        loadYouTubeAPI()
      }
    }, 100)

    // Timeout de seguridad
    const timeout = setTimeout(() => {
      clearInterval(checkIframe)
    }, 5000)

    return () => {
      clearInterval(checkIframe)
      clearTimeout(timeout)
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy()
        } catch (e) {
          // Ignorar errores
        }
      }
    }
  }, [projectSlug, videoUrl])

  return <></>
}
