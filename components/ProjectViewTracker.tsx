'use client'

import { useEffect } from 'react'
import { getPostHog } from '@/lib/posthog'

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
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const trackProjectView = () => {
      const posthog = getPostHog()
      if (posthog && (posthog as any).__loaded) {
        const typeArray = Array.isArray(projectType) && projectType.length > 0 ? projectType : undefined
        posthog.capture('project_viewed', {
          project_slug: projectSlug,
          project_title: projectTitle,
          project_type: typeArray,
        })
      } else {
        setTimeout(trackProjectView, 100)
      }
    }
    
    trackProjectView()
  }, [projectSlug, projectTitle, projectType])

  return <></>
}
