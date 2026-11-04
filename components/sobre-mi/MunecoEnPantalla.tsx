'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface MunecoEnPantallaProps {
  children: ReactNode
  className?: string
}

/**
 * Avisa al hero cuando el muñeco ya se ve, para que en celular no corra fuera de
 * pantalla. El CSS decide qué hacer con el aviso.
 */
export default function MunecoEnPantalla({ children, className }: MunecoEnPantallaProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    const hero = el?.closest('section')
    if (!el || !hero) return

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        hero.dataset.enVista = 'true'
        observer.disconnect()
      },
      { threshold: 0.6 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {children}
    </div>
  )
}
