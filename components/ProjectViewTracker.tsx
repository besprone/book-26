'use client'

import { useEffect, useRef } from 'react'
import { analytics, recordarProyectoVisto } from '@/lib/analytics'

interface ProjectViewTrackerProps {
  projectSlug: string
  projectTitle: string
  projectType?: string[]
}

export default function ProjectViewTracker({
  projectSlug,
  projectTitle,
  projectType,
}: ProjectViewTrackerProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    // Prevenir múltiples envíos del mismo proyecto
    if (hasTracked.current) return
    
    // Pequeño delay para asegurar que el DOM esté listo
    const timeoutId = setTimeout(() => {
      const typeArray = Array.isArray(projectType) && projectType.length > 0 ? projectType : undefined
      
      // Log temporal para debug (solo en desarrollo)
      if (process.env.NODE_ENV === 'development') {
        console.log(`📄 Project viewed: ${projectTitle} (${projectSlug})`)
      }
      
      analytics.projectViewed(projectSlug, projectTitle, typeArray)
      // Se guarda en la sesión para atribuir un contacto posterior a este caso
      recordarProyectoVisto(projectSlug, projectTitle)
      hasTracked.current = true
    }, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [projectSlug, projectTitle, projectType])

  return <></>
}
