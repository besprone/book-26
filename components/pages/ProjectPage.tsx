import { getProyectoBySlug } from '@/lib/markdown'
import { siteConfig } from '@/lib/site'
import { notFound } from 'next/navigation'
import { rutas, t, type Locale } from '@/lib/i18n'
import type { Proyecto } from '@/lib/types'
import Badge from '@/components/Badge'
import { iconoDeCategoria } from '@/lib/iconos-badge'
import Button from '@/components/Button'
import ImageWithSkeleton from '@/components/ImageWithSkeleton'
import ScrollDepthTracker from '@/components/ScrollDepthTracker'
import SectionViewTracker from '@/components/SectionViewTracker'
import Breadcrumb from '@/components/Breadcrumb'
import ProjectViewTracker from '@/components/ProjectViewTracker'
import VideoTracker from '@/components/VideoTracker'
import JsonLd from '@/components/JsonLd'
import HeroRutaIngles from '@/components/caso/HeroRutaIngles'
import {
  AprendizajeDestacado,
  Cifras,
  Comparador,
  Destacado,
  Portada,
  Proceso,
  Resultados,
  Reto,
  RolYHerramientas,
} from '@/components/caso/SeccionesCaso'

const TEMA_SITIO: NonNullable<Proyecto['tema']> = {
  bg: '#6244c7',
  ink: '#ffffff',
  accent: '#11ced8',
  band: '#172130',
  bandValue: '#11ced8',
  bandText: '#ffffff',
}

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

  // Los nombres son los mismos en todos los casos y solo cambia el valor. Un
  // caso nuevo sin `tema` toma los colores del sitio.
  const tema = proyecto.tema ?? TEMA_SITIO
  const estiloTema = {
    '--case-bg': tema.bg,
    '--case-ink': tema.ink,
    '--case-accent': tema.accent,
    '--case-band': tema.band,
    '--case-band-value': tema.bandValue,
    '--case-band-text': tema.bandText,
    ...(tema.number && { '--case-number': tema.number }),
  } as React.CSSProperties

  // El rol de la cabecera no se repite en la sección de rol y herramientas. Si
  // no queda ninguno, la sección se queda solo con las herramientas.
  const rol = (proyecto.rolYHerramientas?.rol ?? []).filter((r) => r.trim() !== (proyecto.role ?? '').trim())
  const herramientas = proyecto.rolYHerramientas?.herramientas ?? []

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen overflow-x-clip" style={estiloTema}>
      <JsonLd data={proyectoJsonLd} />
      <ScrollDepthTracker />
      <ProjectViewTracker
        projectSlug={proyecto.slug}
        projectTitle={proyecto.title}
        projectType={proyecto.type}
      />
      {/* El subtítulo de después del punto medio solo cabe en el título grande. */}
      <Breadcrumb locale={locale} actual={proyecto.title.split(' · ')[0]} />
      {proyecto.hero?.tipo === 'ruta-ingles' && (
        <HeroRutaIngles pantalla={proyecto.hero.pantalla} alt={proyecto.hero.alt} />
      )}
      {proyecto.hero?.tipo === 'portada' && <Portada slug={proyecto.slug} alt={proyecto.hero.alt} />}
      {!proyecto.hero && proyecto.image && (
        <div className="relative aspect-[1440/640] w-full">
          <ImageWithSkeleton
            src={proyecto.image}
            alt={proyecto.title}
            sizes="100vw"
            priority
            errorLabel={t(locale).imagen.error}
            className="object-cover"
          />
        </div>
      )}

      <article>
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-24 pb-12 md:pb-20 relative">
          <SectionViewTracker sectionName="proyecto_detalle" className="absolute top-0 left-0 w-full h-1" />
          <h1 className="text-[32px] md:text-[56px] font-semibold leading-[1.12] max-w-[69rem] mb-6 md:mb-8 text-gray-900 dark:text-white">
            {proyecto.title || 'Proyecto'}
          </h1>

          {/* Son pares etiqueta/valor, así que van en un <dl>. Las etiquetas no se
              ven porque el dato se entiende solo, pero un lector de pantalla las
              anuncia. El punto va dentro del <dd>: en un <dl> solo caben <dt> y <dd>. */}
          {(proyecto.client || proyecto.year || proyecto.role) && (
            <dl className="mb-6">
              {proyecto.role && (
                <div className="mb-1.5">
                  <dt className="sr-only">{txt.miRol}</dt>
                  <dd className="text-base md:text-xl text-gray-900 dark:text-white">{proyecto.role}</dd>
                </div>
              )}
              {(proyecto.client || proyecto.year) && (
                <div className="flex flex-wrap items-baseline gap-x-2 text-sm text-gray-600 dark:text-gray-400">
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
                        {proyecto.client && <span aria-hidden="true" className="mr-2">·</span>}
                        {proyecto.year}
                      </dd>
                    </>
                  )}
                </div>
              )}
            </dl>
          )}

          {proyecto.type && proyecto.type.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="sr-only">{txt.tags}</span>
              {proyecto.type.map((tech) => (
                <Badge key={tech} variant="categoria" icon={iconoDeCategoria(tech)}>
                  {tech}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {proyecto.videoYoutube && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-24">
            <div className="w-full max-w-4xl">
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

        {proyecto.reto && <Reto titulo={txt.reto} texto={proyecto.reto} />}
        {proyecto.cifras && <Cifras cifras={proyecto.cifras} />}
        {proyecto.proceso && (
          <Proceso
            titulo={txt.proceso}
            fases={[
              { titulo: txt.investigacion, texto: proyecto.proceso.investigacion },
              { titulo: txt.diseno, texto: proyecto.proceso.diseno },
              { titulo: txt.desarrollo, texto: proyecto.proceso.desarrollo },
              { titulo: txt.analisisDatos, texto: proyecto.proceso.analisisDatos },
            ]}
          />
        )}
        {proyecto.destacado && <Destacado destacado={proyecto.destacado} />}
        {proyecto.comparador && <Comparador comparador={proyecto.comparador} />}
        {(rol.length > 0 || herramientas.length > 0) && (
          <RolYHerramientas
            titulo={rol.length > 0 ? txt.rolYHerramientas : txt.herramientas}
            etiquetaRol={txt.soloRol}
            etiquetaHerramientas={txt.herramientas}
            rol={rol}
            herramientas={herramientas}
          />
        )}
        {proyecto.resultados && proyecto.resultados.length > 0 && (
          <Resultados titulo={txt.resultados} items={proyecto.resultados} />
        )}
        {proyecto.aprendizajes && <AprendizajeDestacado titulo={txt.aprendizajes} texto={proyecto.aprendizajes} />}

        {!proyecto.reto && !proyecto.proceso && !proyecto.rolYHerramientas && !proyecto.resultados && !proyecto.aprendizajes && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {proyecto.description || txt.enDesarrollo}
            </p>
          </section>
        )}
      </article>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 text-center relative">
        <SectionViewTracker sectionName="cta" className="absolute top-0 left-0 w-full h-1" />
        <h2 className="text-[28px] md:text-[40px] font-normal leading-tight mb-8 text-gray-900 dark:text-white">
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
  )
}


