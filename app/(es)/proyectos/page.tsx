import type { Metadata } from 'next'
import WorkPage from '@/components/pages/WorkPage'
import { metadataPagina } from '@/lib/metadata'

export const metadata: Metadata = metadataPagina({
  locale: 'es',
  clave: 'proyectos',
  title: 'Proyectos',
  description:
    'Casos en los que diseñé, prototipé en código o analicé datos, casi todos en fintech. Filtra por UX, Dev o Data.',
})

export default function Page() {
  return <WorkPage locale="es" />
}
