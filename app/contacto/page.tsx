import { getContactoConfig } from '@/lib/markdown'
import Button from '@/components/Button'
import ContactForm from '@/components/ContactForm'

export default function Contacto() {
  const config = getContactoConfig()

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Sección Principal: Dos Columnas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Columna Izquierda: Texto */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
              {config.hero.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              {config.hero.description}
            </p>
          </div>

          {/* Columna Derecha: Formulario */}
          <div>
            <ContactForm config={config} />
          </div>
        </div>
      </section>

      {/* Sección CTA Media */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            {config.cta.title}
          </h2>
          <Button
            href={config.cta.button.href}
            variant={config.cta.button.variant}
            size="lg"
          >
            {config.cta.button.text}
          </Button>
        </div>
      </section>

      {/* Sección Final: Texto Motivacional */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-center text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          {config.final.text}
        </p>
      </section>
    </div>
  )
}


