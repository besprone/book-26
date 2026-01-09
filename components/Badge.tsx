interface BadgeProps {
  children: React.ReactNode
  variant?: 'technology' | 'featured' | 'status' | 'default'
  technology?: 'UX' | 'Dev' | 'Data' // Para variant='technology'
  status?: 'active' | 'inactive' // Para variant='status'
  size?: 'sm' | 'md' | 'lg'
  shape?: 'rounded' | 'rounded-full'
  className?: string
}

export default function Badge({
  children,
  variant = 'default',
  technology,
  status = 'inactive',
  size = 'md',
  shape = 'rounded',
  className = '',
}: BadgeProps) {
  // Tamaños
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }

  // Formas
  const shapes = {
    rounded: 'rounded',
    'rounded-full': 'rounded-full',
  }

  // Variantes de color - Todos los badges usan el mismo estilo unificado
  const getVariantClasses = () => {
    // Todos los badges del proyecto usan el mismo estilo: tonos de la paleta accent para mejor contraste y accesibilidad
    // Light mode: fondo claro (accent-50) con texto oscuro (accent-900) para cumplir WCAG AA y mejor legibilidad
    return 'bg-accent-50 text-accent-900 dark:bg-accent-500/15 dark:text-accent-300'
  }

  const baseClasses = 'inline-flex items-center font-medium'
  const variantClasses = getVariantClasses()
  const sizeClasses = sizes[size]
  const shapeClasses = shapes[shape]

  return (
    <span
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${shapeClasses} ${className}`}
    >
      {children}
    </span>
  )
}

