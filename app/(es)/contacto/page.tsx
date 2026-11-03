import type { Metadata } from 'next'
import ContactPage from '@/components/pages/ContactPage'
import { metadataPagina } from '@/lib/metadata'

export const metadata: Metadata = metadataPagina({
  locale: 'es',
  clave: 'contacto',
  title: 'Contacto',
  description:
    'Busco un puesto de liderazgo de diseño de producto y tomo consultorías puntuales. Cuéntame sobre tu equipo o tu proyecto y te respondo pronto.',
})

export default function Page() {
  return <ContactPage locale="es" />
}
