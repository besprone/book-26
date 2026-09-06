'use client'

import { useEffect } from 'react'
import Button from '@/components/Button'
import { trackEvent } from '@/lib/analytics'
import { t } from '@/lib/i18n'

/**
 * Límite de error de las rutas. Sin este archivo, cualquier error en cliente
 * muestra la pantalla genérica de Next, sin la marca ni forma de volver.
 */
const txt = t('es').error

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Si no se registra, un error en producción no deja ningún rastro:
    // `digest` es el identificador con el que Next lo agrupa en los logs.
    trackEvent('app_error', {
      error_message: error.message,
      error_digest: error.digest,
    })
  }, [error])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        {txt.titulo}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-prose mx-auto">
        {txt.texto}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={reset} variant="primary" size="lg" ctaType="section_cta" sectionName="error">
          {txt.reintentar}
        </Button>
        <Button href={'/'} variant="secondary" size="lg" ctaType="section_cta" sectionName="error">
          {txt.inicio}
        </Button>
      </div>
    </div>
  )
}
