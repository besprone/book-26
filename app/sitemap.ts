import type { MetadataRoute } from 'next'
import { getAllProyectos } from '@/lib/markdown'
import { siteConfig } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteConfig.url}/proyectos`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteConfig.url}/sobre-mi`, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${siteConfig.url}/contacto`, changeFrequency: 'yearly', priority: 0.5 },
  ]

  const proyectos = getAllProyectos().map((proyecto) => ({
    url: `${siteConfig.url}/proyectos/${proyecto.slug}`,
    // `date` viene del JSON del proyecto; si falta o es inválida se omite
    lastModified: proyecto.date ? new Date(proyecto.date) : undefined,
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }))

  return [...routes, ...proyectos]
}
