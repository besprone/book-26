import Image from 'next/image'
import Button from '@/components/Button'
import SectionViewTracker from '@/components/SectionViewTracker'
import type { HomeConfig } from '@/lib/types'
import styles from './HeroHome.module.css'

// Se pintan en este orden para que el de Calipso quede al frente.
const TELEFONOS = [
  { src: '/home/telefono-ruta.png', width: 575, height: 1246, clase: styles.ruta },
  { src: '/home/telefono-solicitud.png', width: 575, height: 995, clase: styles.solicitud },
  { src: '/home/telefono-calipso.png', width: 750, height: 1298, clase: styles.calipso },
]

export default function HeroHome({ hero }: { hero: HomeConfig['hero'] }) {
  return (
    <section className="relative overflow-hidden bg-primary-500 text-white">
      <SectionViewTracker sectionName="hero" className="absolute top-0 left-0 w-full h-1" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] gap-8 lg:gap-16">
        <div className="lg:pt-12 lg:pb-12">
          <h1 className="text-[38px] md:text-5xl xl:text-[60px] font-semibold leading-[1.08] max-w-[37rem]">
            {hero.title}
          </h1>
          <p className="mt-7 text-xl leading-snug max-w-[37rem]">{hero.description}</p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Button
              href={hero.buttons.primary.href}
              variant={hero.buttons.primary.variant}
              size="lg"
              ctaType="hero_primary"
              sectionName="hero"
            >
              {hero.buttons.primary.text}
            </Button>
            <Button
              href={hero.buttons.secondary.href}
              variant={hero.buttons.secondary.variant}
              size="lg"
              ctaType="hero_secondary"
              sectionName="hero"
            >
              {hero.buttons.secondary.text}
            </Button>
          </div>
        </div>

        <div role="img" aria-label={hero.alt} className={`${styles.composicion} mx-auto lg:mx-0`}>
          {TELEFONOS.map((telefono, i) => (
            <Image
              key={telefono.src}
              src={telefono.src}
              alt=""
              width={telefono.width}
              height={telefono.height}
              sizes="(min-width: 1024px) 300px, 54vw"
              {...(i === 2 ? { priority: true } : { loading: 'eager' as const })}
              className={`${styles.telefono} ${telefono.clase}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
