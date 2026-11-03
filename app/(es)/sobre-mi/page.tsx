import type { Metadata } from 'next'
import AboutPage from '@/components/pages/AboutPage'
import { metadataPagina } from '@/lib/metadata'

export const metadata: Metadata = metadataPagina({
  locale: 'es',
  clave: 'sobreMi',
  title: 'Sobre mí',
  description:
    'Product Design Manager con más de 10 años de experiencia, desde 2022 en fintech. Sistemas de diseño, prototipado en código con IA, investigación UX y análisis de datos.',
  image: '/hero-sobre-mi.png',
})

export default function Page() {
  return <AboutPage locale="es" />
}
