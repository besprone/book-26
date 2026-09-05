import type { Metadata } from 'next'
import AboutPage from '@/components/pages/AboutPage'
import { metadataPagina } from '@/lib/metadata'

export const metadata: Metadata = metadataPagina({
  locale: 'es',
  clave: 'sobreMi',
  title: 'Sobre mí',
  description:
    'Product & UX Designer con +5 años diseñando productos digitales en fintech. Experiencia en sistemas de diseño, investigación UX, desarrollo frontend y análisis de datos.',
  image: '/hero-sobre-mi.png',
})

export default function Page() {
  return <AboutPage locale="es" />
}
