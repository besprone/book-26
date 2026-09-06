'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Image as ImageIcon, Star } from 'lucide-react'
import Badge from './Badge'
import ImageWithSkeleton from './ImageWithSkeleton'
import { analytics } from '@/lib/analytics'
import { rutaProyecto, t, type Locale } from '@/lib/i18n'
import { anilloFoco } from '@/lib/estilos-boton'

interface ProjectCardProps {
  title: string
  image?: string
  slug: string
  locale: Locale
  /** Cliente, año y disciplina: la línea de contexto bajo el título. */
  client?: string
  year?: string
  type?: string[]
  /**
   * La versión grande que encabeza la lista. Crece la imagen y el título,
   * añade la etiqueta "Destacado" y deja sitio a la descripción, que en la
   * rejilla sobra pero aquí es el argumento de venta del proyecto.
   */
  destacado?: boolean
  /** Sólo se pinta en la versión destacada. */
  description?: string
}

/**
 * Tarjeta de proyecto, en sus dos tamaños.
 *
 * Antes eran dos componentes, y no sólo se veían distintos:
 *
 *   - La destacada era un `<div>` con un botón dentro, así que de toda la
 *     tarjeta más grande de la página sólo el botón llevaba a la ficha: hacer
 *     clic en la imagen o en el título no hacía nada.
 *   - Usaba `next/image` en crudo, sin skeleton ni estado de error, siendo la
 *     imagen más pesada del sitio y por tanto la que más lo necesitaba.
 *
 * Ahora las dos son el mismo enlace y comparten el mismo manejo de imagen.
 *
 * Ninguna lleva caja. El borde, el fondo y el padding eran cromo que competía
 * con lo único que importa en un portafolio, que es el trabajo; sin ellos la
 * imagen manda y a igual altura se ve más grande. La jerarquía de la
 * destacada la dan su tamaño y la etiqueta, no un marco.
 *
 * En la rejilla no hay descripción: eran dos líneas recortadas con puntos
 * suspensivos que nadie lee. En su lugar va una línea de contexto —cliente ·
 * año · disciplina— que son los tres datos por los que alguien filtra al
 * hojear.
 */
export default function ProjectCard({
  title,
  image,
  slug,
  locale,
  client,
  year,
  type,
  destacado = false,
  description,
}: ProjectCardProps) {
  const pathname = usePathname()

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      const ctaLocation = pathname || 'unknown'
      const ctaDestination = rutaProyecto(locale, slug)

      // Usar cta_clicked homologado con el resto del sistema
      analytics.ctaClicked(
        title, // cta_name: nombre del proyecto
        'section_cta', // cta_type
        ctaLocation,
        ctaDestination,
        'proyectos' // section_name
      )
    }
  }

  const contexto = [client, year, type?.join(', ')].filter(Boolean)
  const Titulo = destacado ? 'h2' : 'h3'

  return (
    <Link
      href={rutaProyecto(locale, slug)}
      onClick={handleClick}
      className={`group block rounded-xl ${anilloFoco}`}
    >
      {/* El redondeo y el recorte viven aquí porque ya no hay caja que los
          lleve: la imagen es el borde de la tarjeta. */}
      <div
        className={`bg-gray-100 dark:bg-gray-700 relative overflow-hidden rounded-xl ${
          destacado ? 'h-64 md:h-80 lg:h-96' : 'h-48'
        }`}
      >
        {image ? (
          <div className="absolute inset-0 w-full h-full">
            <ImageWithSkeleton
              src={image}
              alt={title}
              sizes={
                destacado
                  ? '(min-width: 1280px) 1216px, 100vw'
                  : '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'
              }
              priority={destacado}
              errorLabel={t(locale).imagen.error}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon
              className={`text-gray-500 dark:text-gray-400 ${destacado ? 'w-24 h-24' : 'w-16 h-16'}`}
            />
          </div>
        )}
      </div>

      {destacado && (
        <div className="mt-5">
          <Badge variant="estado" icon={Star}>
            {t(locale).proyectos.destacado}
          </Badge>
        </div>
      )}

      <Titulo
        className={`font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition ${
          destacado ? 'mt-3 text-2xl md:text-3xl leading-tight' : 'mt-4 text-lg'
        }`}
      >
        {title}
      </Titulo>

      {contexto.length > 0 && (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{contexto.join(' · ')}</p>
      )}

      {destacado && description && (
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
          {description}
        </p>
      )}
    </Link>
  )
}
