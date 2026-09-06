'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { analytics } from '@/lib/analytics'
import { anilloFoco } from '@/lib/estilos-boton'

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

  /**
   * Un enlace se marca sólo en la página exacta, no en las que cuelgan de
   * ella: dentro de la ficha de un proyecto, "Proyectos" no va marcado.
   *
   * La convención más extendida es la contraria —marcar la sección entera—,
   * y la razón de peso para hacerlo es que si no, dentro de una ficha no
   * queda nada marcado y se pierde la referencia de dónde estás. Aquí eso no
   * pasa: la ficha abre con un "Volver a proyectos" que ya dice de dónde
   * vienes, así que el menú no tiene que hacer ese trabajo y puede decir algo
   * más preciso: "seleccionado" es la página en la que estás.
   *
   * El `aria-current` acompaña a lo que se ve, para que quien oye la página y
   * quien la mira reciban lo mismo. Antes no había ninguno: medido en
   * producción, `null` en los cinco enlaces, así que con un lector de
   * pantalla no había forma de saber en qué página estabas.
   */
  const isActive = pathname === href
  const marcaActual = isActive ? 'page' : undefined

  const baseStyles = `transition font-medium rounded-lg ${anilloFoco}`
  
  // Handler para trackear clicks del menú
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      const ctaName = typeof children === 'string' ? children : 'Menu Item'
      const ctaLocation = pathname || 'unknown'
      
      analytics.ctaClicked(ctaName, 'header_menu', ctaLocation, href)
    }
    
    if (onClick) {
      onClick()
    }
  }
  
  // Estados: normal (gris), hover (blanco), active (primario)
  const getStateClasses = () => {
    if (isActive) {
      // En escritorio el activo se distinguía sólo por el color, que es justo
      // lo que WCAG 1.4.1 pide no hacer: quien no separa bien el morado del
      // gris no ve ninguna diferencia. La subraya una barra en pseudoelemento
      // absoluto, así que no empuja el resto del menú. En móvil ya había un
      // fondo, que cumple lo mismo.
      return variant === 'desktop'
        ? 'relative text-primary-500 dark:text-primary-400 ' +
            'after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:rounded-full after:bg-current'
        : 'block text-lg text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-4 py-3 rounded-lg'
    }
    // Estado normal: gris, hover: primario (light mode) o blanco (dark mode)
    return variant === 'desktop'
      ? 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-white'
      : 'block text-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-white hover:bg-primary-50 dark:hover:bg-primary-900/20 px-4 py-3 rounded-lg'
  }
  
  const classes = `${baseStyles} ${getStateClasses()} ${className}`
  
  return (
    <Link href={href} onClick={handleClick} aria-current={marcaActual} className={classes}>
      {children}
    </Link>
  )
}
