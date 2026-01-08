'use client'

import { useState, useMemo } from 'react'
import type { Proyecto } from '@/lib/markdown'
import FilterChips from '@/components/FilterChips'
import FeaturedProjectCard from '@/components/FeaturedProjectCard'
import ProjectCard from '@/components/ProjectCard'
import ProjectCardSkeleton from '@/components/ProjectCardSkeleton'
import Button from '@/components/Button'

const PROJECTS_PER_PAGE = 6

interface ProyectosClientProps {
  initialProyectos: Proyecto[]
}

export default function ProyectosClient({ initialProyectos }: ProyectosClientProps) {
  const [activeFilter, setActiveFilter] = useState('Todo')
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_PAGE)
  const [isLoading, setIsLoading] = useState(false)

  const filters = ['Todo', 'UX', 'Dev', 'Data']

  // Separar proyecto destacado
  const featuredProject = useMemo(() => {
    return initialProyectos.find(p => p.featured === true)
  }, [initialProyectos])

  // Filtrar proyectos (excluyendo el destacado)
  const filteredProyectos = useMemo(() => {
    let proyectos = initialProyectos.filter(p => !p.featured)

    if (activeFilter !== 'Todo') {
      proyectos = proyectos.filter(proyecto => {
        return proyecto.type && proyecto.type.includes(activeFilter)
      })
    }

    return proyectos
  }, [initialProyectos, activeFilter])

  // Proyectos visibles
  const visibleProyectos = filteredProyectos.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProyectos.length

  const handleLoadMore = () => {
    setIsLoading(true)
    // Simular delay de carga
    setTimeout(() => {
      setVisibleCount(prev => prev + PROJECTS_PER_PAGE)
      setIsLoading(false)
    }, 500)
  }

  if (initialProyectos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-gray-900 dark:text-white leading-tight">
          Proyectos
        </h1>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <p className="text-yellow-800 dark:text-yellow-200">
            No hay proyectos aún. Agrega archivos Markdown en la carpeta <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">content/proyectos/</code>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
            Proyectos
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            Una selección de proyectos donde he combinado diseño, desarrollo y análisis para resolver problemas reales. Puedes filtrar por tipo para explorar casos más específicos.
          </p>
        </div>

        {/* Filtros */}
        <FilterChips
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Proyecto Destacado */}
        {featuredProject && activeFilter === 'Todo' && (
          <FeaturedProjectCard
            title={featuredProject.title}
            description={featuredProject.description}
            image={featuredProject.image}
            technologies={featuredProject.technologies}
            slug={featuredProject.slug}
          />
        )}

        {/* Grid de Proyectos */}
        {visibleProyectos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {visibleProyectos.map((proyecto) => (
                <ProjectCard
                  key={proyecto.slug}
                  title={proyecto.title}
                  description={proyecto.description}
                  image={proyecto.image}
                  technologies={proyecto.technologies}
                  slug={proyecto.slug}
                />
              ))}
            </div>

            {/* Skeleton mientras carga */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[...Array(3)].map((_, i) => (
                  <ProjectCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Botón Ver más proyectos */}
            {hasMore && !isLoading && (
              <div className="text-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  variant="ghost"
                  size="lg"
                >
                  Ver más proyectos
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No hay proyectos con el filtro seleccionado.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

