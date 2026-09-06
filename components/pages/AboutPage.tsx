import { getSobreMiConfig } from '@/lib/markdown'
import { t, type Locale } from '@/lib/i18n'
import Button from '@/components/Button'
import Card from '@/components/Card'
import SectionHeader from '@/components/SectionHeader'
import ProfileCard from '@/components/ProfileCard'
import ExperienceTimeline from '@/components/ExperienceTimeline'
import EducationCard from '@/components/EducationCard'
import ImageWithSkeleton from '@/components/ImageWithSkeleton'
import ScrollDepthTracker from '@/components/ScrollDepthTracker'
import SectionViewTracker from '@/components/SectionViewTracker'
import { User, Code, Target, Wrench, BarChart, Palette, Database, Award, Briefcase, PenTool, Users, Lightbulb, TrendingUp, Layers } from 'lucide-react'

// Iconos por posición, alineados con el orden de config.resumenProfesional.cards
const resumenIcons = [Target, Wrench, BarChart]

// Iconos por posición, alineados con el orden de config.formacion.certificaciones.items
const certificacionIcons = [BarChart, Database, Briefcase, Palette, Users, Lightbulb, TrendingUp, Layers]

// Iconos por posición, alineados con el orden de config.stack.categories
const stackIcons = [Palette, Code, Database]

export default function AboutPage({ locale }: { locale: Locale }) {
  const txt = t(locale)
  const config = getSobreMiConfig(locale)

  return (
    <div className="bg-white dark:bg-gray-900">
      <ScrollDepthTracker />
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
        <SectionViewTracker sectionName="hero" className="absolute top-0 left-0 w-full h-1" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
              {config.hero.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {config.hero.description}
            </p>
            <Button
              href={config.hero.cvButton.href}
              variant="primary"
              size="lg"
              ctaType="cv_download"
              sectionName="hero"
            >
              {config.hero.cvButton.text}
            </Button>
          </div>
          <div className="hidden lg:block">
            {config.hero.image ? (
              <div className="rounded-2xl overflow-hidden">
                <ImageWithSkeleton
                  src={config.hero.image}
                  alt={config.hero.title}
                  width={1080}
                  height={1080}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                  errorLabel={txt.imagen.error}
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 flex items-center justify-center h-96 shadow-lg">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <User className="w-48 h-48 mx-auto mb-4" />
                  <p className="text-sm font-medium">{txt.imagen.placeholder}</p>
                  <p className="text-xs mt-2">Agrega hero.image en content/sobre-mi.json</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Resumen Profesional Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20 relative">
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
                  icon={Icon ? <Icon className="w-8 h-8" /> : undefined}
                  iconColor="primary"
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* Experiencia Section */}
      <section className="py-20 relative">
        <SectionViewTracker sectionName="experiencia" className="absolute top-0 left-0 w-full h-1" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={config.experiencia.title} sectionName="experiencia" />
          <ExperienceTimeline items={config.experiencia.items} locale={locale} />
        </div>
      </section>

      {/* Formación y Certificaciones Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20 relative">
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
                    icon={Icon ? <Icon className="w-6 h-6 text-primary-500 dark:text-primary-400" /> : undefined}
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
      <section className="py-20 relative">
        <SectionViewTracker sectionName="stack" className="absolute top-0 left-0 w-full h-1" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={config.stack.title} sectionName="stack" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.stack.categories.map((category, index) => {
              const Icon = stackIcons[index]
              return (
                <Card key={index} className="p-6">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-accent-50 dark:bg-accent-500/15 rounded-xl flex items-center justify-center mb-4">
                      {Icon && <Icon className="w-8 h-8 text-accent-900 dark:text-accent-400" />}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                          {item.nombre}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                          {item.descripcion}
                        </p>
                      </div>
                    ))}
                  </div>
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
