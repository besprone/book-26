import SectionViewTracker from '@/components/SectionViewTracker'
import Reveal from './Reveal'
import type { Proyecto } from '@/lib/types'

/** Bloque oscuro con las cifras del caso. Usa los colores de `tema`. */
export function Cifras({ cifras }: { cifras: NonNullable<Proyecto['cifras']> }) {
  return (
    <section
      className="caso-bleed relative"
      style={{ background: 'var(--case-ink)', color: 'var(--case-accent)' }}
    >
      <SectionViewTracker sectionName="cifras" className="absolute top-0 left-0 w-full h-1" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-24">
        <Reveal>
          <h2 className="text-2xl md:text-4xl font-normal mb-10 md:mb-14">{cifras.titulo}</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {cifras.items.map((item, i) => (
            <Reveal key={item.valor} delay={i * 100}>
              <p
                className="text-5xl lg:text-6xl font-bold mb-4 whitespace-nowrap"
                style={{ color: 'var(--case-bg)' }}
              >
                {item.valor}
              </p>
              <p className="text-base md:text-lg leading-relaxed opacity-90">{item.texto}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Frases correctas que la app marcó como error. */
export function Comparador({ comparador }: { comparador: NonNullable<Proyecto['comparador']> }) {
  return (
    <section className="caso-bleed relative bg-gray-50 dark:bg-gray-800">
      <SectionViewTracker sectionName="comparador" className="absolute top-0 left-0 w-full h-1" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-24">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {comparador.titulo}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose mb-10">
            {comparador.intro}
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comparador.items.map((item, i) => (
            <Reveal key={item.frase} delay={i * 100} className="h-full">
              <div className="h-full rounded-2xl bg-white dark:bg-gray-900 p-6 md:p-7">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {comparador.etiquetaFrase}
                </p>
                <p lang="en" className="text-lg md:text-xl text-gray-900 dark:text-white mb-5">
                  {item.frase}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {comparador.etiquetaCorreccion}
                </p>
                <p lang="en" className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-5">
                  <s className="caso-tachado no-underline" style={{ textDecoration: 'none' }}>
                    {item.correccion}
                  </s>
                </p>
                <p className="text-sm font-medium text-primary-500 dark:text-primary-300">
                  {comparador.veredicto}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Bloque de color con el aprendizaje. La primera frase va en grande porque es
 * la idea del caso, y el resto queda como su explicación.
 */
export function AprendizajeDestacado({ titulo, texto }: { titulo: string; texto: string }) {
  const [frase, ...resto] = texto.split(/(?<=\.)\s+/)
  return (
    <section
      className="caso-bleed relative"
      style={{ background: 'var(--case-bg)', color: 'var(--case-ink)' }}
    >
      <SectionViewTracker sectionName="aprendizajes" className="absolute top-0 left-0 w-full h-1" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-24">
        <h2 className="text-sm font-medium uppercase tracking-wider mb-6">{titulo}</h2>
        <p className="text-3xl md:text-5xl font-semibold leading-tight max-w-4xl mb-8">{frase}</p>
        <p className="text-lg md:text-xl leading-relaxed max-w-3xl">{resto.join(' ')}</p>
      </div>
    </section>
  )
}
