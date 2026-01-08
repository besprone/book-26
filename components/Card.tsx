import { ReactNode } from 'react'
import Link from 'next/link'

interface CardProps {
  children: ReactNode
  href?: string
  className?: string
  hover?: boolean
}

export default function Card({
  children,
  href,
  className = '',
  hover = false,
}: CardProps) {
  const baseStyles = 'bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800'
  const hoverStyles = hover ? 'hover:shadow-lg hover:border-accent-200 dark:hover:border-accent-800 transition-all duration-300' : ''
  
  const classes = `${baseStyles} ${hoverStyles} ${className}`
  
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }
  
  return <div className={classes}>{children}</div>
}

