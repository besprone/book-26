'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface NavLinkProps {
  href: string
  children: ReactNode
  onClick?: () => void
  className?: string
  variant?: 'desktop' | 'mobile'
}

export default function NavLink({
  href,
  children,
  onClick,
  className = '',
  variant = 'desktop',
}: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
  
  const baseStyles = 'transition font-medium'
  
  // Estados: normal (gris), hover (blanco), active (primario)
  const getStateClasses = () => {
    if (isActive) {
      // Estado activo: primario
      return variant === 'desktop'
        ? 'text-primary-600 dark:text-primary-400'
        : 'block text-lg text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-4 py-3 rounded-lg'
    }
    // Estado normal: gris, hover: blanco
    return variant === 'desktop'
      ? 'text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-white'
      : 'block text-lg text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-3 rounded-lg'
  }
  
  const classes = `${baseStyles} ${getStateClasses()} ${className}`
  
  return (
    <Link href={href} onClick={onClick} className={classes}>
      {children}
    </Link>
  )
}
