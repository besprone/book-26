/** @type {import('next').NextConfig} */

// Vercel ya envía Strict-Transport-Security, así que no se repite aquí.
// No se define Content-Security-Policy a propósito: el script que aplica el
// tema es inline, así que una CSP correcta necesita nonce y una lista de
// orígenes revisada. Hacerlo a medias rompe la página en silencio, así que
// merece ser una tarea propia.
const securityHeaders = [
  {
    // Impide que el navegador adivine el tipo de un archivo ignorando su
    // Content-Type, que es como se convierte una subida en un script.
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // Al salir del sitio se envía solo el origen, no la URL completa.
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Evita que el sitio se embeba en un iframe ajeno (clickjacking).
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    // El portafolio no usa ninguna de estas APIs; se deniegan explícitamente.
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
]

const nextConfig = {
  reactStrictMode: true,
  // Oculta la cabecera x-powered-by, que solo sirve para anunciar el stack
  poweredByHeader: false,
  // PostHog llama a rutas con barra final (/e/, /flags/). Sin esto, Next las
  // redirige antes de que lleguen a los rewrites de abajo.
  skipTrailingSlashRedirect: true,
  images: {
    // AVIF primero: pesa menos que WebP y el navegador elige el que soporte
    formats: ['image/avif', 'image/webp'],
    // Miniaturas de los videos, que se muestran antes de cargar el reproductor.
    remotePatterns: [{ protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' }],
  },
  // Slugs renombrados: la URL anterior sigue funcionando para no perder
  // enlaces ni indexación.
  async redirects() {
    return [
      // Sin barra final en todo el sitio, como antes de skipTrailingSlashRedirect.
      {
        source: '/:path((?!vista(?:/|$)).+)/',
        destination: '/:path',
        permanent: true,
      },
      {
        source: '/proyectos/toko-solicitud-credito',
        destination: '/proyectos/solicitud-credito-asesores',
        permanent: true,
      },
      {
        source: '/en/work/toko-solicitud-credito',
        destination: '/en/work/solicitud-credito-asesores',
        permanent: true,
      },
    ]
  },
  // La analítica sale por el dominio del sitio: los bloqueadores cortan las
  // llamadas a posthog.com, y con ellas los envíos del formulario. El nombre de
  // la ruta evita a propósito palabras como analytics o ingest, que también
  // aparecen en sus listas.
  async rewrites() {
    return [
      { source: '/vista/static/:path*', destination: 'https://us-assets.i.posthog.com/static/:path*' },
      { source: '/vista/array/:path*', destination: 'https://us-assets.i.posthog.com/array/:path*' },
      { source: '/vista/:path*', destination: 'https://us.i.posthog.com/:path*' },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
