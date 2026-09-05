'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ImageWithSkeletonProps {
  src: string
  alt: string
  /** Clases aplicadas a la imagen (object-fit, bordes, transiciones...) */
  className?: string
  /**
   * Ancho y alto intrínsecos. Si se omiten, la imagen usa `fill` y el
   * contenedor padre debe tener `position: relative` y un alto definido.
   */
  width?: number
  height?: number
  /** Pista de tamaño para generar el srcset correcto. */
  sizes?: string
  /** Marcar solo las imágenes visibles sin hacer scroll (mejora el LCP). */
  priority?: boolean
}

/**
 * Envuelve next/image manteniendo el skeleton mientras la imagen carga.
 *
 * El skeleton se desmonta al cargar, no solo se tapa: varias imágenes del
 * sitio son PNG con transparencia y el skeleton se vería a través de ellas.
 *
 * next/image comprueba `img.complete` internamente antes de disparar onLoad,
 * así que también funciona cuando la imagen ya está en caché del navegador.
 */
export default function ImageWithSkeleton({
  src,
  alt,
  className = '',
  width,
  height,
  sizes,
  priority = false,
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center w-full h-full">
        <div className="text-center text-gray-400 dark:text-gray-500 p-4">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs text-gray-500 dark:text-gray-400">Error al cargar imagen</p>
        </div>
      </div>
    )
  }

  const isIntrinsic = typeof width === 'number' && typeof height === 'number'

  return (
    // El wrapper crea el contexto de posicionamiento del skeleton. En modo
    // `fill` ocupa el alto del padre; en modo intrínseco lo define la imagen.
    <div className={`relative ${isIntrinsic ? '' : 'w-full h-full'}`}>
      {/* Skeleton: se desmonta al cargar para no verse tras los PNG transparentes */}
      {isLoading && (
      <div
        className="absolute inset-0 z-0 overflow-hidden bg-gray-300 dark:bg-gray-600 animate-pulse pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 dark:via-gray-300/40 to-transparent animate-shimmer" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-500 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </svg>
        </div>
      </div>
      )}

      {isIntrinsic ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className={`relative z-10 ${className}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`relative z-10 ${className}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
        />
      )}
    </div>
  )
}
