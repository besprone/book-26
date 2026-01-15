'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { getPostHog } from '@/lib/posthog'

export default function ScrollDepthTracker() {
  const pathname = usePathname()
  const trackedDepths = useRef<Set<number>>(new Set())

  useEffect(() => {
    trackedDepths.current.clear()
    
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const scrollPercentage = Math.round((scrollTop / (documentHeight - windowHeight)) * 100)

      // Trackear en 25%, 50%, 75%, 100%
      const milestones = [25, 50, 75, 100]
      milestones.forEach((milestone) => {
        if (scrollPercentage >= milestone && !trackedDepths.current.has(milestone)) {
          trackedDepths.current.add(milestone)
          try {
            const posthog = getPostHog()
            if (posthog && (posthog as any).__loaded) {
              posthog.capture('scroll_depth', {
                page: pathname || 'unknown',
                depth_percentage: milestone,
              })
            }
          } catch (e) {}
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])

  return <></>
}
