import Badge, { type VarianteBadge } from './Badge'

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
