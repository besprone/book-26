// Configuración global del sitio, usada por metadata, sitemap y robots.
// La URL puede sobreescribirse con NEXT_PUBLIC_SITE_URL para entornos de preview.

export const siteConfig = {
  name: 'Marco De Castilla',
  title: 'Marco De Castilla - Product & UX Designer',
  description:
    'Diseñador de producto con visión técnica y enfoque en datos. Combino UX, desarrollo y análisis para crear experiencias útiles, funcionales y medibles',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.besprone.com.mx',
  locale: 'es_MX',
  ogImage: '/hero-home.png',
} as const
