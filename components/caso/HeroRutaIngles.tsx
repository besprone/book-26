import Image from 'next/image'
import localFont from 'next/font/local'
import styles from './HeroRutaIngles.module.css'

// Tipografías del cartel. Sin precarga, para que solo las descargue quien abre
// este caso: el resto del sitio no usa estos pesos. Licencias OFL en app/fonts.
const atkinson = localFont({
  src: '../../app/fonts/AtkinsonHyperlegibleNext-latin.woff2',
  weight: '800',
  display: 'swap',
  preload: false,
  variable: '--font-hero-frase',
})

const caveat = localFont({
  src: '../../app/fonts/Caveat-latin.woff2',
  weight: '700',
  display: 'swap',
  preload: false,
  variable: '--font-hero-mano',
})

// Errores reales de las llamadas y dictados, con su corrección.
const ARRIBA = [
  ["I'm curly working", 'currently'],
  ['The project is on fire', 'on track'],
  ["I'll keep you proud", 'posted'],
]
const ABAJO = [
  ['Can you get me access', 'give me'],
  ["I'm almost done the screens", 'done with'],
  ["I'm going send it", 'going to'],
]

function Tira({ items, clase, inicio }: { items: string[][]; clase: string; inicio: number }) {
  return (
    <div className={`${styles.tira} ${clase}`}>
      {items.map(([error, correccion], i) => (
        <span
          key={error}
          className={styles.par}
          style={{ '--orden': inicio + i } as React.CSSProperties}
        >
          <span className={styles.error}>{error}</span>
          <span className={styles.correccion}>{correccion}</span>
        </span>
      ))}
    </div>
  )
}

export default function HeroRutaIngles({ pantalla, alt }: { pantalla: string; alt: string }) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`${styles.hero} ${atkinson.variable} ${caveat.variable}`}
    >
      <div aria-hidden="true" className={styles.escena}>
        <Tira items={ARRIBA} clase={styles.tiraArriba} inicio={0} />
        <p className={styles.frase}>
          I
          <span className={styles.hueco}>
            <svg className={styles.caret} viewBox="480 246 80 72" fill="none">
              <path
                pathLength={1}
                d="M484 314 Q504 276 518 248 Q534 278 558 312"
                stroke="currentColor"
                strokeWidth="11"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.mano}>’ll</span>
          </span>
          share the
          <br />
          usability test
          <br />
          by Thursday
        </p>
        <div className={styles.paralaje}>
          <div className={styles.telefono}>
            <Image
              src={pantalla}
              alt=""
              width={360}
              height={780}
              sizes="(min-width: 768px) 30vw, 64vw"
              priority
              className={styles.pantalla}
            />
          </div>
        </div>
        <Tira items={ABAJO} clase={styles.tiraAbajo} inicio={3} />
      </div>
    </div>
  )
}
