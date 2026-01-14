import Link from 'next/link'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  href?: string
  variant?: 'ghost' | 'solid' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export default function Button({
  children,
  href,
  variant = 'solid',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
}: ButtonProps) {
  const baseStyles = 'font-medium transition rounded-lg inline-flex items-center justify-center'
  
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
  
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`
  
  if (href) {
    // Si es un PDF, abrir en nueva pestaña para que el usuario pueda verlo y decidir descargarlo
    const isPDF = href.endsWith('.pdf')
    
    if (isPDF) {
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={classes}
        >
          {children}
        </a>
      )
    }
    
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }
  
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}


