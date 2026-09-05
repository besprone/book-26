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
    // suppressHydrationWarning: el script de abajo añade la clase `dark` al
    // <html> antes de que React hidrate, así que el atributo class del cliente
    // no coincide con el del servidor. Es esperado y solo afecta a este nodo.
    <html lang="es" className={funnelDisplay.variable} suppressHydrationWarning>
      <head>
        {/*
          Se ejecuta de forma síncrona antes del primer pintado para evitar el
          flash de tema claro al cargar en oscuro. No puede ir en un useEffect:
          para entonces el navegador ya pintó.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var e=document.documentElement;e.classList.toggle('dark',d);e.style.colorScheme=d?'dark':'light';}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans">
        <PostHogProvider>
          {/*
            Salto al contenido: la barra de navegación va antes que el contenido
            en el orden de tabulación, así que sin esto hay que tabular por todo
            el menú en cada página. Solo es visible al recibir foco.
          */}
          <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            Saltar al contenido
          </a>
          <Navbar />
          <main id="contenido" className="min-h-screen">
            {children}
          </main>
          <Footer />
          {/* Widget de debug: se elimina del bundle en producción */}
          {process.env.NODE_ENV === 'development' && <PostHogDebug />}
        </PostHogProvider>
      </body>
    </html>
  )
}

