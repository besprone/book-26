import type { ReactNode } from 'react'
import Badge, { type VarianteBadge } from './Badge'

/**
 * Serie de elementos con una barra de acento a la izquierda.
 *
 * Existía ya, pero copiado a mano en trece sitios entre AboutPage, HomePage y
 * ProjectPage, con tres combinaciones de etiquetas, dos paddings y tres
 * tamaños de texto conviviendo. Una sola ficha de proyecto llegaba a pintar
 * diecinueve barras.
 *
 * El problema de fondo no era la inconsistencia visual sino que eran listas
 * que no eran listas: cada ítem era un `<div>` con un `<p>` dentro, así que un
 * lector de pantalla leía "Figma. FigJam. Storybook…" como párrafos sueltos,
 * sin anunciar cuántos elementos hay ni permitir saltar entre ellos. La barra
 * es justo lo que le dice a quien ve la página que eso es una serie; ese
 * significado estaba en el diseño y no en el marcado.
 *
 * Aquí es un `<ul>` de verdad.
 */

/** Barra de acento y separación del texto. Un solo valor, sin excepciones. */
const marca = 'border-l-2 border-accent-500/50 dark:border-accent-500/40 pl-4'

export type DensidadLista = 'compacta' | 'normal'

const separacion: Record<DensidadLista, string> = {
  compacta: 'space-y-3',
  normal: 'space-y-6',
}

interface ListaMarcadaProps {
  children: ReactNode
  /** `compacta` para series de una línea; `normal` cuando cada ítem es un bloque con título y párrafo. */
  densidad?: DensidadLista
  className?: string
}

export function ListaMarcada({ children, densidad = 'compacta', className = '' }: ListaMarcadaProps) {
  // El `role="list"` es explícito a propósito. Tailwind quita las viñetas con
  // `list-style: none`, y Safari con VoiceOver interpreta eso como que la
  // lista es decorativa y deja de anunciarla: se perdería justo lo que se
  // viene a arreglar aquí. Declararlo lo devuelve.
  return (
    <ul role="list" className={`${separacion[densidad]} ${className}`}>
      {children}
    </ul>
  )
}

interface ItemMarcadoProps {
  children: ReactNode
  /**
   * Título del ítem. Se pinta como encabezado real cuando se pasa `nivel`,
   * para no romper el orden de encabezados de la página.
   */
  titulo?: ReactNode
  nivel?: 'h3' | 'h4'
  className?: string
}

export function ItemMarcado({ children, titulo, nivel, className = '' }: ItemMarcadoProps) {
  const Titulo = nivel ?? 'p'

  return (
    <li className={`${marca} ${className}`}>
      {titulo !== undefined && (
        <Titulo
          className={
            nivel === 'h3'
              ? 'font-semibold text-lg mb-2 text-gray-900 dark:text-white'
              : 'font-semibold text-sm mb-1 text-gray-900 dark:text-white'
          }
        >
          {titulo}
        </Titulo>
      )}
      {children}
    </li>
  )
}

interface ListaEtiquetasProps {
  items: string[]
  variant?: VarianteBadge
  className?: string
}

/**
 * Serie corta que fluye en horizontal, como etiquetas.
 *
 * Para valores de una o dos palabras —herramientas, aportaciones— que con una
 * barra por línea gastaban casi doscientos píxeles de alto para decir seis
 * palabras. Como etiquetas ocupan dos líneas y aprovechan el ancho.
 *
 * Sigue siendo un `<ul>` con `<li>`: cambia cómo se ve, no lo que es.
 */
export function ListaEtiquetas({ items, variant = 'categoria', className = '' }: ListaEtiquetasProps) {
  return (
    <ul role="list" className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <li key={item}>
          <Badge variant={variant}>{item}</Badge>
        </li>
      ))}
    </ul>
  )
}
