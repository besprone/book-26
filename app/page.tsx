import { getAllProyectos, getHomeConfig } from '@/lib/markdown'
import Button from '@/components/Button'
import SectionHeader from '@/components/SectionHeader'
import Card from '@/components/Card'
import ProfileCard from '@/components/ProfileCard'
import ProjectCard from '@/components/ProjectCard'
import { Image as ImageIcon, Code, Briefcase, GraduationCap, Target, Palette, Database } from 'lucide-react'

export default function Home() {
  const config = getHomeConfig()
  const proyectos = getAllProyectos()
  const featuredProyectos = proyectos.slice(0, config.proyectos.featuredCount)

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
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                href={config.hero.buttons.primary.href} 
                variant={config.hero.buttons.primary.variant} 
                size="lg"
              >
                {config.hero.buttons.primary.text}
              </Button>
              <Button 
                href={config.hero.buttons.secondary.href} 
                variant={config.hero.buttons.secondary.variant} 
                size="lg"
              >
                {config.hero.buttons.secondary.text}
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            {/* Placeholder para ilustración - Reemplaza con tu imagen/ilustración */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 flex items-center justify-center h-96 shadow-lg">
              <div className="text-center text-gray-400 dark:text-gray-500">
                <ImageIcon className="w-48 h-48 mx-auto mb-4" />
                <p className="text-sm font-medium">Ilustración placeholder</p>
                <p className="text-xs mt-2">Reemplaza con tu imagen</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perfil Profesional Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={config.perfil.title}
            actionLabel={config.perfil.actionButton.text}
            actionHref={config.perfil.actionButton.href}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.perfil.cards.map((card, index) => {
              // Iconos específicos según el contenido de cada card
              const icons = [
                <Briefcase className="w-8 h-8" />, // +5 años diseñando productos digitales
                <GraduationCap className="w-8 h-8" />, // Formación en desarrollo y análisis de datos
                <Target className="w-8 h-8" />, // Experiencia en fintech, diseño estratégico y sistemas complejos
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

      {/* Proyectos Section */}
      {featuredProyectos.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title={config.proyectos.title}
              actionLabel={config.proyectos.actionButton.text}
              actionHref={config.proyectos.actionButton.href}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProyectos.map((proyecto) => (
                <ProjectCard
                  key={proyecto.slug}
                  title={proyecto.title}
                  description={proyecto.description}
                  image={proyecto.image}
                  technologies={proyecto.technologies}
                  slug={proyecto.slug}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stack Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={config.stack.title}
            actionLabel={config.stack.actionButton.text}
            actionHref={config.stack.actionButton.href}
          />
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
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          {item}
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
      <section className="pt-20 pb-12">
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
