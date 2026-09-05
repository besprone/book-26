import { getAllProyectos } from '@/lib/markdown'
import { type Locale } from '@/lib/i18n'
import ProyectosClient from '@/components/pages/WorkClient'

export default function WorkPage({ locale }: { locale: Locale }) {
  const proyectos = getAllProyectos(locale)

  return <ProyectosClient initialProyectos={proyectos} locale={locale} />
}
