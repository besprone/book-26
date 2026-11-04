'use client'

import { usePathname } from 'next/navigation'
import { analytics } from '@/lib/analytics'

interface FilterChipsProps {
  filters: string[]
  activeFilter: string
  onFilterChange: (filter: string) => void
  /** Traduce la clave del filtro a su etiqueta visible. El valor interno
   *  ("Todo") no cambia entre idiomas para no romper el filtrado. */
  etiqueta?: (filter: string) => string
  /** Cuántos casos hay en cada filtro. */
  conteo: (filter: string) => number
}

export default function FilterChips({
  filters,
  activeFilter,
  onFilterChange,
  etiqueta = (f) => f,
  conteo,
}: FilterChipsProps) {
  const pathname = usePathname()
  
  const handleFilterClick = (filter: string) => {
    if (typeof window !== 'undefined') {
      const ctaLocation = pathname || 'unknown'
      analytics.ctaClicked(filter, 'filter', ctaLocation, `#filter-${filter}`, 'filters')
    }
    onFilterChange(filter)
  }
  
  // Van sobre la banda de color de Proyectos, por eso son blancos.
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const activo = activeFilter === filter
        return (
          <button
            key={filter}
            type="button"
            onClick={() => handleFilterClick(filter)}
            aria-pressed={activo}
            className={`inline-flex h-9 items-center rounded-full border border-white px-3.5 text-sm transition duration-motion-base focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-500 ${
              activo ? 'bg-white text-primary-500' : 'text-white hover:bg-white/15'
            }`}
          >
            {etiqueta(filter)}
            <span aria-hidden="true" className="mx-1">·</span>
            {conteo(filter)}
          </button>
        )
      })}
    </div>
  )
}
