'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { analytics } from '@/lib/analytics'
import { rutas } from '@/lib/i18n'
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

  // Los enlaces al inicio ('/' y '/en') solo se marcan en coincidencia exacta:
  // si no, '/en' marcaría todas las rutas en inglés por empezar igual.
  const esInicio = (Object.values(rutas.home) as string[]).includes(href)
  // Para el resto se compara por segmento completo ('/en/work/'), no por
  // prefijo suelto: '/en/work' no debe marcarse estando en '/en/workshop'.
  const esLaPagina = pathname === href
  const esLaSeccion = !esInicio && pathname.startsWith(`${href}/`)
  const isActive = esLaPagina || esLaSeccion

  /**
   * Estar *en* Proyectos y estar *dentro de* un proyecto no son lo mismo, y
   * ARIA distingue las dos cosas: `page` para la página exacta, `true` para la
   * sección que la contiene. Antes no había ninguno de los dos, así que quien
   * navega con lector de pantalla no tenía forma de saber dónde estaba: los
   * cinco enlaces sonaban idénticos.
   */
  const marcaActual = esLaPagina ? 'page' : esLaSeccion ? true : undefined

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
