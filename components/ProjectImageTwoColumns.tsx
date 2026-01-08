interface ProjectImageTwoColumnsProps {
  children: React.ReactNode
  imageSrc?: string
  imageAlt?: string
}

export default function ProjectImageTwoColumns({ 
  children, 
  imageSrc, 
  imageAlt = 'Imagen del proceso' 
}: ProjectImageTwoColumnsProps) {
  if (!imageSrc) {
    // Si no hay imagen, renderizar solo el contenido sin layout de dos columnas
    return <>{children}</>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Contenido (texto) - izquierda */}
      <div className="order-2 lg:order-1">
        {children}
      </div>
      
      {/* Imagen - derecha */}
      <div className="order-1 lg:order-2">
        <div className="w-full h-48 md:h-64 lg:h-80 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center sticky top-8">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

