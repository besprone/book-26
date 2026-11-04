import { ListaEtiquetas } from '@/components/ListaEtiquetas'
import SectionViewTracker from '@/components/SectionViewTracker'
import Reveal from './Reveal'
import type { Proyecto } from '@/lib/types'

/** Ancho y márgenes de todas las secciones del caso, los mismos del header. */
const contenedor = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
const vertical = 'py-12 md:py-24'
const titulo2 = 'text-[28px] md:text-[40px] font-normal leading-tight text-gray-900 dark:text-white'

/** El reto: título a la izquierda y el planteamiento a la derecha. */
export function Reto({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <section className={`${contenedor} pb-12 md:pb-24 relative`}>
      <SectionViewTracker sectionName="reto" className="absolute top-0 left-0 w-full h-1" />
      <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-5 lg:gap-16">
        <h2 className={titulo2}>{titulo}</h2>
        <p className="text-base md:text-xl leading-relaxed text-gray-600 dark:text-gray-400 max-w-[52rem]">
          {texto}
        </p>
      </div>
    </section>
  )
}

/** Colores de la banda de cifras fuera de los casos, los mismos de un caso sin `tema`. */
export const coloresBandaSitio = {
  '--case-band': '#172130',
  '--case-band-value': '#11ced8',
  '--case-band-text': '#ffffff',
} as React.CSSProperties

