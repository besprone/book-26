import localFont from 'next/font/local'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PostHogProvider from '@/components/PostHogProvider'
import PostHogDebug from '@/components/PostHogDebug'
import { t, type Locale } from '@/lib/i18n'

// Funnel Display se auto-hospeda en vez de usar next/font/google porque no
// existe en el catálogo de fuentes que trae Next 14. Es una fuente variable:
// un solo archivo (subset latin, 17 KB) cubre todo el rango 300-800.
// Licencia OFL en app/fonts/OFL.txt.
const funnelDisplay = localFont({
  src: '../app/fonts/FunnelDisplay-latin.woff2',
  weight: '300 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-funnel-display',
  fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
})

/**
 * Documento completo del sitio, compartido por los dos layouts raíz.
 *
 * Hay un layout raíz por idioma (app/(es) y app/(en)) porque el atributo `lang`
 * de <html> solo puede fijarse ahí, y un `lang` incorrecto hace que un lector
 * de pantalla pronuncie el inglés con fonética española. Todo lo que no cambia
 * entre idiomas vive aquí para no duplicarlo.
 */
export default function SiteShell({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  const txt = t(locale)

  return (
    // suppressHydrationWarning: el script de abajo añade la clase `dark` al
    // <html> antes de que React hidrate, así que el atributo class del cliente
    // no coincide con el del servidor. Es esperado y solo afecta a este nodo.
    <html lang={locale} className={funnelDisplay.variable} suppressHydrationWarning>
      {/*
        eslint-disable-next-line @next/next/no-head-element --
        La regla es del Pages Router, donde había que usar next/head. En App
        Router el <head> del layout raíz es la forma correcta y next/head no
        existe.
      */}
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
            {txt.saltarContenido}
          </a>
          <Navbar locale={locale} />
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
