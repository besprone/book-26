'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { analytics, type CTAType } from '@/lib/analytics'

interface ButtonProps {
  children: ReactNode
  href?: string
  variant?: 'ghost' | 'solid' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  // Props para tracking
  ctaType?: CTAType
  sectionName?: string
}

export default function Button({
  children,
  href,
  variant = 'solid',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  ctaType,
  sectionName,
}: ButtonProps) {
  const pathname = usePathname()
  const baseStyles = 'font-medium transition rounded-lg inline-flex items-center justify-center gap-2'
  
  // Handler para trackear clicks en botones
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      const ctaName = typeof children === 'string' ? children : 'Button'
      const ctaLocation = pathname || 'unknown'
      const ctaDestination = href || 'unknown'
      
      // Determinar tipo de CTA si no se proporciona
      const finalCtaType: CTAType = ctaType || (type === 'submit' ? 'form_submit' : 'section_cta')
      
      analytics.ctaClicked(ctaName, finalCtaType, ctaLocation, ctaDestination, sectionName)
      
      // Si es PDF, también trackear como CV download
      if (href && href.endsWith('.pdf')) {
        analytics.cvDownloaded(ctaLocation)
      }
    }
    
    if (onClick) {
      onClick()
    }
  }
  
  const variants = {
    ghost: 'text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20',
    solid: 'bg-primary-500 dark:bg-primary-500 text-white hover:bg-primary-600 dark:hover:bg-primary-600',
    outline: 'border-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 hover:border-primary-700 dark:hover:border-primary-300',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-8 py-3 text-base',
  }
  
  // Tamaños de icono según el tamaño del botón
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-5 h-5',
  }
  
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`
  
  // Renderizar icono
  const renderIcon = () => {
    if (!Icon) return null
    return <Icon className={iconSizes[size]} />
  }
  
  // Renderizar contenido con icono
  const renderContent = () => {
    if (!Icon) return children
    
    if (iconPosition === 'left') {
      return (
        <>
          {renderIcon()}
          {children}
        </>
      )
    } else {
      return (
        <>
          {children}
          {renderIcon()}
        </>
      )
    }
  }
  
  if (href) {
    // Si es un PDF, abrir en nueva pestaña para que el usuario pueda verlo y decidir descargarlo
    const isPDF = href.endsWith('.pdf')
    
    if (isPDF) {
      const handlePDFClick = () => {
        handleClick()
      }
      
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={classes}
          onClick={handlePDFClick}
        >
          {renderContent()}
        </a>
      )
    }
    
    return (
      <Link 
        href={href} 
        className={classes}
        onClick={handleClick}
      >
        {renderContent()}
      </Link>
    )
  }
  
  return (
    <button type={type} onClick={handleClick} className={classes}>
      {renderContent()}
    </button>
  )
}


