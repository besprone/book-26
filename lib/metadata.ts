import type { Metadata } from 'next'
import { siteConfig } from './site'
import { rutas, rutaProyecto, type ClaveRuta, type Locale } from './i18n'

const ogLocale: Record<Locale, string> = { es: 'es_MX', en: 'en_US' }

/**
 * Construye las etiquetas `alternates` de una página.
 *
 * `languages` es lo que genera los hreflang: le dice a Google que las dos URLs
 * son la misma página en distinto idioma, en vez de contenido duplicado.
 * `x-default` marca cuál servir a quien no encaje en ningún idioma declarado.
 */
function alternates(rutaEs: string, rutaEn: string, locale: Locale) {
  return {
    canonical: locale === 'es' ? rutaEs : rutaEn,
    languages: {
      'es-MX': rutaEs,
      en: rutaEn,
      'x-default': rutaEs,
    },
  }
}

interface OpcionesPagina {
  locale: Locale
  clave: ClaveRuta
  title: string
  description: string
  image?: string
  imageAlt?: string
}

/** Metadata de una página fija (home, sobre mí, proyectos, contacto). */
export function metadataPagina({
  locale,
  clave,
  title,
  description,
  image = siteConfig.ogImage,
  imageAlt,
}: OpcionesPagina): Metadata {
  const rutaEs = rutas[clave].es
  const rutaEn = rutas[clave].en
  const url = locale === 'es' ? rutaEs : rutaEn

  return {
    title,
    description,
    alternates: alternates(rutaEs, rutaEn, locale),
    openGraph: {
      type: 'website',
      locale: ogLocale[locale],
      url,
      siteName: siteConfig.name,
      title,
      description,
      // El openGraph de una página reemplaza al del layout en vez de
      // fusionarse, así que la imagen se repite explícitamente.
      images: [{ url: image, alt: imageAlt || title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

interface OpcionesProyecto {
  locale: Locale
  slug: string
  title: string
  description: string
  image?: string
  date?: string
}

/** Metadata del detalle de un proyecto. */
export function metadataProyecto({
  locale,
  slug,
  title,
  description,
  image = siteConfig.ogImage,
  date,
}: OpcionesProyecto): Metadata {
  const rutaEs = rutaProyecto('es', slug)
  const rutaEn = rutaProyecto('en', slug)
  const url = locale === 'es' ? rutaEs : rutaEn

  return {
    title,
    description,
    alternates: alternates(rutaEs, rutaEn, locale),
    openGraph: {
      type: 'article',
      locale: ogLocale[locale],
      url,
      siteName: siteConfig.name,
      title,
      description,
      publishedTime: date || undefined,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}
