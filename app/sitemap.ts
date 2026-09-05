import type { MetadataRoute } from 'next'
import { getAllProyectos } from '@/lib/markdown'
import { siteConfig } from '@/lib/site'
import { rutas, rutaProyecto, type ClaveRuta } from '@/lib/i18n'

const abs = (ruta: string) => `${siteConfig.url}${ruta === '/' ? '/' : ruta}`

/** Bloque de idiomas alternativos que acompaña a cada URL del sitemap. */
const alternates = (rutaEs: string, rutaEn: string) => ({
  languages: { 'es-MX': abs(rutaEs), en: abs(rutaEn) },
})

export default function sitemap(): MetadataRoute.Sitemap {
  const prioridades: Record<ClaveRuta, number> = {
    home: 1,
    proyectos: 0.9,
    sobreMi: 0.8,
    contacto: 0.5,
  }
  const frecuencias: Record<ClaveRuta, 'monthly' | 'yearly'> = {
    home: 'monthly',
    proyectos: 'monthly',
    sobreMi: 'yearly',
    contacto: 'yearly',
  }

  // Cada página fija aparece dos veces, una por idioma, y ambas se declaran
  // como alternativas la una de la otra.
  const fijas: MetadataRoute.Sitemap = (Object.keys(rutas) as ClaveRuta[]).flatMap((clave) => {
    const es = rutas[clave].es
    const en = rutas[clave].en
    const comun = {
      changeFrequency: frecuencias[clave],
      priority: prioridades[clave],
      alternates: alternates(es, en),
    }
    return [
      { url: abs(es), ...comun },
      { url: abs(en), ...comun },
    ]
  })

  const proyectos: MetadataRoute.Sitemap = getAllProyectos().flatMap((proyecto) => {
    const es = rutaProyecto('es', proyecto.slug)
    const en = rutaProyecto('en', proyecto.slug)
    const comun = {
      // `date` viene del JSON del proyecto; si falta o es inválida se omite
      lastModified: proyecto.date ? new Date(proyecto.date) : undefined,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
      alternates: alternates(es, en),
    }
    return [
      { url: abs(es), ...comun },
      { url: abs(en), ...comun },
    ]
  })

  return [...fijas, ...proyectos]
}