/** Banda con las cifras del caso. Sus colores son los de `tema`. */
export function Cifras({
  cifras,
  tituloOculto = false,
}: {
  cifras: NonNullable<Proyecto['cifras']>
  /** Para cuando las cifras se explican solas y el título solo le sirve a un lector de pantalla. */
  tituloOculto?: boolean
}) {
  return (
    <section className="relative" style={{ background: 'var(--case-band)', color: 'var(--case-band-text)' }}>
      <SectionViewTracker sectionName="cifras" className="absolute top-0 left-0 w-full h-1" />
      <div className={`${contenedor} ${vertical}`}>
        {tituloOculto ? (
          <h2 className="sr-only">{cifras.titulo}</h2>
        ) : (
          <Reveal>
            <h2 className="text-[28px] md:text-[40px] font-normal leading-tight mb-8 md:mb-10">{cifras.titulo}</h2>
          </Reveal>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {cifras.items.map((item, i) => (
            <Reveal key={item.valor} delay={i * 100}>
              <p
                className="text-[40px] lg:text-[56px] font-bold leading-tight mb-3"
                style={{ color: 'var(--case-band-value)' }}
              >
                {item.valor}
              </p>
              <p className="text-base md:text-xl leading-relaxed">{item.texto}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Las fases del proceso, en filas. Se numeran después de filtrar: si un caso no
 * tiene fase de datos, no queda un hueco en la secuencia.
 */
export function Proceso({
  titulo,
  fases,
  sectionName = 'proceso',
}: {
  titulo: string
  fases: { titulo: string; texto?: string }[]
  sectionName?: string
}) {
  return (
    <section className={`${contenedor} ${vertical} relative`}>
      <SectionViewTracker sectionName={sectionName} className="absolute top-0 left-0 w-full h-1" />
      <h2 className={`${titulo2} mb-6 md:mb-10`}>{titulo}</h2>
      <ol role="list">
        {fases
          .filter((fase) => fase.texto)
          .map((fase, i) => (
            <li
              key={fase.titulo}
              className="grid grid-cols-1 lg:grid-cols-[120px_300px_minmax(0,1fr)] gap-x-16 gap-y-2 py-7 border-t border-gray-300 dark:border-gray-700"
            >
              <span className="caso-numero text-[40px] lg:text-[56px] font-bold leading-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-xl md:text-[28px] font-normal leading-snug text-gray-900 dark:text-white">
                {fase.titulo}
              </h3>
              <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400 mt-1 lg:mt-0">{fase.texto}</p>
            </li>
          ))}
      </ol>
    </section>
  )
}

/** Tres tarjetas con lo que hace distinto a este caso. Sobre mí las usa para lo que aporto. */
export function Destacado({
  destacado,
  sectionName = 'destacado',
}: {
  destacado: { titulo: string; intro?: string; items: { titulo: string; texto: string }[] }
  sectionName?: string
}) {
  return (
    <section className="relative bg-gray-50 dark:bg-gray-800">
      <SectionViewTracker sectionName={sectionName} className="absolute top-0 left-0 w-full h-1" />
      <div className={`${contenedor} ${vertical}`}>
        <Reveal>
          <h2 className={`${titulo2} ${destacado.intro ? 'mb-4 md:mb-6' : 'mb-8 md:mb-10'}`}>{destacado.titulo}</h2>
          {destacado.intro && (
            <p className="text-base md:text-xl leading-relaxed text-gray-600 dark:text-gray-400 max-w-3xl mb-8 md:mb-10">
              {destacado.intro}
            </p>
          )}
        </Reveal>
        <ul role="list" className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {destacado.items.map((item, i) => (
            <li key={item.titulo}>
              <Reveal delay={i * 100} className="h-full">
                <div className="h-full rounded-xl bg-white dark:bg-gray-900 p-6 md:p-7">
                  <h3 className="text-xl font-normal mb-2 text-gray-900 dark:text-white">{item.titulo}</h3>
                  <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">{item.texto}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Frases correctas que la app marcó como error. */
export function Comparador({ comparador }: { comparador: NonNullable<Proyecto['comparador']> }) {
  return (
    <section className="relative bg-gray-50 dark:bg-gray-800">
      <SectionViewTracker sectionName="comparador" className="absolute top-0 left-0 w-full h-1" />
      <div className={`${contenedor} ${vertical}`}>
        <Reveal>
          <h2 className={`${titulo2} mb-4 md:mb-6`}>{comparador.titulo}</h2>
          <p className="text-base md:text-xl leading-relaxed text-gray-600 dark:text-gray-400 max-w-3xl mb-8 md:mb-10">
            {comparador.intro}
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {comparador.items.map((item, i) => (
            <Reveal key={item.frase} delay={i * 100} className="h-full">
              <div className="h-full rounded-xl bg-white dark:bg-gray-900 p-6 md:p-7">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{comparador.etiquetaFrase}</p>
                <p lang="en" className="text-lg md:text-xl text-gray-900 dark:text-white mb-5">
                  {item.frase}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{comparador.etiquetaCorreccion}</p>
                <p lang="en" className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-5">
                  <s className="caso-tachado no-underline" style={{ textDecoration: 'none' }}>
                    {item.correccion}
                  </s>
                </p>
                <p className="text-sm font-medium text-primary-500 dark:text-primary-300">{comparador.veredicto}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function RolYHerramientas({
  titulo,
  etiquetaRol,
  etiquetaHerramientas,
  rol,
  herramientas,
}: {
  titulo: string
  etiquetaRol: string
  etiquetaHerramientas: string
  rol: string[]
  herramientas: string[]
}) {
  const columna = (etiqueta: string | null, items: string[]) => (
    <div>
      {etiqueta && <h3 className="text-xl font-normal mb-3 text-gray-900 dark:text-white">{etiqueta}</h3>}
      <ListaEtiquetas items={items} variant="metadato" />
    </div>
  )

  return (
    <section className={`${contenedor} ${vertical} relative`}>
      <SectionViewTracker sectionName="rol_herramientas" className="absolute top-0 left-0 w-full h-1" />
      <h2 className={`${titulo2} mb-6 md:mb-10`}>{titulo}</h2>
      <div className={`grid grid-cols-1 gap-8 ${rol.length > 0 ? 'md:grid-cols-2 md:gap-12' : ''}`}>
        {rol.length > 0 && columna(etiquetaRol, rol)}
        {/* Sin la columna de rol, el título de la sección ya dice "Herramientas". */}
        {herramientas.length > 0 && columna(rol.length > 0 ? etiquetaHerramientas : null, herramientas)}
      </div>
    </section>
  )
}

export function Resultados({ titulo, items }: { titulo: string; items: string[] }) {
  return (
    <section className={`${contenedor} pb-12 md:pb-24 relative`}>
      <SectionViewTracker sectionName="resultados" className="absolute top-0 left-0 w-full h-1" />
      <h2 className={`${titulo2} mb-6 md:mb-10`}>{titulo}</h2>
      <ul role="list" className="space-y-5 md:space-y-8">
        {items.map((item) => (
          <li key={item} className="flex gap-4 text-base md:text-xl text-gray-900 dark:text-white">
            <span aria-hidden="true" className="flex-none mt-2.5 h-2 w-2 rounded-full bg-gray-900 dark:bg-white" />
            {item}
          </li>
        ))}
      </ul>
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
    <section className="relative" style={{ background: 'var(--case-bg)', color: 'var(--case-ink)' }}>
      <SectionViewTracker sectionName="aprendizajes" className="absolute top-0 left-0 w-full h-1" />
      <div className={`${contenedor} ${vertical}`}>
        <h2 className="sr-only">{titulo}</h2>
        <p className="text-[30px] md:text-[52px] font-semibold leading-[1.12] max-w-[69rem] mb-6 md:mb-8">{frase}</p>
        {resto.length > 0 && (
          <p className="text-base md:text-xl leading-relaxed max-w-[54rem]">{resto.join(' ')}</p>
        )}
      </div>
    </section>
  )
}
