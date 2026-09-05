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
  // Usados en los datos estructurados (JSON-LD). Se declaran aquí y no se
  // derivan de content/sobre-mi.json porque ahí el orden de la experiencia es
  // cronológico y "el último es el actual" es una suposición que se rompe en
  // silencio. Si cambia el puesto, se actualiza aquí.
  jobTitle: 'Product Design Manager',
  employer: 'kubo.financiero',
  email: 'besprone@gmail.com',
  linkedin: 'https://www.linkedin.com/in/marco-antonio-de-castilla-vicelis-a91863108/',
  github: 'https://github.com/besprone',
} as const

/** Perfiles públicos, para el `sameAs` de los datos estructurados. */
export const socials = [siteConfig.linkedin, siteConfig.github]
