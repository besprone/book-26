import type { Metadata } from 'next'
import WorkPage from '@/components/pages/WorkPage'
import { metadataPagina } from '@/lib/metadata'

export const metadata: Metadata = metadataPagina({
  locale: 'en',
  clave: 'proyectos',
  title: 'Work',
  description:
    'Cases where I designed, prototyped in code or analysed data, most of them in fintech. Filter by UX, Dev or Data.',
})

export default function Page() {
  return <WorkPage locale="en" />
}
