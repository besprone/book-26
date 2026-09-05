import type { Metadata } from 'next'
import ContactPage from '@/components/pages/ContactPage'
import { metadataPagina } from '@/lib/metadata'

export const metadata: Metadata = metadataPagina({
  locale: 'en',
  clave: 'contacto',
  title: 'Contact',
  description:
    'Available for freelance work, consulting and UX advisory. Tell me about your project and I will get back to you soon.',
})

export default function Page() {
  return <ContactPage locale="en" />
}
