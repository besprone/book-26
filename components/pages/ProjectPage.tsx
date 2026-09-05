import { getProyectoBySlug } from '@/lib/markdown'
import { siteConfig } from '@/lib/site'
import { notFound } from 'next/navigation'
import { rutas, t, type Locale } from '@/lib/i18n'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import ImageWithSkeleton from '@/components/ImageWithSkeleton'
import ScrollDepthTracker from '@/components/ScrollDepthTracker'
import SectionViewTracker from '@/components/SectionViewTracker'
import BackButton from '@/components/BackButton'
import ProjectViewTracker from '@/components/ProjectViewTracker'
import VideoTracker from '@/components/VideoTracker'
import JsonLd from '@/components/JsonLd'
import { Image as ImageIcon } from 'lucide-react'

export default async function ProjectPage({
  slug,
  locale,
}: {
  slug: string
  locale: Locale
}) {
  const proyecto = await getProyectoBySlug(slug, locale)

  if (!proyecto) {
    notFound()
  }

  const txt = t(locale).proyecto

  // Datos estructurados del caso de estudio, para que aparezca como obra
  // propia y no como una página suelta.
  const proyectoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: proyecto.title,
    description: proyecto.description || siteConfig.description,
    url: `${siteConfig.url}/proyectos/${proyecto.slug}`,
    ...(proyecto.image && { image: `${siteConfig.url}${proyecto.image}` }),
    ...(proyecto.date && { dateCreated: proyecto.date }),
    ...(proyecto.technologies.length > 0 && { keywords: proyecto.technologies.join(', ') }),
    author: {
      '@type': 'Person',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <JsonLd data={proyectoJsonLd} />
      <ScrollDepthTracker />
      <ProjectViewTracker
        projectSlug={proyecto.slug}
        projectTitle={proyecto.title}
        projectType={proyecto.type}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
        <SectionViewTracker sectionName="proyecto_detalle" className="absolute top-0 left-0 w-full h-1" />
        {/* Botón Volver */}
        <div className="mb-8">
          <BackButton locale={locale} />
        </div>

        {/* Header: Título y Metadata */}
        <header className="mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-gray-900 dark:text-white leading-tight">
            {proyecto.title || 'Proyecto'}
          </h1>
          
          {/* Metadata con bullets homologados */}
          {(proyecto.client || proyecto.year || proyecto.role) && (
            <div className="flex flex-wrap items-center gap-6 md:gap-8 mb-6 text-sm md:text-base">
              {proyecto.client && (
                <div className="border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-3">
                  <span className="text-gray-600 dark:text-gray-400">{txt.cliente}</span>
                  <span className="font-semibold text-gray-900 dark:text-white ml-1">{proyecto.client}</span>
                </div>
              )}
              {proyecto.year && (
                <div className="border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-3">
                  <span className="text-gray-600 dark:text-gray-400">{txt.anio}</span>
                  <span className="font-semibold text-gray-900 dark:text-white ml-1">{proyecto.year}</span>
                </div>
              )}
              {proyecto.role && (
                <div className="border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-3">
                  <span className="text-gray-600 dark:text-gray-400">{txt.rol}</span>
                  <span className="font-semibold text-gray-900 dark:text-white ml-1">{proyecto.role}</span>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {proyecto.type && proyecto.type.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">{txt.tags}</span>
              {proyecto.type.map((tech) => (
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
          )}
        </header>

        {/* Hero Illustration */}
        {proyecto.image && (
          <div className="mb-16">
            <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
              <ImageWithSkeleton
                src={proyecto.image}
                alt={proyecto.title}
                sizes="(min-width: 1280px) 1216px, 100vw"
                priority
                errorLabel={t(locale).imagen.error}
                className="object-cover rounded-xl"
              />
            </div>
          </div>
        )}

        {/* Contenido Principal */}
        <article className="space-y-12 md:space-y-16">
          {/* Video de YouTube */}
          {proyecto.videoYoutube && (
            <section>
              <div className="w-full max-w-4xl mx-auto">
                <VideoTracker projectSlug={proyecto.slug} videoUrl={proyecto.videoYoutube} />
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    src={`${proyecto.videoYoutube.includes('youtu.be') 
                      ? `https://www.youtube.com/embed/${proyecto.videoYoutube.split('/').pop()?.split('?')[0]}`
                      : proyecto.videoYoutube.includes('youtube.com/watch')
                      ? `https://www.youtube.com/embed/${proyecto.videoYoutube.split('v=')[1]?.split('&')[0]}`
                      : proyecto.videoYoutube.includes('youtube.com/embed')
                      ? proyecto.videoYoutube
                      : `https://www.youtube.com/embed/${proyecto.videoYoutube}`
                    }?enablejsapi=1`}
                    title={txt.videoDe(proyecto.title)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
              </div>
            </section>
          )}

          {/* El Reto */}
          {proyecto.reto && (
            <section className="relative">
              <SectionViewTracker sectionName="reto" className="absolute top-0 left-0 w-full h-1" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                {txt.reto}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose">
                {proyecto.reto}
              </p>
            </section>
          )}

          {/* Proceso */}
          {proyecto.proceso && (
            <section className="relative">
              <SectionViewTracker sectionName="proceso" className="absolute top-0 left-0 w-full h-1" />
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                {txt.proceso}
              </h2>
              <div className="space-y-6 max-w-prose">
                  {proyecto.proceso.investigacion && (
                    <div className="border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-4">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                        {txt.investigacion}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose">
                        {proyecto.proceso.investigacion}
                      </p>
                    </div>
                  )}
                  {proyecto.proceso.diseno && (
                    <div className="border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-4">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                        {txt.diseno}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose">
                        {proyecto.proceso.diseno}
                      </p>
                    </div>
                  )}
                  {proyecto.proceso.desarrollo && (
                    <div className="border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-4">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                        {txt.desarrollo}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose">
                        {proyecto.proceso.desarrollo}
                      </p>
                    </div>
                  )}
                  {proyecto.proceso.analisisDatos && (
                    <div className="border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-4">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                        {txt.analisisDatos}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose">
                        {proyecto.proceso.analisisDatos}
                      </p>
                    </div>
                  )}
              </div>
            </section>
          )}

          {/* Rol y Herramientas */}
          {proyecto.rolYHerramientas && (
            <section className="relative">
              <SectionViewTracker sectionName="rol_herramientas" className="absolute top-0 left-0 w-full h-1" />
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                {txt.rolYHerramientas}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {proyecto.rolYHerramientas.rol && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                      {txt.soloRol}
                    </h3>
                    <div className="space-y-2">
                      {proyecto.rolYHerramientas.rol.map((rolItem, index) => (
                        <div key={index} className="border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-4">
                          <p className="text-gray-600 dark:text-gray-400">{rolItem}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {proyecto.rolYHerramientas.herramientas && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                      {txt.herramientas}
                    </h3>
                    <div className="space-y-2">
                      {proyecto.rolYHerramientas.herramientas.map((herramienta, index) => (
                        <div key={index} className="border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-4">
                          <p className="text-gray-600 dark:text-gray-400">{herramienta}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Resultados */}
          {proyecto.resultados && proyecto.resultados.length > 0 && (
            <section className="relative">
              <SectionViewTracker sectionName="resultados" className="absolute top-0 left-0 w-full h-1" />
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                {txt.resultados}
              </h2>
              <div className="space-y-3">
                {proyecto.resultados.map((resultado, index) => (
                  <div key={index} className="border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-4">
                    <p className="text-lg text-gray-600 dark:text-gray-400">{resultado}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Aprendizajes */}
          {proyecto.aprendizajes && (
            <section className="relative">
              <SectionViewTracker sectionName="aprendizajes" className="absolute top-0 left-0 w-full h-1" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                {txt.aprendizajes}
              </h2>
              <div className="border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-4">
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose">{proyecto.aprendizajes}</p>
              </div>
            </section>
          )}

          {/* Mensaje si no hay contenido */}
          {!proyecto.reto && !proyecto.proceso && !proyecto.rolYHerramientas && !proyecto.resultados && !proyecto.aprendizajes && (
            <section>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {proyecto.description || txt.enDesarrollo}
              </p>
            </section>
          )}
        </article>

        {/* Call to Action */}
        <section className="mt-16 md:mt-20 text-center relative">
          <SectionViewTracker sectionName="cta" className="absolute top-0 left-0 w-full h-1" />
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            {txt.ctaTitulo}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              href={rutas.proyectos[locale]}
              variant="outline" 
              size="lg"
              ctaType="cta_section"
              sectionName="cta"
            >
              {t(locale).noEncontrado.verProyectos}
            </Button>
            <Button 
              href={rutas.contacto[locale]}
              variant="solid" 
              size="lg"
              ctaType="cta_section"
              sectionName="cta"
            >
              {t(locale).nav.contacto}
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}


