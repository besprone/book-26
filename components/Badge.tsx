import type { LucideIcon } from 'lucide-react'

export type VarianteBadge = 'categoria' | 'metadato' | 'estado'
export type TamanoBadge = 'sm' | 'md'

interface BadgeProps {
  children: React.ReactNode
  variant?: VarianteBadge
  size?: TamanoBadge
  /**
   * Icono opcional a la izquierda del texto. Es un prop y no algo derivado de
   * la variante a propósito: el icono depende de *qué dice* la etiqueta, no
   * del color con el que se pinta. Para las disciplinas hay un mapa en
   * `lib/iconos-badge`.
   *
   * Va con `aria-hidden`: el texto de al lado ya dice lo mismo y un lector de
   * pantalla no debe oírlo dos veces.
   */
  icon?: LucideIcon
  className?: string
}

/**
 * Etiqueta informativa. No es interactiva: para algo pulsable van Button o
 * IconButton.
 *
 * Las variantes se agrupan por lo que la etiqueta comunica, no por dónde
 * aparece:
 *
 *   categoria  Clasifica: disciplina (UX, Dev, Data) o tecnología usada.
 *   metadato   Dato de contexto sin énfasis: un año, un periodo.
 *   estado     Algo vigente o destacado que debe atraer la vista, como el
 *              puesto actual o el proyecto destacado. Usa el color primario,
 *              reservado para lo que reclama atención.
 *
 * La versión anterior declaraba cuatro variantes más props `technology` y
 * `status`, pero las ignoraba todas y devolvía siempre el mismo estilo: la API
 * prometía una diferenciación que no existía.
 *
 * Todas son `rounded-full`, que es lo que las distingue de un botón
 * (`rounded-lg`) según la regla de radios del sitio.
 */
export default function Badge({
  children,
  variant = 'categoria',
  size = 'md',
  icon: Icon,
  className = '',
}: BadgeProps) {
  const variantes: Record<VarianteBadge, string> = {
    categoria: 'bg-accent-50 text-accent-900 dark:bg-accent-500/15 dark:text-accent-300',
    metadato: 'bg-gray-100 text-gray-700 dark:bg-gray-700/60 dark:text-gray-300',
    estado: 'bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300',
  }

  // Con icono se recorta el padding izquierdo: un icono ocupa menos ancho
  // óptico que una letra y, con el mismo padding a los dos lados, la píldora
  // se ve descentrada hacia la derecha.
  const tamanos: Record<TamanoBadge, { con: string; sin: string }> = {
    sm: { sin: 'text-xs px-2 py-0.5 gap-1', con: 'text-xs pl-1.5 pr-2 py-0.5 gap-1' },
    md: { sin: 'text-xs px-2.5 py-1 gap-1.5', con: 'text-xs pl-2 pr-2.5 py-1 gap-1.5' },
  }

  const tamanosIcono: Record<TamanoBadge, string> = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
  }

  const espaciado = Icon ? tamanos[size].con : tamanos[size].sin

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantes[variant]} ${espaciado} ${className}`}
    >
      {Icon && <Icon className={`${tamanosIcono[size]} shrink-0`} aria-hidden="true" />}
      {children}
    </span>
  )
}
