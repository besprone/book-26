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
  return (
    <div className="relative">
      {/* Scroll horizontal container */}
      <div className="overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="relative min-w-max md:min-w-0">
          {/* Cards de experiencia - scroll horizontal */}
          <div className="flex gap-6 lg:gap-8 relative z-10" style={{ minWidth: 'max-content' }}>
            {items.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-60 lg:w-64 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300"
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
                  <p className="text-gray-500 dark:text-gray-500 text-xs font-medium">
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
        <p className="text-xs text-gray-500 dark:text-gray-400">
          ← Desliza para ver más →
        </p>
      </div>
    </div>
  )
}
