import type { Metadata } from 'next'
import { getAllProyectos } from '@/lib/markdown'
import { siteConfig } from '@/lib/site'
import ProyectosClient from './ProyectosClient'

const description =
  'Una selección de proyectos donde he combinado diseño, desarrollo y análisis para resolver problemas reales. Filtra por UX, Dev o Data para explorar casos más específicos.'

export const metadata: Metadata = {
  title: 'Proyectos',
  description,
  alternates: { canonical: '/proyectos' },
  openGraph: {
    title: 'Proyectos',
    description,
    url: '/proyectos',
    // openGraph del hijo reemplaza al del layout, así que la imagen se repite aquí
    images: [{ url: siteConfig.ogImage, alt: 'Proyectos' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proyectos',
    description,
    images: [siteConfig.ogImage],
  },
}

export default function Proyectos() {
  const proyectos = getAllProyectos()
  
  return <ProyectosClient initialProyectos={proyectos} />
}
