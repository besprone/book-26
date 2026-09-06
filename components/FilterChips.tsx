'use client'

import { usePathname } from 'next/navigation'
import { analytics } from '@/lib/analytics'
import { baseBoton, tamanosBoton, variantesBoton } from '@/lib/estilos-boton'

interface FilterChipsProps {
  filters: string[]
  activeFilter: string
  onFilterChange: (filter: string) => void
  /** Traduce la clave del filtro a su etiqueta visible. El valor interno
   *  ("Todo") no cambia entre idiomas para no romper el filtrado. */
  etiqueta?: (filter: string) => string
}

export default function FilterChips({
  filters,
  activeFilter,
  onFilterChange,
  etiqueta = (f) => f,
}: FilterChipsProps) {
  const pathname = usePathname()
  
  const handleFilterClick = (filter: string) => {
    if (typeof window !== 'undefined') {
      const ctaLocation = pathname || 'unknown'
      analytics.ctaClicked(filter, 'filter', ctaLocation, `#filter-${filter}`, 'filters')
    }
    onFilterChange(filter)
  }
  
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => handleFilterClick(filter)}
          aria-pressed={activeFilter === filter}
          className={`${baseBoton} ${tamanosBoton.sm} ${
            activeFilter === filter
              ? // El filtro activo usa 'tonal': presencia suficiente para leerse
                // como seleccionado sin competir con la acción principal.
                variantesBoton.tonal
              : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 ' +
                'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {etiqueta(filter)}
        </button>
      ))}
    </div>
  )
}

