import Image from 'next/image'
import Button from '@/components/Button'
import SectionViewTracker from '@/components/SectionViewTracker'
import type { SobreMiConfig } from '@/lib/types'
import Muneco from './Muneco'
import MunecoEnPantalla from './MunecoEnPantalla'
import styles from './HeroEscalones.module.css'

interface HeroEscalonesProps {
  hero: SobreMiConfig['hero']
  experiencia: SobreMiConfig['experiencia']
}

export default function HeroEscalones({ hero, experiencia }: HeroEscalonesProps) {
  return (
    <section className={styles.hero}>
      <SectionViewTracker sectionName="hero" className="absolute top-0 left-0 w-full h-1" />
      <div className={styles.marco}>
        <div className={styles.texto}>
          <p className={styles.seccion}>{hero.title}</p>
          <h1 className={styles.titulo}>{hero.statement}</h1>
          <p className={styles.bio}>{hero.description}</p>
          <div className={styles.accion}>
            <Button
              href={hero.cvButton.href}
              variant="noche"
              size="lg"
              ctaType="cv_download"
              sectionName="hero"
            >
              {hero.cvButton.text}
            </Button>
          </div>
        </div>

        <div className={styles.escena}>
          <ol className={styles.escalera} aria-label={experiencia.title}>
            {experiencia.items.map((item, i) => (
              <li
                key={`${item.company}-${item.period}`}
                className={styles.escalon}
                style={{ '--i': i } as React.CSSProperties}
              >
                <div className={styles.bloque}>
                  {item.logo && (
                    <span className={styles.logo}>
                      <Image src={item.logo} alt="" width={48} height={48} loading="eager" />
                    </span>
                  )}
                  <div className={styles.datos}>
                    <span className={styles.anio}>{item.etiqueta}</span>
                    <span className={styles.rol}>{item.title}</span>
                    <span className={styles.empresa}>{item.company}</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <MunecoEnPantalla className={styles.muneco}>
            <div className={styles.avance}>
              <div className={styles.salto}>
                <div className={styles.escala}>
                  <Muneco />
                </div>
              </div>
            </div>
          </MunecoEnPantalla>
        </div>
      </div>
    </section>
  )
}
