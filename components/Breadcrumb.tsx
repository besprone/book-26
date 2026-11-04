'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { analytics } from '@/lib/analytics'
import { anilloFoco } from '@/lib/estilos-boton'
import { rutas, t, type Locale } from '@/lib/i18n'

/**
 * Migas del caso, arriba de la portada. El enlace no lleva padding lateral
 * para que su flecha caiga en la misma línea que el título y el contenido.
 */
export default function Breadcrumb({ locale, actual }: { locale: Locale; actual: string }) {
  const pathname = usePathname()
  const textos = t(locale)
  const destino = rutas.proyectos[locale]

  return (
    <nav
      aria-label={textos.proyecto.migas}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1"
    >
      <ol className="flex items-center gap-2 text-sm min-w-0">
        <li className="flex-shrink-0">
          <Link
            href={destino}
            onClick={() =>
              analytics.ctaClicked(
                textos.proyecto.volver,
                'section_cta',
                pathname || 'unknown',
                destino,
                'proyecto_detalle'
              )
            }
            className={`inline-flex h-11 items-center gap-2 rounded-lg font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-motion-fast ${anilloFoco}`}
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {textos.nav.proyectos}
          </Link>
        </li>
        <li aria-hidden="true" className="text-gray-500 dark:text-gray-400">
          /
        </li>
        <li aria-current="page" className="truncate text-gray-600 dark:text-gray-400">
          {actual}
        </li>
      </ol>
    </nav>
  )
}
