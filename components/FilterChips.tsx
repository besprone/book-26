'use client'

interface FilterChipsProps {
  filters: string[]
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export default function FilterChips({ filters, activeFilter, onFilterChange }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeFilter === filter
              ? 'bg-primary-500/20 text-primary-700 dark:bg-primary-500/30 dark:text-primary-300'
              : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}

