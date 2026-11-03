import type { Metadata } from 'next'
import ContactPage from '@/components/pages/ContactPage'
import { metadataPagina } from '@/lib/metadata'

export const metadata: Metadata = metadataPagina({
  locale: 'en',
  clave: 'contacto',
  title: 'Contact',
  description:
    'Looking for a product design leadership role and open to selected consulting work. Tell me about your team or project and I will get back to you soon.',
})

export default function Page() {
  return <ContactPage locale="en" />
}
