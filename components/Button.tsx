'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { analytics, type CTAType } from '@/lib/analytics'
import {
  baseBoton,
  tamanosBoton,
  tamanosIcono,
  variantesBoton,
  type TamanoBoton,
  type VarianteBoton,
} from '@/lib/estilos-boton'

interface ButtonProps {
  children: ReactNode
  href?: string
  variant?: VarianteBoton
  size?: TamanoBoton
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  /** Ocupar todo el ancho disponible (formularios, móvil). */
  fullWidth?: boolean
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  // Props para tracking
  ctaType?: CTAType
  sectionName?: string
  /**
   * Nombre con el que se registra el clic. Por defecto es el texto del botón,
   * pero a veces el texto es genérico ("Ver caso") y lo que interesa medir es
   * a qué se refiere (el nombre del proyecto).
   */
  ctaName?: string
}

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  ctaType,
  sectionName,
  ctaName,
}: ButtonProps) {
  const pathname = usePathname()

  // Handler para trackear clicks en botones
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      const nombre = ctaName || (typeof children === 'string' ? children : 'Button')
      const ctaLocation = pathname || 'unknown'
      const ctaDestination = href || 'unknown'

      // Determinar tipo de CTA si no se proporciona
      const finalCtaType: CTAType = ctaType || (type === 'submit' ? 'form_submit' : 'section_cta')

      analytics.ctaClicked(nombre, finalCtaType, ctaLocation, ctaDestination, sectionName)

      // Si es PDF, también trackear como CV download
      if (href && href.endsWith('.pdf')) {
        analytics.cvDownloaded(ctaLocation)
      }
    }

    if (onClick) {
      onClick()
    }
  }

  const classes = [
    baseBoton,
    variantesBoton[variant],
    tamanosBoton[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const contenido = (
    <>
      {Icon && iconPosition === 'left' && <Icon className={tamanosIcono[size]} aria-hidden="true" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className={tamanosIcono[size]} aria-hidden="true" />}
    </>
  )

  if (href) {
    // Un PDF se abre en pestaña nueva para poder verlo antes de descargarlo
    if (href.endsWith('.pdf')) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          onClick={handleClick}
        >
          {contenido}
        </a>
      )
    }

    return (
      <Link href={href} className={classes} onClick={handleClick}>
        {contenido}
      </Link>
    )
  }

  return (
    <button type={type} onClick={handleClick} disabled={disabled} className={classes}>
      {contenido}
    </button>
  )
}
