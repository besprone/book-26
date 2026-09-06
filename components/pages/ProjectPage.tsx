import { getProyectoBySlug } from '@/lib/markdown'
import { siteConfig } from '@/lib/site'
import { notFound } from 'next/navigation'
import { rutas, t, type Locale } from '@/lib/i18n'
import Badge from '@/components/Badge'
import { iconoDeCategoria } from '@/lib/iconos-badge'
import { BloqueMarcado, ItemMarcado, ListaEtiquetas, ListaMarcada, ListaPasos, Paso } from '@/components/ListaMarcada'
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
          
          {/* Metadata de la ficha, en un <dl> porque son pares
              etiqueta/valor y eso es lo que un lector de pantalla anuncia
              como tal. Antes usaba la misma barra de acento que las listas,
              pero en horizontal una barra vertical no lee como marca de ítem
              sino como separador de columnas.

              Los tres datos no valen lo mismo y antes iban al mismo peso:
              cliente y año son contexto, el rol es lo único que dice qué
              hiciste tú. Así que el rol sube a subtítulo de la ficha y los
              otros dos bajan a una línea menor. Ahí las etiquetas se ocultan
              a la vista —"kubo.financiero · 2023" se entiende solo— pero
              siguen en el DOM para quien lo escuche. */}
          {(proyecto.client || proyecto.year || proyecto.role) && (
            <dl className="mb-6">
              {proyecto.role && (
                <div className="mb-3">
                  <dt className="text-xs font-medium uppercase tracking-wider text-accent-700 dark:text-accent-400 mb-1">
                    {txt.miRol}
                  </dt>
                  <dd className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white leading-snug">
                    {proyecto.role}
                  </dd>
                </div>
              )}
              {(proyecto.client || proyecto.year) && (
                <div className="flex flex-wrap items-baseline gap-x-3 text-sm text-gray-600 dark:text-gray-400">
                  {proyecto.client && (
                    <>
                      <dt className="sr-only">{txt.cliente}</dt>
                      <dd>{proyecto.client}</dd>
                    </>
                  )}
                  {proyecto.year && (
                    <>
                      <dt className="sr-only">{txt.anio}</dt>
                      <dd>
                        {/* El punto va dentro del <dd> y no suelto entre
                            pares: dentro de un <dl> sólo caben <dt> y <dd>. */}
                        {proyecto.client && <span aria-hidden="true" className="mr-3">·</span>}
                        {proyecto.year}
                      </dd>
                    </>
                  )}
                </div>
              )}
            </dl>
          )}

          {/* Tags */}
          {proyecto.type && proyecto.type.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">{txt.tags}</span>
              {proyecto.type.map((tech) => (
                <Badge
                  key={tech}
                  variant="categoria"
                  icon={iconoDeCategoria(tech)}
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
              {/* Las fases son una secuencia y el orden importa, así que van
                  numeradas en un <ol>. Se numeran después de filtrar: si un
                  proyecto no tiene fase de datos, la siguiente es la 03 y no
                  hay hueco. */}
              <ListaPasos className="max-w-prose">
                {[
                  [txt.investigacion, proyecto.proceso.investigacion],
                  [txt.diseno, proyecto.proceso.diseno],
                  [txt.desarrollo, proyecto.proceso.desarrollo],
                  [txt.analisisDatos, proyecto.proceso.analisisDatos],
                ]
                  .filter(([, texto]) => texto)
                  .map(([titulo, texto], i) => (
                    <Paso key={titulo} numero={i + 1} titulo={titulo}>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose">
                        {texto}
                      </p>
                    </Paso>
                  ))}
              </ListaPasos>
            </section>
          )}

          {/* Rol y Herramientas.

              El rol de esta sección repetía palabra por palabra el de la
              cabecera en cuatro de los cinco proyectos: se leía "Rol: Líder
              de diseño UI" arriba y otra vez, casi dos mil píxeles más abajo,
              en una columna con su propio encabezado.

              De los dos sitios gana la cabecera: es la ficha de identidad del
              proyecto y es lo primero que ve quien llega. Aquí se descartan
              los valores que ya estén allí; si no queda ninguno, la sección
              se queda sólo con las herramientas, cambia de título y ocupa
              todo el ancho en vez de dejar media columna vacía.

              No se borra el campo porque no siempre sobra: en Predicción de
              Abandono no es el puesto sino cinco aportaciones al proyecto, y
              eso sí aporta. */}
          {proyecto.rolYHerramientas && (() => {
            const rol = (proyecto.rolYHerramientas.rol ?? []).filter(
              (r) => r.trim() !== (proyecto.role ?? '').trim()
            )
            const herramientas = proyecto.rolYHerramientas.herramientas ?? []
            if (rol.length === 0 && herramientas.length === 0) return null

            return (
            <section className="relative">
              <SectionViewTracker sectionName="rol_herramientas" className="absolute top-0 left-0 w-full h-1" />
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                {rol.length > 0 ? txt.rolYHerramientas : txt.herramientas}
              </h2>
              <div className={`grid grid-cols-1 gap-6 ${rol.length > 0 ? 'md:grid-cols-2' : ''}`}>
                {rol.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                      {txt.soloRol}
                    </h3>
                    <ListaEtiquetas items={rol} />
                  </div>
                )}
                {herramientas.length > 0 && (
                  <div>
                    {/* Sin la columna de rol, el h2 de la sección ya dice
                        "Herramientas": repetirlo aquí sobraría. */}
                    {rol.length > 0 && (
                      <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                        {txt.herramientas}
                      </h3>
                    )}
                    <ListaEtiquetas items={herramientas} />
                  </div>
                )}
              </div>
            </section>
            )
          })()}

          {/* Resultados */}
          {proyecto.resultados && proyecto.resultados.length > 0 && (
            <section className="relative">
              <SectionViewTracker sectionName="resultados" className="absolute top-0 left-0 w-full h-1" />
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                {txt.resultados}
              </h2>
              <ListaMarcada>
                {proyecto.resultados.map((resultado) => (
                  <ItemMarcado key={resultado} className="text-lg text-gray-600 dark:text-gray-400">
                    {resultado}
                  </ItemMarcado>
                ))}
              </ListaMarcada>
            </section>
          )}

          {/* Aprendizajes */}
          {proyecto.aprendizajes && (
            <section className="relative">
              <SectionViewTracker sectionName="aprendizajes" className="absolute top-0 left-0 w-full h-1" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                {txt.aprendizajes}
              </h2>
              {/* Un solo párrafo: no es una serie, así que no finge ser lista. */}
              <BloqueMarcado>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose">
                  {proyecto.aprendizajes}
                </p>
              </BloqueMarcado>
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
              variant="secondary" 
              size="lg"
              ctaType="cta_section"
              sectionName="cta"
            >
              {t(locale).noEncontrado.verProyectos}
            </Button>
            <Button 
              href={rutas.contacto[locale]}
              variant="primary" 
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


