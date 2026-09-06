import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

/**
 * Contenedor con fondo, borde y radio de tarjeta. No es interactivo.
 *
 * Tenía dos añadidos que prometían cosas que no pasaban:
 *
 *   href   La convertía en un `<Link>`, pero nadie lo usaba y esa rama no
 *          llevaba anillo de foco: habría sido el único control enfocable del
 *          sitio sin él, y el fallo lo habría estrenado quien la usara por
 *          primera vez sin saberlo.
 *   hover  Levantaba la sombra y ponía el borde en primario, el color que el
 *          sitio reserva para las acciones. Lo usaban ProfileCard y
 *          EducationCard, que no llevan a ningún sitio: el cursor seguía en
 *          `auto` y no había un solo elemento clicable dentro. Reaccionar al
 *          ratón es una promesa, y ahí no había nada que cumplir.
 *
 * Si algún día hace falta una tarjeta clicable, ProjectCard es el ejemplo:
 * el enlace envuelve el contenido y lleva `anilloFoco`. El hover entonces sí
 * corresponde, porque hay algo al otro lado.
 */
export default function Card({ children, className = '' }: CardProps) {
  const base =
    'bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800'

  return <div className={`${base} ${className}`}>{children}</div>
}
