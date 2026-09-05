import type { Metadata } from 'next'
import Button from '@/components/Button'
import { t } from '@/lib/i18n'

const txt = t('en').noEncontrado

export const metadata: Metadata = {
  title: txt.titulo,
  // Una 404 no debe indexarse ni repartir autoridad de enlace
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <p className="text-6xl md:text-7xl font-bold mb-4 text-primary-500 dark:text-primary-400">
        404
      </p>
      <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
        {txt.titulo}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-prose mx-auto">
        {txt.texto}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {/* Se ofrece también proyectos: si alguien llega desde un enlace roto
            a un caso, es lo que estaba buscando */}
        <Button href="/en/work" variant="solid" size="lg" ctaType="section_cta" sectionName="404">
          {txt.verProyectos}
        </Button>
        <Button href="/en" variant="outline" size="lg" ctaType="section_cta" sectionName="404">
          {txt.inicio}
        </Button>
      </div>
    </div>
  )
}
