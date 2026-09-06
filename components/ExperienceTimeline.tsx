import Image from 'next/image'
import Badge from './Badge'
import { CircleDot } from 'lucide-react'
import { t, type Locale } from '@/lib/i18n'

interface ExperienceItem {
  title: string
  company: string
  period: string
  logo?: string
}

interface ExperienceTimelineProps {
  items: ExperienceItem[]
  locale: Locale
}

/**
 * Historial profesional como línea vertical, del puesto más reciente al más
 * antiguo.
 *
 * Antes era un carrusel horizontal. El problema no era el mecanismo sino que
 * escondía contenido: el JSON está en orden cronológico, así que el puesto
 * actual quedaba en la última tarjeta y había que deslizar hasta el final para
 * verlo. Cualquier patrón que oculte elementos entierra justo lo más relevante
 * para quien lee.
 *
 * En vertical todo queda visible sin interacción, se escanea de arriba abajo
 * como un CV, y no hace falta un patrón distinto para móvil y escritorio.
 */
export default function ExperienceTimeline({ items, locale }: ExperienceTimelineProps) {
  // El contenido se edita en orden cronológico (lo natural al añadir un puesto
  // nuevo al final), pero se muestra al revés: lo más reciente primero.
  const cronologiaInversa = [...items].reverse()

  return (
    <ol className="relative">
      {cronologiaInversa.map((item, index) => {
        const esActual = index === 0

        return (
          <li key={`${item.company}-${item.period}`} className="relative flex gap-4 pb-8 last:pb-0 sm:gap-6">
            {/* Columna de la línea: marca y trazo hacia el siguiente puesto */}
            <div className="relative flex flex-col items-center">
              <span
                className={`relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center
                  overflow-hidden rounded-xl border sm:h-14 sm:w-14
                  ${
                    esActual
                      ? 'border-primary-300 bg-white dark:border-primary-700 dark:bg-gray-800'
                      : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                  }`}
              >
                {item.logo ? (
                  <Image
                    src={item.logo}
                    alt={item.company}
                    width={56}
                    height={56}
                    className="h-8 w-8 object-contain sm:h-10 sm:w-10"
                  />
                ) : (
                  <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
                    {item.company.charAt(0).toUpperCase()}
                  </span>
                )}
              </span>

              {/*
                El trazo va del borde inferior de un logo al superior del
                siguiente. `-bottom-8` compensa el pb-8 del <li>: sin eso la
                línea se corta al acabar el contenido y queda un hueco antes
                del siguiente puesto. No se dibuja bajo el último.
              */}
              {index < cronologiaInversa.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-12 -bottom-8 w-px bg-gray-200 dark:bg-gray-700 sm:top-14"
                />
              )}
            </div>

            <div className="min-w-0 flex-1 pt-1 pb-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                {esActual && <Badge variant="estado" size="sm" icon={CircleDot}>
                    {t(locale).experiencia.actual}
                  </Badge>}
              </div>
              <p className="mt-0.5 text-gray-700 dark:text-gray-300">{item.company}</p>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{item.period}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
