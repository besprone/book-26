'use client'

import { useState, useMemo } from 'react'
import type { Proyecto } from '@/lib/types'
import FilterChips from '@/components/FilterChips'
import FeaturedProjectCard from '@/components/FeaturedProjectCard'
import ProjectCard from '@/components/ProjectCard'
import Button from '@/components/Button'
import ScrollDepthTracker from '@/components/ScrollDepthTracker'
import SectionViewTracker from '@/components/SectionViewTracker'
import { analytics } from '@/lib/analytics'
import { t, type Locale } from '@/lib/i18n'

const PROJECTS_PER_PAGE = 6

interface ProyectosClientProps {
  initialProyectos: Proyecto[]
  locale: Locale
}

export default function ProyectosClient({ initialProyectos, locale }: ProyectosClientProps) {
  const txt = t(locale)
  // El valor "Todo" es la clave interna del filtro; solo su etiqueta se traduce
  const [activeFilter, setActiveFilter] = useState('Todo')
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_PAGE)

  const filters = ['Todo', 'UX', 'Dev', 'Data']
  const etiquetaFiltro = (f: string) => (f === 'Todo' ? txt.proyectos.filtroTodo : f)

  // Separar proyecto destacado
  const featuredProject = useMemo(() => {
    return initialProyectos.find(p => p.featured === true)
  }, [initialProyectos])

  // Filtrar proyectos
  const filteredProyectos = useMemo(() => {
    let proyectos = initialProyectos

    if (activeFilter !== 'Todo') {
      proyectos = proyectos.filter(proyecto => {
        return proyecto.type && proyecto.type.includes(activeFilter)
      })
    } else {
      // Si es "Todo", excluir el destacado de la lista (se muestra separado)
      proyectos = proyectos.filter(p => !p.featured)
    }

    return proyectos
  }, [initialProyectos, activeFilter])

  // Proyectos visibles
  const visibleProyectos = filteredProyectos.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProyectos.length

  const handleLoadMore = () => {
    // Los proyectos ya están en memoria: mostrar más es solo ampliar el slice.
    // El tracking del botón se hace automáticamente en Button.tsx
    setVisibleCount((prev) => prev + PROJECTS_PER_PAGE)
  }

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
    // Al cambiar de filtro se vuelve a la primera página de resultados
    setVisibleCount(PROJECTS_PER_PAGE)
    // El tracking del filtro se hace automáticamente en FilterChips.tsx
    // Pero también trackeamos el evento filter_applied para análisis
    const filteredCount = filter === 'Todo'
      ? initialProyectos.filter(p => !p.featured).length
      : initialProyectos.filter(p => p.type && p.type.includes(filter)).length
    analytics.filterApplied(filter, filteredCount)
  }

  if (initialProyectos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-gray-900 dark:text-white leading-tight">
          {txt.proyectos.titulo}
        </h1>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <p className="text-yellow-800 dark:text-yellow-200">
            {txt.proyectos.vacio} <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">content/proyectos/</code>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <ScrollDepthTracker />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <SectionViewTracker sectionName="proyectos" className="absolute top-0 left-0 w-full h-1" />
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
            {txt.proyectos.titulo}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            {txt.proyectos.intro}
          </p>
        </div>

        {/* Filtros */}
        <FilterChips
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          etiqueta={etiquetaFiltro}
        />

        {/* Proyecto Destacado - Solo mostrar si el filtro es "Todo" o si el destacado coincide con el filtro */}
        {featuredProject && 
         (activeFilter === 'Todo' || 
          (featuredProject.type && featuredProject.type.includes(activeFilter))) && (
          <FeaturedProjectCard
            title={featuredProject.title}
            description={featuredProject.description}
            image={featuredProject.image}
            technologies={featuredProject.technologies}
            slug={featuredProject.slug}
            locale={locale}
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
                  locale={locale}
                />
              ))}
            </div>

            {/* Botón Ver más proyectos */}
            {hasMore && (
              <div className="text-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  variant="ghost"
                  size="lg"
                  ctaType="section_cta"
                  sectionName="proyectos"
                >
                  {txt.proyectos.verMas}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {txt.proyectos.sinResultados}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

