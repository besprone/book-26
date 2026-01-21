'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from './Button'
import Badge from './Badge'
import { Image as ImageIcon } from 'lucide-react'
import { analytics } from '@/lib/analytics'

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
  const pathname = usePathname()
  
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      const ctaLocation = pathname || 'unknown'
      const ctaDestination = `/proyectos/${slug}`
      
      // Usar cta_clicked homologado con el resto del sistema
      analytics.ctaClicked(
        title, // cta_name: nombre del proyecto
        'section_cta', // cta_type
        ctaLocation,
        ctaDestination,
        'proyectos' // section_name
      )
    }
  }

  return (
    <div className="mb-12">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300">
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
              <ImageIcon className="w-24 h-24 text-gray-500 dark:text-gray-400" />
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
          
          <Link 
            href={`/proyectos/${slug}`}
            onClick={handleClick}
            className="inline-block"
          >
            <span className="font-medium transition rounded-lg inline-flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 px-8 py-3 text-base">
              Ver caso
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

