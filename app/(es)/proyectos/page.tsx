import type { Metadata } from 'next'
import WorkPage from '@/components/pages/WorkPage'
import { metadataPagina } from '@/lib/metadata'

export const metadata: Metadata = metadataPagina({
  locale: 'es',
  clave: 'proyectos',
  title: 'Proyectos',
  description:
    'Una selección de proyectos donde he combinado diseño, desarrollo y análisis para resolver problemas reales. Filtra por UX, Dev o Data para explorar casos más específicos.',
})

export default function Page() {
  return <WorkPage locale="es" />
}
