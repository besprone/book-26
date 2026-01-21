'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { analytics } from '@/lib/analytics'

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
          const page = pathname || 'unknown'
          analytics.scrollDepth(page, milestone)
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
