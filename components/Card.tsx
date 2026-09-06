import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

/**
 * Contenedor con fondo, borde y radio de tarjeta.
 *
 * Aceptaba un `href` que la convertía en un `<Link>`, pero nadie lo usaba y
 * esa rama no llevaba anillo de foco: habría sido el único control enfocable
 * del sitio sin él, y el fallo lo habría estrenado quien la usara por primera
 * vez sin saberlo. Fuera.
 *
 * Si algún día hace falta una tarjeta clicable, ProjectCard es el ejemplo de
 * cómo se hace: el enlace envuelve el contenido y lleva `anilloFoco`.
 */
export default function Card({ children, className = '', hover = false }: CardProps) {
  const base =
    'bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800'
  const alPasar = hover
    ? 'hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-800 transition-all duration-300'
    : ''

  return <div className={`${base} ${alPasar} ${className}`}>{children}</div>
}
