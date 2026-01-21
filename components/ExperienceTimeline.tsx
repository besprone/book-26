'use client'

import { useEffect, useRef } from 'react'
import { analytics } from '@/lib/analytics'

interface ExperienceItem {
  title: string
  company: string
  period: string
  logo?: string
}

interface ExperienceTimelineProps {
  items: ExperienceItem[]
}

export default function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackedScrolls = useRef<Set<number>>(new Set())

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      if (!container) return
      
      const scrollLeft = container.scrollLeft
      const scrollWidth = container.scrollWidth
      const clientWidth = container.clientWidth
      const maxScroll = scrollWidth - clientWidth
      
      if (maxScroll > 0) {
        const scrollPercentage = Math.round((scrollLeft / maxScroll) * 100)
        
        // Trackear en 25%, 50%, 75%, 100%
        const milestones = [25, 50, 75, 100]
        milestones.forEach((milestone) => {
          if (scrollPercentage >= milestone && !trackedScrolls.current.has(milestone)) {
            trackedScrolls.current.add(milestone)
            analytics.experienceSectionScrolled(milestone)
          }
        })
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="relative">
      {/* Scroll horizontal container */}
      <div className="overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0" ref={containerRef}>
        <div className="relative min-w-max md:min-w-0">
          {/* Cards de experiencia - scroll horizontal */}
          <div className="flex gap-6 lg:gap-8 relative z-10" style={{ minWidth: 'max-content' }}>
            {items.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-60 lg:w-64 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Logo */}
                  <div className="mb-5">
                    {item.logo ? (
                      <img
                        src={item.logo}
                        alt={item.company}
                        className="w-16 h-16 object-contain rounded-lg mx-auto"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center mx-auto">
                        <span className="text-gray-600 dark:text-gray-300 font-bold text-xl">
                          {item.company.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Contenido */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {item.company}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                    {item.period}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicador de scroll en móvil */}
      <div className="lg:hidden text-center mt-4">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          ← Desliza para ver más →
        </p>
      </div>
    </div>
  )
}
