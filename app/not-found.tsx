import type { Metadata } from 'next'
import Button from '@/components/Button'

export const metadata: Metadata = {
  title: 'Página no encontrada',
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
        Página no encontrada
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-prose mx-auto">
        La página que buscas no existe o cambió de dirección.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {/* Se ofrece también proyectos: si alguien llega desde un enlace roto
            a un caso, es lo que estaba buscando */}
        <Button href="/proyectos" variant="solid" size="lg" ctaType="section_cta" sectionName="404">
          Ver proyectos
        </Button>
        <Button href="/" variant="outline" size="lg" ctaType="section_cta" sectionName="404">
          Volver al inicio
        </Button>
      </div>
    </div>
  )
}
