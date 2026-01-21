'use client'

import { usePathname } from 'next/navigation'
import { analytics } from '@/lib/analytics'

interface FilterChipsProps {
  filters: string[]
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export default function FilterChips({ filters, activeFilter, onFilterChange }: FilterChipsProps) {
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
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeFilter === filter
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/30 dark:text-primary-300'
              : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-gray-200 dark:border-gray-700'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}

