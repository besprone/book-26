import type { Metadata } from 'next'
import { siteConfig } from './site'
import { rutas, type Locale } from './i18n'

const porIdioma = {
  es: {
    title: siteConfig.title,
    description: siteConfig.description,
    ogLocale: 'es_MX',
  },
  en: {
    title: 'Marco De Castilla - Product & UX Designer',
    description:
      'Product designer with a technical mindset and a data-driven approach. I combine UX, development and analysis to build experiences that are useful, functional and measurable',
    ogLocale: 'en_US',
  },
} as const

/**
 * Metadata del layout raíz de cada idioma. Define la marca, la plantilla de
 * títulos y los valores por defecto de OpenGraph que heredan las páginas que
 * no declaran los suyos.
 */
export function metadataRaiz(locale: Locale): Metadata {
  const d = porIdioma[locale]
  const url = rutas.home[locale]

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: d.title,
      // Las páginas internas definen solo su nombre y se completa con la marca
      template: `%s | ${siteConfig.name}`,
    },
    description: d.description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    alternates: {
      canonical: url,
      languages: {
        'es-MX': rutas.home.es,
        en: rutas.home.en,
        'x-default': rutas.home.es,
      },
    },
    openGraph: {
      type: 'website',
      locale: d.ogLocale,
      url,
      siteName: siteConfig.name,
      title: d.title,
      description: d.description,
      images: [{ url: siteConfig.ogImage, width: 1080, height: 1080, alt: d.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: d.title,
      description: d.description,
      images: [siteConfig.ogImage],
    },
    robots: { index: true, follow: true },
  }
}
