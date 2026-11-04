import { ListaEtiquetas } from '@/components/ListaEtiquetas'
import SectionHeader from '@/components/SectionHeader'
import SectionViewTracker from '@/components/SectionViewTracker'

interface StackEtiquetasProps {
  title: string
  categories: { title: string; items: string[] }[]
  actionLabel?: string
  actionHref?: string
}

/** El stack por categorías. Sin tarjetas: las etiquetas bastan. */
export default function StackEtiquetas({ title, categories, actionLabel, actionHref }: StackEtiquetasProps) {
  return (
    <section className="py-12 md:py-24 relative">
      <SectionViewTracker sectionName="stack" className="absolute top-0 left-0 w-full h-1" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={title} actionLabel={actionLabel} actionHref={actionHref} sectionName="stack" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {categories.map((category) => (
            <div key={category.title}>
              <h3 className="text-xl font-normal mb-3 text-gray-900 dark:text-white">{category.title}</h3>
              <ListaEtiquetas items={category.items} variant="metadato" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
