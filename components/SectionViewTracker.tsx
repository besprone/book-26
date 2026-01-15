'use client'

import { useEffect, useRef } from 'react'
import { getPostHog } from '@/lib/posthog'

interface SectionViewTrackerProps {
  sectionName: string
  className?: string
}

export default function SectionViewTracker({ sectionName, className = '' }: SectionViewTrackerProps) {
  const hasTracked = useRef(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hasTracked.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTracked.current) {
            try {
              const posthog = getPostHog()
              if (posthog && (posthog as any).__loaded) {
                posthog.capture('section_viewed', {
                  section_name: sectionName,
                })
              }
            } catch (e) {}
            hasTracked.current = true
            observer.disconnect()
          }
        })
      },
      {
        threshold: 0.5, // Cuando el 50% de la sección es visible
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [sectionName])

  return <div ref={sectionRef} className={className} aria-hidden="true" />
}
