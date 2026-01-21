'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { analytics } from '@/lib/analytics'

interface SectionViewTrackerProps {
  sectionName: string
  className?: string
}

export default function SectionViewTracker({ sectionName, className = '' }: SectionViewTrackerProps) {
  const pathname = usePathname()
  const hasTracked = useRef(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hasTracked.current) return

    let observer: IntersectionObserver | null = null

    // Pequeño delay para asegurar que el DOM esté listo
    const timeoutId = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasTracked.current) {
              const page = pathname || 'unknown'
              
              // Log temporal para debug (solo en desarrollo)
              if (process.env.NODE_ENV === 'development') {
                console.log(`👁️ Section viewed: ${sectionName} on page: ${page}`, {
                  intersectionRatio: entry.intersectionRatio,
                  boundingClientRect: entry.boundingClientRect,
                })
              }
              
              analytics.sectionViewed(sectionName, page)
              hasTracked.current = true
              if (observer) {
                observer.disconnect()
              }
            }
          })
        },
        {
          threshold: [0, 0.1, 0.5], // Múltiples thresholds para mejor detección
          rootMargin: '0px 0px -10% 0px', // Se activa cuando está 10% desde el bottom del viewport
        }
      )

      if (sectionRef.current) {
        observer.observe(sectionRef.current)
      }
    }, 100) // Delay de 100ms para asegurar que el DOM esté listo

    return () => {
      clearTimeout(timeoutId)
      if (observer) {
        observer.disconnect()
      }
    }
  }, [sectionName, pathname])

  return <div ref={sectionRef} className={className} aria-hidden="true" />
}
