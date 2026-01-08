import Link from 'next/link'
import Button from './Button'
import Badge from './Badge'
import { Image as ImageIcon } from 'lucide-react'

interface FeaturedProjectCardProps {
  title: string
  description: string
  image?: string
  technologies: string[]
  slug: string
}

export default function FeaturedProjectCard({
  title,
  description,
  image,
  technologies,
  slug,
}: FeaturedProjectCardProps) {
  return (
    <div className="mb-12">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Imagen arriba */}
        <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-24 h-24 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Contenido abajo */}
        <div className="p-6 md:p-8 lg:p-10">
          {/* Badge Destacado - Arriba del título */}
          <div className="mb-4">
            <Badge variant="featured" size="md" shape="rounded">
              Destacado
            </Badge>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
            {title}
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed max-w-3xl">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {technologies.map((tech) => (
              <Badge
                key={tech}
                variant="technology"
                technology={tech as 'UX' | 'Dev' | 'Data'}
                size="md"
                shape="rounded"
              >
                {tech}
              </Badge>
            ))}
          </div>
          
          <Link href={`/proyectos/${slug}`}>
            <Button variant="ghost" size="lg">
              Ver caso
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

