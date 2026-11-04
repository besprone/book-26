import { getSobreMiConfig } from '@/lib/markdown'
import type { Locale } from '@/lib/i18n'
import { ItemMarcado, ListaMarcada } from '@/components/ListaMarcada'
import Button from '@/components/Button'
import Card from '@/components/Card'
import CajaIcono from '@/components/CajaIcono'
import SectionHeader from '@/components/SectionHeader'
import ProfileCard from '@/components/ProfileCard'
import EducationCard from '@/components/EducationCard'
import ScrollDepthTracker from '@/components/ScrollDepthTracker'
import SectionViewTracker from '@/components/SectionViewTracker'
import HeroEscalones from '@/components/sobre-mi/HeroEscalones'
import { Code, Target, Smartphone, Sparkles, BarChart, Palette, Database, Award, Briefcase, PenTool, Users, Lightbulb, TrendingUp, Layers } from 'lucide-react'

// Iconos por posición, alineados con el orden de config.resumenProfesional.cards
const resumenIcons = [Target, Smartphone, BarChart]

// Iconos por posición, alineados con el orden de config.formacion.certificaciones.items
const certificacionIcons = [BarChart, Database, Briefcase, Palette, Users, Lightbulb, TrendingUp, Layers]

// Iconos por posición, alineados con el orden de config.stack.categories
const stackIcons = [Palette, Code, Database, Sparkles]

export default function AboutPage({ locale }: { locale: Locale }) {
  const config = getSobreMiConfig(locale)

  return (
    <div className="bg-white dark:bg-gray-900">
      <ScrollDepthTracker />
      <HeroEscalones hero={config.hero} experiencia={config.experiencia} />

      {/* Resumen Profesional Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-14 md:py-16 relative">
        <SectionViewTracker sectionName="resumen_profesional" className="absolute top-0 left-0 w-full h-1" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={config.resumenProfesional.title} sectionName="resumen_profesional" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.resumenProfesional.cards.map((card, index) => {
              const Icon = resumenIcons[index]
              return (
                <ProfileCard
                  key={index}
                  title={card.title}
                  description={card.description}
                  icon={Icon}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* Formación y Certificaciones Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-14 md:py-16 relative">
        <SectionViewTracker sectionName="formacion" className="absolute top-0 left-0 w-full h-1" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={config.formacion.title} sectionName="formacion" />
          
          {/* Certificaciones */}
          <div className="mb-16">
            <SectionViewTracker sectionName="formacion_certificaciones" className="w-full h-1 mb-6" />
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              {config.formacion.certificaciones.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.formacion.certificaciones.items.map((item, index) => {
                const Icon = certificacionIcons[index]
                return (
                  <EducationCard
                    key={index}
                    nombre={item.nombre}
                    institucion={item.institucion}
                    año={item.año}
                    variant="default"
                    icon={Icon}
                  />
                )
              })}
            </div>
          </div>

          {/* Formación Formal */}
          <div>
            <SectionViewTracker sectionName="formacion_educacion" className="w-full h-1 mb-6" />
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              {config.formacion.educacion.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.formacion.educacion.items.map((item, index) => (
                <EducationCard
                  key={index}
                  nombre={item.nombre}
                  institucion={item.institucion}
                  año={item.año}
                  variant="highlighted"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stack Section */}
      <section className="py-14 md:py-16 relative">
        <SectionViewTracker sectionName="stack" className="absolute top-0 left-0 w-full h-1" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={config.stack.title} sectionName="stack" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.stack.categories.map((category, index) => {
              const Icon = stackIcons[index]
              return (
                <Card key={index} className="p-6">
                  {Icon && <CajaIcono icon={Icon} tamano="lg" tono="accent" className="mb-4" />}
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                  <ListaMarcada>
                    {category.items.map((item) => (
                      <ItemMarcado key={item.nombre} titulo={item.nombre} nivel="h4">
                        <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                          {item.descripcion}
                        </p>
                      </ItemMarcado>
                    ))}
                  </ListaMarcada>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-50 dark:bg-gray-800 pt-20 pb-12 relative">
        <SectionViewTracker sectionName="cta" className="absolute top-0 left-0 w-full h-1" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white">
            {config.callToAction.title}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
