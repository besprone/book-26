'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false)
  // El tema real solo se conoce en cliente: lo aplica el script del layout
  // antes de hidratar, así que el primer render siempre parte de "claro".
  const [animado, setAnimado] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))

    // Las animaciones se activan un frame DESPUÉS de colocar el pomo. Si se
    // activaran en el mismo render, el navegador interpretaría el salto a la
    // posición correcta como una transición y al cargar la página en oscuro
    // se vería el pomo deslizarse solo. Comprobado: pasar de transition-none
    // a transition-all junto con el cambio de transform sí dispara la
    // animación.
    const id = requestAnimationFrame(() => setAnimado(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)

    const root = document.documentElement
    root.classList.toggle('dark', next)
    // color-scheme afecta a los controles nativos y a la barra de scroll
    root.style.colorScheme = next ? 'dark' : 'light'

    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch (error) {
      // Modo privado o almacenamiento bloqueado: el tema no persiste,
      // pero el switch sigue funcionando durante la sesión.
    }
  }

  const anim = animado ? 'transition-all duration-300 ease-out' : 'transition-none'

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label="Tema oscuro"
      title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      className={`relative inline-flex h-7 w-[52px] flex-shrink-0 items-center rounded-full border
        border-gray-300 bg-gray-200 dark:border-gray-600 dark:bg-gray-700
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900
        ${anim} ${className}`}
    >
      {/* Pomo deslizante. Recorrido: 52 - 2*2 de padding - 24 de ancho = 24px */}
      <span
        className={`absolute left-0.5 flex h-6 w-6 items-center justify-center rounded-full
          bg-white shadow-sm dark:bg-gray-900
          ${anim} ${isDark ? 'translate-x-6' : 'translate-x-0'}`}
      >
        {/* Los dos iconos se superponen y se cruzan girando, en vez de
            aparecer y desaparecer de golpe */}
        <Sun
          className={`absolute h-3.5 w-3.5 text-amber-500 ${anim}
            ${isDark ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
        />
        <Moon
          className={`absolute h-3.5 w-3.5 text-primary-300 ${anim}
            ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'}`}
        />
      </span>
    </button>
  )
}
