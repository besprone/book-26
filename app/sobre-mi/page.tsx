import { getSobreMiConfig } from '@/lib/markdown'
import Button from '@/components/Button'
import Card from '@/components/Card'
import SectionHeader from '@/components/SectionHeader'
import ProfileCard from '@/components/ProfileCard'
import ExperienceTimeline from '@/components/ExperienceTimeline'
import EducationCard from '@/components/EducationCard'
import { User, Code, Target, Wrench, BarChart, Palette, Database, Award, Briefcase, PenTool, Users, Lightbulb, TrendingUp, Layers } from 'lucide-react'

export default function SobreMi() {
  const config = getSobreMiConfig()

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
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
              variant="solid"
              size="lg"
            >
              {config.hero.cvButton.text}
            </Button>
          </div>
          <div className="hidden lg:block">
            {/* Placeholder para ilustración - Reemplaza con tu imagen/ilustración */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 flex items-center justify-center h-96 shadow-lg">
              <div className="text-center text-gray-400 dark:text-gray-500">
                <User className="w-48 h-48 mx-auto mb-4" />
                <p className="text-sm font-medium">Ilustración placeholder</p>
                <p className="text-xs mt-2">Reemplaza con tu imagen</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resumen Profesional Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={config.resumenProfesional.title} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.resumenProfesional.cards.map((card, index) => {
              // Iconos específicos según el contenido de cada card
              const icons = [
                <Target className="w-8 h-8" />, // Pensamiento estratégico
                <Wrench className="w-8 h-8" />, // Enfoque técnico
                <BarChart className="w-8 h-8" />, // Decisiones con datos
              ]
              return (
                <ProfileCard
                  key={index}
                  title={card.title}
                  description={card.description}
                  icon={icons[index]}
                  iconColor="primary"
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* Experiencia Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={config.experiencia.title} />
          <ExperienceTimeline items={config.experiencia.items} />
        </div>
      </section>

      {/* Formación y Certificaciones Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={config.formacion.title} />
          
          {/* Certificaciones */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              {config.formacion.certificaciones.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.formacion.certificaciones.items.map((item, index) => {
                // Iconos específicos para cada certificación
                const certificationIcons = [
                  <BarChart className="w-6 h-6 text-primary-600 dark:text-primary-400" />, // Data Analytics
                  <Database className="w-6 h-6 text-primary-600 dark:text-primary-400" />, // Introducción a SQL
                  <Briefcase className="w-6 h-6 text-primary-600 dark:text-primary-400" />, // Product Management
                  <Palette className="w-6 h-6 text-primary-600 dark:text-primary-400" />, // Digital Product Design
                  <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />, // User Research
                  <Lightbulb className="w-6 h-6 text-primary-600 dark:text-primary-400" />, // Design Thinking
                  <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />, // Cómo administrar por objetivos
                  <Layers className="w-6 h-6 text-primary-600 dark:text-primary-400" />, // Diseño UI
                ]
                return (
                  <EducationCard
                    key={index}
                    nombre={item.nombre}
                    institucion={item.institucion}
                    año={item.año}
                    variant="default"
                    icon={certificationIcons[index]}
                  />
                )
              })}
            </div>
          </div>

          {/* Formación Formal */}
          <div>
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={config.stack.title} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.stack.categories.map((category, index) => {
              // Iconos específicos según la categoría
              const stackIcons = [
                <Palette className="w-8 h-8 text-accent-600 dark:text-accent-400" />, // Diseño
                <Code className="w-8 h-8 text-accent-600 dark:text-accent-400" />, // Desarrollo
                <Database className="w-8 h-8 text-accent-600 dark:text-accent-400" />, // Datos
              ]
              return (
                <Card key={index} className="p-6">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-accent-500/8 dark:bg-accent-500/15 rounded-xl flex items-center justify-center mb-4">
                      {stackIcons[index]}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="border-l-2 border-accent-500/30 dark:border-accent-500/40 pl-3">
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
      <section className="bg-gray-50 dark:bg-gray-800 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white">
            {config.callToAction.title}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href={config.callToAction.buttons.primary.href}
              variant={config.callToAction.buttons.primary.variant}
              size="lg"
            >
              {config.callToAction.buttons.primary.text}
            </Button>
            <Button
              href={config.callToAction.buttons.secondary.href}
              variant={config.callToAction.buttons.secondary.variant}
              size="lg"
            >
              {config.callToAction.buttons.secondary.text}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
