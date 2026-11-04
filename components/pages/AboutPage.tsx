import { getSobreMiConfig } from '@/lib/markdown'
import type { Locale } from '@/lib/i18n'
import BandaCierre from '@/components/BandaCierre'
import SectionHeader from '@/components/SectionHeader'
import StackEtiquetas from '@/components/StackEtiquetas'
import ScrollDepthTracker from '@/components/ScrollDepthTracker'
import SectionViewTracker from '@/components/SectionViewTracker'
import HeroEscalones from '@/components/sobre-mi/HeroEscalones'
import ListaFormacion from '@/components/sobre-mi/ListaFormacion'
import { Cifras, coloresBandaSitio, Destacado } from '@/components/caso/SeccionesCaso'

export default function AboutPage({ locale }: { locale: Locale }) {
  const config = getSobreMiConfig(locale)
  const { certificaciones, educacion } = config.formacion

  // El número de cursos sale del contenido para que no se quede viejo.
  const cifras = {
    ...config.cifras,
    items: config.cifras.items.map((item) => ({
      ...item,
      valor: item.valor.replace('{cursos}', String(certificaciones.items.length)),
    })),
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <ScrollDepthTracker />
      <HeroEscalones hero={config.hero} experiencia={config.experiencia} />

      <div style={coloresBandaSitio}>
        <Cifras cifras={cifras} tituloOculto />
      </div>

      <Destacado
        sectionName="resumen_profesional"
        destacado={{
          titulo: config.resumenProfesional.title,
          items: config.resumenProfesional.cards.map((card) => ({ titulo: card.title, texto: card.description })),
        }}
      />

      <section className="bg-gray-50 dark:bg-gray-800 pb-12 md:pb-24 relative">
        <SectionViewTracker sectionName="formacion" className="absolute top-0 left-0 w-full h-1" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={config.formacion.title} sectionName="formacion" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8 items-start">
            <ListaFormacion titulo={certificaciones.title} items={certificaciones.items} />
            <ListaFormacion titulo={educacion.title} items={educacion.items} />
          </div>
        </div>
      </section>

      <StackEtiquetas
        title={config.stack.title}
        categories={config.stack.categories.map((category) => ({
          title: category.title,
          items: category.items.map((item) => item.nombre),
        }))}
      />

      <BandaCierre title={config.callToAction.title} buttons={config.callToAction.buttons} />
    </div>
  )
}
