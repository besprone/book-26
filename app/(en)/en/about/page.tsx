import type { Metadata } from 'next'
import AboutPage from '@/components/pages/AboutPage'
import { metadataPagina } from '@/lib/metadata'

export const metadata: Metadata = metadataPagina({
  locale: 'en',
  clave: 'sobreMi',
  title: 'About',
  description:
    'Product & UX Designer with 5+ years designing digital products in fintech. Experience in design systems, UX research, frontend development and data analysis.',
  image: '/hero-sobre-mi.png',
})

export default function Page() {
  return <AboutPage locale="en" />
}
