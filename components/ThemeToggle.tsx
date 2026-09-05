'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false)
  // El tema real solo se conoce en cliente (lo aplica el script del layout
  // antes de hidratar). Hasta montar no se pinta icono, para que el HTML del
  // servidor y el del cliente coincidan.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.classList.contains('dark'))
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
      // pero el toggle sigue funcionando durante la sesión.
    }
  }

  return (
    <button
      onClick={toggle}
      className={`text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
      aria-label={mounted && isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      {mounted ? (
        isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
      ) : (
        // Reserva el espacio para que no salte el layout al montar
        <span className="block w-5 h-5" />
      )}
    </button>
  )
}
