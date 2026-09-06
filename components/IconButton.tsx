'use client'

import { LucideIcon } from 'lucide-react'
import {
  baseBoton,
  tamanosIconButton,
  tamanosIcono,
  variantesBoton,
  type TamanoBoton,
  type VarianteBoton,
} from '@/lib/estilos-boton'

interface IconButtonProps {
  /** Obligatorio: sin texto visible, es la única etiqueta que oye un lector de pantalla. */
  label: string
  icon: LucideIcon
  onClick?: () => void
  variant?: VarianteBoton
  size?: TamanoBoton
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

/**
 * Botón de solo icono, cuadrado.
 *
 * Comparte variantes, tamaños y anillo de foco con Button. Antes cada control
 * de este tipo (abrir menú, cerrarlo) llevaba sus propias clases sueltas.
 *
 * Se añade una variante neutra propia: los iconos de la barra de navegación no
 * deben teñirse del color primario, que está reservado para acciones.
 */
export default function IconButton({
  label,
  icon: Icon,
  onClick,
  variant,
  size = 'md',
  type = 'button',
  className = '',
}: IconButtonProps) {
  const neutro =
    'text-gray-700 hover:bg-gray-100 hover:text-gray-900 ' +
    'dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'

  const classes = [
    baseBoton,
    variant ? variantesBoton[variant] : neutro,
    tamanosIconButton[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} onClick={onClick} aria-label={label} title={label} className={classes}>
      <Icon className={tamanosIcono[size]} aria-hidden="true" />
    </button>
  )
}
