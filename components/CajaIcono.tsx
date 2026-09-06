import type { LucideIcon } from 'lucide-react'

export type TamanoCaja = 'sm' | 'md' | 'lg'
export type TonoCaja = 'primary' | 'accent'

/**
 * Icono dentro de un cuadro de color.
 *
 * Estaba escrito a mano en cuatro sitios —ProfileCard, las dos variantes de
 * EducationCard y la sección Stack de Inicio y Sobre mí— con tres tamaños de
 * caja, tres de icono y dos radios distintos, sin ninguna regla que los
 * relacionara. Es el mismo problema que ya se arregló con los botones y las
 * etiquetas; éste se había quedado.
 *
 * Dos consecuencias que desaparecen al centralizarlo:
 *
 *   - El tamaño del icono lo decidía quien llamaba, porque estos componentes
 *     recibían un nodo ya renderizado (`<Icon className="w-8 h-8" />`) en vez
 *     del componente. Así no había forma de garantizar que caja e icono
 *     fueran a juego, ni de cambiarlos sin tocar cada página.
 *   - Una de las cajas usaba `rounded-lg`, que según la regla de radios del
 *     sitio es para controles; una caja de icono es un contenedor y le toca
 *     `rounded-xl`.
 */
const cajas: Record<TamanoCaja, string> = {
  sm: 'w-12 h-12',
  md: 'w-14 h-14',
  lg: 'w-16 h-16',
}

/** El icono va a la mitad del lado de la caja: la proporción no se negocia. */
const iconos: Record<TamanoCaja, string> = {
  sm: 'w-6 h-6',
  md: 'w-7 h-7',
  lg: 'w-8 h-8',
}

const tonos: Record<TonoCaja, string> = {
  primary: 'bg-primary-50 text-primary-500 dark:bg-primary-500/15 dark:text-primary-400',
  accent: 'bg-accent-50 text-accent-900 dark:bg-accent-500/15 dark:text-accent-400',
}

interface CajaIconoProps {
  icon: LucideIcon
  tamano?: TamanoCaja
  tono?: TonoCaja
  className?: string
}

export default function CajaIcono({
  icon: Icon,
  tamano = 'lg',
  tono = 'primary',
  className = '',
}: CajaIconoProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl ${cajas[tamano]} ${tonos[tono]} ${className}`}
    >
      <Icon className={iconos[tamano]} aria-hidden="true" />
    </div>
  )
}
