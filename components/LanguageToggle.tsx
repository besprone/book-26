'use client'

import { usePathname } from 'next/navigation'
import { Languages } from 'lucide-react'
import { rutaEquivalente, t, type Locale } from '@/lib/i18n'
import { analytics } from '@/lib/analytics'
import { baseBoton, tamanosBoton } from '@/lib/estilos-boton'
import { COOKIE_IDIOMA, COOKIE_MAX_AGE } from '@/lib/cookie-idioma'

interface LanguageToggleProps {
  locale: Locale
  className?: string
}

export default function LanguageToggle({ locale, className = '' }: LanguageToggleProps) {
  const pathname = usePathname()
  const destino: Locale = locale === 'es' ? 'en' : 'es'
  // Lleva a la MISMA página en el otro idioma, no al inicio: perder la página
  // que estabas leyendo al cambiar de idioma es el fallo clásico de esto.
  const href = rutaEquivalente(pathname || '/', destino)

  return (
    // Enlace normal, no <Link>: cada idioma tiene su propio layout raíz y
    // Next fuerza una recarga completa al cruzar entre ellos de todas formas.
    <a
      href={href}
      onClick={() => {
        // Deja constancia de la elección para que el middleware deje de
        // detectar: sin esto, elegir español con el navegador en inglés
        // duraría hasta la siguiente página.
        document.cookie = `${COOKIE_IDIOMA}=${destino}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`
        analytics.ctaClicked(destino.toUpperCase(), 'header_menu', pathname || '/', href, 'navbar')
      }}
      aria-label={t(locale).cambiarIdioma}
      className={`${baseBoton} ${tamanosBoton.sm} h-11
        text-gray-700 hover:bg-gray-100 hover:text-gray-900
        dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white ${className}`}
    >
      <Languages className="h-4 w-4" aria-hidden="true" />
      <span>{destino.toUpperCase()}</span>
    </a>
  )
}
