export type VarianteBadge = 'categoria' | 'metadato' | 'estado'
export type TamanoBadge = 'sm' | 'md'

interface BadgeProps {
  children: React.ReactNode
  variant?: VarianteBadge
  size?: TamanoBadge
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
  className = '',
}: BadgeProps) {
  const variantes: Record<VarianteBadge, string> = {
    categoria: 'bg-accent-50 text-accent-900 dark:bg-accent-500/15 dark:text-accent-300',
    metadato: 'bg-gray-100 text-gray-700 dark:bg-gray-700/60 dark:text-gray-300',
    estado: 'bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300',
  }

  const tamanos: Record<TamanoBadge, string> = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantes[variant]} ${tamanos[size]} ${className}`}
    >
      {children}
    </span>
  )
}
