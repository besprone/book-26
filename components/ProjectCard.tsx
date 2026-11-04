'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Image as ImageIcon } from 'lucide-react'
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
   * chica: columnas estrechas, como la lateral de Home.
   * mediana: las dos columnas de Proyectos.
   * alta: el caso grande de Home.
   * ancha: el destacado de Proyectos, a todo el ancho.
   */
  tamano?: TamanoTarjeta
  /** Sólo se pinta si llega. La usa el destacado de Proyectos, que es su argumento de venta. */
  description?: string
  /** El nivel depende de la página: bajo el h1 en Proyectos, bajo un h2 en Home. */
  nivel?: 'h2' | 'h3'
  /** Para la imagen más grande que se ve al cargar la página. */
  prioridad?: boolean
  /** Color del espacio mientras carga la portada. Es el del caso. */
  colorCarga?: string
}

export type TamanoTarjeta = 'chica' | 'mediana' | 'alta' | 'ancha'

const tamanos: Record<TamanoTarjeta, { imagen: string; titulo: string; sizes: string }> = {
  chica: {
    imagen: 'h-48',
    titulo: 'text-xl leading-snug',
    sizes: '(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw',
  },
  mediana: {
    imagen: 'h-48 md:h-[300px]',
    titulo: 'text-xl md:text-[28px] leading-tight',
    sizes: '(min-width: 768px) 50vw, 100vw',
  },
  alta: {
    imagen: 'h-48 md:h-80 lg:h-[420px]',
    titulo: 'text-xl md:text-[28px] leading-tight',
    sizes: '(min-width: 1024px) 792px, 100vw',
  },
  ancha: {
    imagen: 'h-[300px] lg:h-[420px]',
    titulo: 'text-[28px] leading-tight',
    sizes: '(min-width: 1280px) 1216px, 100vw',
  },
}

/**
 * Tarjeta de proyecto, en sus cuatro tamaños. Es un solo enlace, así que hacer
 * clic en la imagen o en el título lleva a la ficha.
 *
 * Ninguna lleva caja. El borde, el fondo y el padding competían con lo único
 * que importa en un portafolio, que es el trabajo. La jerarquía la da el tamaño.
 *
 * Debajo del título va una línea de contexto con cliente, año y disciplina, los
 * tres datos por los que alguien filtra al hojear.
 */
export default function ProjectCard({
  title,
  image,
  slug,
  locale,
  client,
  year,
  type,
  tamano = 'chica',
  description,
  nivel: Titulo = 'h3',
  prioridad = false,
  colorCarga,
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
  const medida = tamanos[tamano]

  return (
    <Link
      href={rutaProyecto(locale, slug)}
      onClick={handleClick}
      className={`group block rounded-xl ${anilloFoco}`}
    >
      {/* El redondeo y el recorte viven aquí porque ya no hay caja que los
          lleve: la imagen es el borde de la tarjeta. */}
      <div
        className={`bg-gray-100 dark:bg-gray-700 relative overflow-hidden rounded-xl ${medida.imagen}`}
      >
        {image ? (
          <div className="absolute inset-0 w-full h-full">
            <ImageWithSkeleton
              src={image}
              alt={title}
              sizes={medida.sizes}
              priority={prioridad}
              colorCarga={colorCarga}
              errorLabel={t(locale).imagen.error}
              className="object-cover group-hover:scale-105 transition-transform duration-motion-base"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon
              className="text-gray-500 dark:text-gray-400 w-16 h-16"
            />
          </div>
        )}
      </div>

      <Titulo
        className={`mt-5 font-normal text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition ${medida.titulo}`}
      >
        {title}
      </Titulo>

      {contexto.length > 0 && (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{contexto.join(' · ')}</p>
      )}

      {description && (
        <p className="mt-3 text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
          {description}
        </p>
      )}
    </Link>
  )
}
