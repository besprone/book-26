'use client'

import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import { analytics } from '@/lib/analytics'
import { baseBoton, tamanosBoton, tamanosIcono, variantesBoton } from '@/lib/estilos-boton'

interface FilterChipsProps {
  filters: string[]
  activeFilter: string
  onFilterChange: (filter: string) => void
  /** Traduce la clave del filtro a su etiqueta visible. El valor interno
   *  ("Todo") no cambia entre idiomas para no romper el filtrado. */
  etiqueta?: (filter: string) => string
  /**
   * Icono de cada filtro. Va con `aria-hidden`: la etiqueta de al lado ya
   * dice lo mismo. Un filtro sin icono se dibuja solo con texto.
   */
  icono?: (filter: string) => LucideIcon | undefined
}

export default function FilterChips({
  filters,
  activeFilter,
  onFilterChange,
  etiqueta = (f) => f,
  icono,
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
    // El icono ensancha cada chip unos 22px y eso bastaba para que los cuatro
    // saltaran a dos filas en pantallas de 360px, que es la anchura de buena
    // parte de los Android. Con 8px de separación en móvil vuelven a caber en
    // una: siguen midiendo 36px de alto, muy por encima del área táctil
    // mínima, así que lo que se recorta es aire, no accesibilidad.
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
      {filters.map((filter) => {
        const Icono = icono?.(filter)
        return (
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
            {Icono && <Icono className={tamanosIcono.sm} aria-hidden="true" />}
            {etiqueta(filter)}
          </button>
        )
      })}
    </div>
  )
}

