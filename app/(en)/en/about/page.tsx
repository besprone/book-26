import type { Metadata } from 'next'
import AboutPage from '@/components/pages/AboutPage'
import { metadataPagina } from '@/lib/metadata'

export const metadata: Metadata = metadataPagina({
  locale: 'en',
  clave: 'sobreMi',
  title: 'About',
  description:
    'Product Design Manager with 10+ years of experience, in fintech since 2022. Design systems, AI-assisted code prototyping, UX research and data analysis.',
  image: '/hero-sobre-mi.png',
})

export default function Page() {
  return <AboutPage locale="en" />
}
