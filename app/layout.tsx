import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PostHogProvider from '@/components/PostHogProvider'
import PostHogDebug from '@/components/PostHogDebug'
import { siteConfig } from '@/lib/site'

// Funnel Display se auto-hospeda en vez de usar next/font/google porque no
// existe en el catálogo de fuentes que trae Next 14. Es una fuente variable:
// un solo archivo (subset latin, 17 KB) cubre todo el rango 300-800.
// Licencia OFL en app/fonts/OFL.txt.
const funnelDisplay = localFont({
  src: './fonts/FunnelDisplay-latin.woff2',
  weight: '300 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-funnel-display',
  fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    // Las páginas internas definen solo su nombre y se completa con la marca
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: '/',
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1080,
        height: 1080,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={funnelDisplay.variable}>
      <body className="font-sans">
        <PostHogProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <PostHogDebug />
        </PostHogProvider>
      </body>
    </html>
  )
}

