import type { Metadata } from 'next'
import ProjectPage from '@/components/pages/ProjectPage'
import { getAllProyectos, getProyectoBySlug } from '@/lib/markdown'
import { metadataProyecto } from '@/lib/metadata'
import { siteConfig } from '@/lib/site'

export async function generateStaticParams() {
  return getAllProyectos().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const proyecto = await getProyectoBySlug(params.slug, 'es')
  if (!proyecto) return { title: 'Proyecto no encontrado' }

  return metadataProyecto({
    locale: 'es',
    slug: proyecto.slug,
    title: proyecto.title,
    description: proyecto.description || siteConfig.description,
    image: proyecto.image,
    date: proyecto.date,
  })
}

export default function Page({ params }: { params: { slug: string } }) {
  return <ProjectPage slug={params.slug} locale="es" />
}
