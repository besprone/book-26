/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // AVIF primero: pesa menos que WebP y el navegador elige el que soporte
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig



