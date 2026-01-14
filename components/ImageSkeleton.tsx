interface ImageSkeletonProps {
  className?: string
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'wide'
}

export default function ImageSkeleton({ 
  className = '', 
  aspectRatio = 'landscape' 
}: ImageSkeletonProps) {
  const aspectClasses = {
    square: 'aspect-square',
    landscape: 'aspect-[3/2]',
    portrait: 'aspect-[2/3]',
    wide: 'aspect-[2.4/1]',
  }

  return (
    <div 
      className={`w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse overflow-hidden ${className}`}
      aria-label="Cargando imagen..."
    >
      {/* Efecto de brillo animado */}
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 dark:via-gray-700/50 to-transparent animate-shimmer" />
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-12 h-12 text-gray-300 dark:text-gray-600">
            <svg
              className="animate-pulse"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
