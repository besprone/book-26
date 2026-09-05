/** @type {import('next').NextConfig} */

// Vercel ya envía Strict-Transport-Security, así que no se repite aquí.
// No se define Content-Security-Policy a propósito: el script que aplica el
// tema es inline y PostHog carga desde un host externo, así que una CSP
// correcta necesita nonce y una lista de orígenes revisada. Hacerlo a medias
// rompe la página en silencio, así que merece ser una tarea propia.
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
  images: {
    // AVIF primero: pesa menos que WebP y el navegador elige el que soporte
    formats: ['image/avif', 'image/webp'],
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
