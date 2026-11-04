'use client'

import { useState, useMemo } from 'react'
import type { Proyecto } from '@/lib/types'
import FilterChips from '@/components/FilterChips'
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
  const conteoFiltro = (f: string) =>
    f === 'Todo' ? initialProyectos.length : initialProyectos.filter((p) => p.type?.includes(f)).length

  // Separar proyecto destacado
  const featuredProject = useMemo(() => {
    return initialProyectos.find(p => p.featured === true)
  }, [initialProyectos])

  // La tarjeta destacada es un recurso editorial de la vista por defecto:
  // "empieza por aquí". En cuanto alguien filtra deja de comparar y pasa a
  // buscar, y ahí un héroe repetido estorba en vez de ayudar.
  //
  // Antes se pintaba también al filtrar si el destacado casaba con el filtro,
  // pero la rejilla sólo lo excluía en "Todo": filtrando por Data, que es la
  // única disciplina del proyecto destacado, salía dos veces en la misma
  // pantalla.
  const mostrarDestacado = activeFilter === 'Todo'

  // Filtrar proyectos
  const filteredProyectos = useMemo(() => {
    if (activeFilter !== 'Todo') {
      return initialProyectos.filter(
        (proyecto) => proyecto.type && proyecto.type.includes(activeFilter)
      )
    }
    // En "Todo" el destacado va aparte, así que no se repite en la rejilla.
    return initialProyectos.filter((p) => !p.featured)
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
      <section className="bg-primary-500 text-white relative">
        <SectionViewTracker sectionName="proyectos" className="absolute top-0 left-0 w-full h-1" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 md:pt-[88px] md:pb-[72px]">
          <h1 className="text-[44px] md:text-[72px] font-semibold leading-tight">{txt.proyectos.titulo}</h1>
          <p className="mt-5 md:mt-6 text-xl leading-snug max-w-[50rem]">{txt.proyectos.intro}</p>
          <div className="mt-6">
            <FilterChips
              filters={filters}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              etiqueta={etiquetaFiltro}
              conteo={conteoFiltro}
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 md:pt-[72px] md:pb-24">
        {/* El destacado solo se ve sin filtrar (ver mostrarDestacado). */}
        {featuredProject && mostrarDestacado && (
          <div className="mb-9 md:mb-14">
            <ProjectCard
              tamano="ancha"
              nivel="h2"
              prioridad
              title={featuredProject.title}
              description={featuredProject.description}
              image={featuredProject.image}
              slug={featuredProject.slug}
              locale={locale}
              client={featuredProject.client}
              year={featuredProject.year}
              type={featuredProject.type}
              colorCarga={featuredProject.tema?.bg}
            />
          </div>
        )}

        {visibleProyectos.length > 0 ? (
          <>
            {/* La llave reinicia la aparición cada vez que cambia el filtro. */}
            <div key={activeFilter} className="lista-aparece grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-9 md:gap-y-14">
              {visibleProyectos.map((proyecto) => (
                <ProjectCard
                  key={proyecto.slug}
                  tamano="mediana"
                  nivel="h2"
                  title={proyecto.title}
                  image={proyecto.image}
                  slug={proyecto.slug}
                  locale={locale}
                  client={proyecto.client}
                  year={proyecto.year}
                  type={proyecto.type}
                  colorCarga={proyecto.tema?.bg}
                />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-10">
                <Button
                  onClick={handleLoadMore}
                  variant="tonal"
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
            <p className="text-gray-600 dark:text-gray-400 text-lg">{txt.proyectos.sinResultados}</p>
          </div>
        )}
      </div>
    </div>
  )
}

