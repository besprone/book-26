import type { Metadata } from 'next'
import ContactPage from '@/components/pages/ContactPage'
import { metadataPagina } from '@/lib/metadata'

export const metadata: Metadata = metadataPagina({
  locale: 'es',
  clave: 'contacto',
  title: 'Contacto',
  description:
    'Disponible para colaboraciones freelance, consultorías y asesorías UX. Cuéntame sobre tu proyecto y te respondo pronto.',
})

export default function Page() {
  return <ContactPage locale="es" />
}
