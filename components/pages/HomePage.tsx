import { getAllProyectos, getHomeConfig } from '@/lib/markdown'
import type { Locale } from '@/lib/i18n'
import { ListaEtiquetas } from '@/components/ListaMarcada'
import Button from '@/components/Button'
import SectionHeader from '@/components/SectionHeader'
import ProjectCard from '@/components/ProjectCard'
import SectionViewTracker from '@/components/SectionViewTracker'
import ScrollDepthTracker from '@/components/ScrollDepthTracker'
import HeroHome from '@/components/home/HeroHome'
import { Cifras, Proceso } from '@/components/caso/SeccionesCaso'
import JsonLd from '@/components/JsonLd'
import { siteConfig, socials } from '@/lib/site'

// La banda de cifras usa los colores del sitio, los mismos que un caso sin `tema`.
const coloresBanda = {
  '--case-band': '#172130',
  '--case-band-value': '#11ced8',
  '--case-band-text': '#ffffff',
} as React.CSSProperties

export default function HomePage({ locale }: { locale: Locale }) {
  const config = getHomeConfig(locale)
  const proyectos = getAllProyectos(locale)
  const [principal, ...secundarios] = proyectos.slice(0, config.proyectos.featuredCount)

  // El número de casos sale del contenido para que no se quede viejo.
  const cifras = {
    ...config.prueba,
    items: config.prueba.items.map((item) => ({
      ...item,
      valor: item.valor.replace('{casos}', String(proyectos.length)),
    })),
  }

  // Datos estructurados de la persona: ayudan a Google a relacionar el sitio
  // con el perfil profesional y sus cuentas.
  const personaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: siteConfig.jobTitle,
    description: siteConfig.description,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    worksFor: { '@type': 'Organization', name: siteConfig.employer },
    sameAs: socials,
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <JsonLd data={personaJsonLd} />
      <ScrollDepthTracker />
      <HeroHome hero={config.hero} />

      <div style={coloresBanda}>
        <Cifras cifras={cifras} tituloOculto />
      </div>

      {principal && (
        <section className="py-12 md:py-24 relative">
          <SectionViewTracker sectionName="proyectos" className="absolute top-0 left-0 w-full h-1" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title={config.proyectos.title}
              actionLabel={config.proyectos.actionButton.text}
              actionHref={config.proyectos.actionButton.href}
              sectionName="proyectos"
            />
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,792fr)_minmax(0,400fr)] gap-x-6 gap-y-8">
              <ProjectCard
                tamano="alta"
                title={principal.title}
                image={principal.image}
                slug={principal.slug}
                locale={locale}
                client={principal.client}
                year={principal.year}
                type={principal.type}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-x-6 gap-y-8 content-start">
                {secundarios.map((proyecto) => (
                  <ProjectCard
                    key={proyecto.slug}
                    title={proyecto.title}
                    image={proyecto.image}
                    slug={proyecto.slug}
                    locale={locale}
                    client={proyecto.client}
                    year={proyecto.year}
                    type={proyecto.type}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="numeros-sitio bg-gray-50 dark:bg-gray-800">
        <Proceso titulo={config.comoTrabajo.title} fases={config.comoTrabajo.fases} sectionName="como_trabajo" />
      </div>

      <section className="py-12 md:py-24 relative">
        <SectionViewTracker sectionName="stack" className="absolute top-0 left-0 w-full h-1" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={config.stack.title}
            actionLabel={config.stack.actionButton.text}
            actionHref={config.stack.actionButton.href}
            sectionName="stack"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {config.stack.categories.map((category) => (
              <div key={category.title}>
                <h3 className="text-xl font-normal mb-3 text-gray-900 dark:text-white">{category.title}</h3>
                <ListaEtiquetas items={category.items} variant="metadato" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-500 text-white py-12 md:py-24 relative">
        <SectionViewTracker sectionName="cta" className="absolute top-0 left-0 w-full h-1" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[34px] md:text-[56px] font-semibold leading-[1.12] mb-8 text-balance">
            {config.callToAction.title}
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              href={config.callToAction.buttons.primary.href}
              variant={config.callToAction.buttons.primary.variant}
              size="lg"
              ctaType="cta_section"
              sectionName="cta"
            >
              {config.callToAction.buttons.primary.text}
            </Button>
            <Button
              href={config.callToAction.buttons.secondary.href}
              variant={config.callToAction.buttons.secondary.variant}
              size="lg"
              ctaType="cta_section"
              sectionName="cta"
            >
              {config.callToAction.buttons.secondary.text}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
