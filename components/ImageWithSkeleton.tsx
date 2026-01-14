'use client'

import { useState, useEffect, useRef } from 'react'

interface ImageWithSkeletonProps {
  src: string
  alt: string
  className?: string
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'wide'
  skeletonClassName?: string
}

export default function ImageWithSkeleton({
  src,
  alt,
  className = '',
  aspectRatio = 'landscape',
  skeletonClassName = '',
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Verificar si la imagen ya está cargada (en caché del navegador)
  // Esto se ejecuta cuando el src cambia o cuando el componente se monta
  useEffect(() => {
    const checkImageLoaded = () => {
      if (imgRef.current) {
        if (imgRef.current.complete && imgRef.current.naturalHeight !== 0) {
          setIsLoading(false)
        }
      }
    }

    // Verificar inmediatamente
    checkImageLoaded()

    // También verificar después de un pequeño delay por si acaso
    const timeout = setTimeout(checkImageLoaded, 50)
    
    return () => clearTimeout(timeout)
  }, [src])

  if (hasError) {
    return (
      <div className={`bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400 dark:text-gray-500 p-4">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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

  // Mostrar skeleton solo mientras está cargando
  // El tiempo mínimo solo evita el flash inicial, pero si la imagen ya cargó, mostrarla inmediatamente
  const showSkeleton = isLoading

  return (
    <div className="relative w-full h-full">
      {/* Imagen - siempre renderizada pero con opacidad controlada */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`${className} ${showSkeleton ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200 relative z-0`}
        style={{ width: '100%', height: '100%' }}
        onLoad={(e) => {
          // Verificar que la imagen realmente se cargó
          const img = e.currentTarget
          if (img.complete && img.naturalHeight !== 0) {
            setIsLoading(false)
          }
        }}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
      />
      
      {/* Skeleton - siempre visible cuando showSkeleton es true, encima de la imagen */}
      {showSkeleton && (
        <div 
          className="absolute inset-0 z-10 bg-gray-300 dark:bg-gray-600 animate-pulse pointer-events-none"
          style={{ 
            width: '100%', 
            height: '100%',
            minHeight: '192px' // h-48 = 192px
          }}
        >
          {/* Efecto shimmer */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 dark:via-gray-300/40 to-transparent"
            style={{
              animation: 'shimmer 2s infinite'
            }}
          />
          
          {/* Icono centrado */}
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
    </div>
  )
}
