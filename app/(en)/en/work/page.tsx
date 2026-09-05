import type { Metadata } from 'next'
import WorkPage from '@/components/pages/WorkPage'
import { metadataPagina } from '@/lib/metadata'

export const metadata: Metadata = metadataPagina({
  locale: 'en',
  clave: 'proyectos',
  title: 'Work',
  description:
    'A selection of projects where I combined design, development and analysis to solve real problems. Filter by UX, Dev or Data to explore specific cases.',
})

export default function Page() {
  return <WorkPage locale="en" />
}
