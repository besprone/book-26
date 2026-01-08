export default function ProjectCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
      {/* Imagen skeleton */}
      <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
      
      {/* Contenido skeleton */}
      <div className="p-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-5/6"></div>
        
        {/* Tags skeleton */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        {/* Botón skeleton */}
        <div className="flex justify-end">
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  )
}


