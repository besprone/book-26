import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import '../../globals.css'

const funnelDisplay = localFont({
  src: '../../fonts/FunnelDisplay-latin.woff2',
  weight: '300 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-funnel-display',
  fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
})

export const metadata: Metadata = {
  title: 'Panel · Marco De Castilla',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = { themeColor: '#f2f4f8' }

/**
 * Layout raíz del panel privado. Va aparte del sitio: sin navegación, sin pie
 * y sin PostHog, para que abrir el panel no cuente como visita al portafolio.
 */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={funnelDisplay.variable}>
      <body className="font-sans bg-[#f2f4f8] text-gray-900 antialiased">{children}</body>
    </html>
  )
}
