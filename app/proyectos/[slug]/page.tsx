import { getProyectoBySlug, getAllProyectos } from '@/lib/markdown'
import { notFound } from 'next/navigation'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import ProjectImageFullWidth from '@/components/ProjectImageFullWidth'
import ProjectImageTwoColumns from '@/components/ProjectImageTwoColumns'
import { Image as ImageIcon } from 'lucide-react'

export async function generateStaticParams() {
  const proyectos = getAllProyectos()
  return proyectos.map((proyecto) => ({
    slug: proyecto.slug,
  }))
}

export default async function ProyectoDetalle({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string }
}) {
  // Manejar params como Promise (Next.js 14+) o objeto directo
  const resolvedParams = await Promise.resolve(params)
  const proyecto = await getProyectoBySlug(resolvedParams.slug)

  if (!proyecto) {
    notFound()
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
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
                  <span className="text-gray-600 dark:text-gray-400">Cliente/Empresa:</span>
                  <span className="font-semibold text-gray-900 dark:text-white ml-1">{proyecto.client}</span>
                </div>
              )}
              {proyecto.year && (
                <div className="border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-3">
                  <span className="text-gray-600 dark:text-gray-400">Año:</span>
                  <span className="font-semibold text-gray-900 dark:text-white ml-1">{proyecto.year}</span>
                </div>
              )}
              {proyecto.role && (
                <div className="border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-3">
                  <span className="text-gray-600 dark:text-gray-400">Rol:</span>
                  <span className="font-semibold text-gray-900 dark:text-white ml-1">{proyecto.role}</span>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {proyecto.type && proyecto.type.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Tags:</span>
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
            <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={proyecto.image}
                alt={proyecto.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Contenido Principal */}
        <article className="space-y-12 md:space-y-16">
          {/* El Reto */}
          {proyecto.reto && (
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                El reto
              </h2>
              <ProjectImageTwoColumns
                imageSrc={proyecto.images?.afterReto}
                imageAlt={`Imagen relacionada con el reto de ${proyecto.title}`}
              >
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose">
                  {proyecto.reto}
                </p>
              </ProjectImageTwoColumns>
            </section>
          )}

          {/* Proceso */}
          {proyecto.proceso && (
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Proceso
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Bloque de texto (izquierda) */}
                <div className="order-2 lg:order-1 space-y-6">
                  {proyecto.proceso.investigacion && (
                    <div className="border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-4">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                        Investigación
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose">
                        {proyecto.proceso.investigacion}
                      </p>
                    </div>
                  )}
                  {proyecto.proceso.diseno && (
                    <div className="border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-4">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                        Diseño
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose">
                        {proyecto.proceso.diseno}
                      </p>
                    </div>
                  )}
                  {proyecto.proceso.desarrollo && (
                    <div className="border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-4">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                        Desarrollo / Automatización
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose">
                        {proyecto.proceso.desarrollo}
                      </p>
                    </div>
                  )}
                  {proyecto.proceso.analisisDatos && (
                    <div className="border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-4">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                        Análisis de datos
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose">
                        {proyecto.proceso.analisisDatos}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Imagen (derecha) */}
                {proyecto.proceso.investigacionImage && (
                  <div className="order-1 lg:order-2">
                    <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center sticky top-8">
                      <img
                        src={proyecto.proceso.investigacionImage}
                        alt={`Imagen del proceso de investigación - ${proyecto.title}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Rol y Herramientas */}
          {proyecto.rolYHerramientas && (
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Rol y herramientas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {proyecto.rolYHerramientas.rol && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                      Rol
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
                      Herramientas
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
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Resultados
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
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Aprendizajes
              </h2>
              <div className="border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-4">
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose">{proyecto.aprendizajes}</p>
              </div>
            </section>
          )}

          {/* Contenido adicional (markdown) - fallback para proyectos antiguos */}
          {proyecto.content && (!proyecto.reto || proyecto.content.trim().length > 0) && (
            <section>
              <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: proyecto.content }}
              />
            </section>
          )}

          {/* Mensaje si no hay contenido nuevo ni markdown */}
          {!proyecto.reto && !proyecto.proceso && !proyecto.rolYHerramientas && !proyecto.resultados && !proyecto.aprendizajes && (!proyecto.content || proyecto.content.trim().length === 0) && (
            <section>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {proyecto.description || 'Proyecto en desarrollo...'}
              </p>
            </section>
          )}
        </article>

        {/* Call to Action */}
        <section className="mt-16 md:mt-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            ¿Te gustó este proyecto?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/proyectos" variant="outline" size="lg">
              Ver proyectos
            </Button>
            <Button href="/contacto" variant="solid" size="lg">
              Contáctame
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}


