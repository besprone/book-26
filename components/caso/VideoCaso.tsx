'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { analytics } from '@/lib/analytics'
import { anilloFoco } from '@/lib/estilos-boton'

interface VideoCasoProps {
  projectSlug: string
  videoUrl: string
  /** Título del reproductor. */
  titulo: string
  /** Texto del botón para lectores de pantalla. */
  etiqueta: string
}

/** Saca el id de las formas de URL de YouTube que se usan en el contenido. */
function idDeYoutube(url: string) {
  if (url.includes('youtu.be')) return url.split('/').pop()?.split('?')[0]
  if (url.includes('youtube.com/watch')) return url.split('v=')[1]?.split('&')[0]
  if (url.includes('youtube.com/embed')) return url.split('/embed/')[1]?.split('?')[0]
  return url
}

/**
 * Video del caso, cargado bajo demanda.
 *
 * El reproductor de YouTube descarga más de 1 MB de JavaScript, más que todo el
 * resto de la página, aunque nadie le dé play. Hasta el clic solo se ve su miniatura.
 */
export default function VideoCaso({ projectSlug, videoUrl, titulo, etiqueta }: VideoCasoProps) {
  const [activo, setActivo] = useState(false)
  const id = idDeYoutube(videoUrl)

  const reproducir = () => {
    analytics.videoPlayed(projectSlug, videoUrl)
    setActivo(true)
  }

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-900">
      {activo ? (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1`}
          title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button
          type="button"
          onClick={reproducir}
          aria-label={etiqueta}
          className={`group absolute inset-0 w-full h-full ${anilloFoco}`}
        >
          <Image
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(min-width: 896px) 896px, 100vw"
            className="object-cover"
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-primary-500 shadow-lg transition-transform duration-motion-base group-hover:scale-110">
              <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" aria-hidden="true" />
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
