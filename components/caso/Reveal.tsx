'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Retraso en milisegundos, para escalonar elementos de un mismo bloque. */
  delay?: number
  className?: string
}

/**
 * Hace aparecer un bloque al entrar a pantalla.
 *
 * El contenido llega visible desde el servidor y solo se oculta aquí, y solo si
 * todavía está abajo del viewport. Así, si el JavaScript falla o la persona
 * pidió menos movimiento, se lee todo igual y lo que ya está en pantalla no
 * parpadea al cargar.
 */
export default function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return

    el.dataset.reveal = 'oculto'
    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        el.dataset.reveal = 'visible'
        observer.disconnect()
      },
      { rootMargin: '0px 0px -8% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-reveal="visible"
      className={className}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  )
}
