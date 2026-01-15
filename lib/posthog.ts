// Variable global para almacenar posthog una vez cargado
let posthogInstance: any = null
let isInitializing = false
let isInitialized = false

// Función para obtener posthog de forma segura (solo en cliente)
export const getPostHog = () => {
  if (typeof window === 'undefined') return null
  return posthogInstance
}

export const initPostHog = () => {
  if (typeof window === 'undefined') return
  
  // Evitar múltiples inicializaciones
  if (isInitialized || isInitializing) {
    return
  }

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com'

  if (!posthogKey) {
    return
  }

  isInitializing = true

  // Importación dinámica
  import('posthog-js').then((posthogModule) => {
    const posthog = posthogModule.default
    
    // Verificar si ya está inicializado
    if (posthog && (posthog as any).__loaded) {
      posthogInstance = posthog
      isInitialized = true
      isInitializing = false
      return
    }

    // Inicializar solo si no está ya inicializado
    if (posthog && !(posthog as any).__loaded) {
      try {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          loaded: (loadedInstance) => {
            posthogInstance = loadedInstance
            isInitialized = true
            isInitializing = false
            if (process.env.NODE_ENV === 'development') {
              console.log('PostHog loaded')
            }
          },
          // Session recordings
          session_recording: {
            recordCrossOriginIframes: true,
          },
          // Autocapture para eventos básicos
          autocapture: true,
          // Capturar clicks en enlaces externos
          capture_pageview: true,
          capture_pageleave: true,
          // Deshabilitar features que pueden causar errores 404/401
          advanced_disable_decide: false,
          // Deshabilitar feature flags si causan problemas
          disable_persistence: false,
        })
        // Guardar instancia también antes de que se cargue completamente
        posthogInstance = posthog
      } catch (error) {
        isInitializing = false
        // Silenciar errores de inicialización
      }
    }
  }).catch(() => {
    isInitializing = false
    // Silenciar errores de carga del módulo
  })
}
