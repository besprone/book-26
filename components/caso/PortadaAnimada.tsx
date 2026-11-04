import Image from 'next/image'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import styles from './PortadaAnimada.module.css'

// Solo traen los caracteres que usan las portadas. Licencia OFL en app/fonts.
const abierta700 = localFont({
  src: '../../app/fonts/OpenSans-portada-700.woff2',
  weight: '700',
  display: 'swap',
  preload: false,
  variable: '--portada-700',
})

const abierta800 = localFont({
  src: '../../app/fonts/OpenSans-portada-800.woff2',
  weight: '800',
  display: 'swap',
  preload: false,
  variable: '--portada-800',
})

export type IdeaPortada = 'calipso' | 'solicitud' | 'autogestivo' | 'credito' | 'discovery' | 'neo'

/** Tamaño del archivo pieza.png de cada caso: un teléfono o una tarjeta. */
const PIEZAS: Record<IdeaPortada, { width: number; height: number }> = {
  calipso: { width: 660, height: 1142 },
  solicitud: { width: 660, height: 1142 },
  autogestivo: { width: 660, height: 1142 },
  credito: { width: 660, height: 1142 },
  discovery: { width: 780, height: 771 },
  neo: { width: 930, height: 540 },
}

/** Lámina común: las coordenadas de Figma vienen del grupo de la idea, de 890 × 426. */
function Lamina({ children }: { children: ReactNode }) {
  return (
    <svg className={styles.lamina} viewBox="0 0 890 426" fill="none" aria-hidden="true">
      {children}
    </svg>
  )
}

function Calipso() {
  return (
    <div className={styles.temas} aria-hidden="true">
      {['claroMarcaA', 'claroMarcaB', 'inversoMarcaA', 'inversoMarcaB'].map((tema) => (
        <div key={tema} className={`${styles.tema} ${styles[tema]}`}>
          <span className={styles.pastilla}>Continuar</span>
        </div>
      ))}
    </div>
  )
}

function Solicitud() {
  return (
    <div className={styles.idea} aria-hidden="true">
      <Lamina>
        <path className={styles.cursorTexto} d="M631 82.5H625V177.5H631V82.5Z" fill="#F5C518" />
        <path d="M103.5 288.5H716.5" stroke="#3A404D" strokeWidth="17" strokeLinecap="round" />
        <path
          className={styles.relleno}
          d="M103.5 288.5H466.5"
          pathLength={1}
          stroke="#F5C518"
          strokeWidth="17"
          strokeLinecap="round"
        />
        <g className={styles.arrastre}>
          <path
            d="M475 322.5C493.778 322.5 509 307.278 509 288.5C509 269.722 493.778 254.5 475 254.5C456.222 254.5 441 269.722 441 288.5C441 307.278 456.222 322.5 475 322.5Z"
            fill="#F5C518"
            stroke="#1B1F27"
            strokeWidth="6"
          />
          <g fill="#fff" stroke="#1B1F27" strokeWidth="2.55" strokeLinejoin="round">
            <path d="M430 306L438.637 340.64L445.653 330.13L455.251 342.629L460.82 338.262L451.345 326.258L463.057 322.637L430 306Z" />
            <path d="M461 316L463.49 351.613L472.225 342.482L479.507 356.458L485.75 353.124L478.503 339.657L490.666 338.125L461 316Z" />
            <path d="M492 316L489.51 351.613L499.43 343.786L504.697 358.64L511.342 356.207L506.04 341.862L518.298 342.038L492 316Z" />
            <path d="M523 306L514.363 340.64L525.492 334.654L528.099 350.196L535.067 348.955L532.336 333.908L544.377 336.209L523 306Z" />
          </g>
        </g>
      </Lamina>
      <span className={styles.monto} />
    </div>
  )
}

function Autogestivo() {
  return (
    <div className={styles.idea} aria-hidden="true">
      <Lamina>
        <path d="M-70 150H360" stroke="#1F6F21" strokeWidth="15" strokeLinecap="round" />
        <path d="M-70 287.5H350" stroke="#7F9D92" strokeWidth="15" strokeLinecap="round" strokeDasharray="0.5 31" />
        <circle className={styles.persona} cx="180" cy="150" r="33" fill="#1F6F21" />
        <circle className={styles.persona} cx="180" cy="287.5" r="33" fill="#7F9D92" />
        <rect x="370" y="48" width="80" height="331" rx="40" fill="#06382E" />
        <g className={styles.sello}>
          <circle cx="410" cy="150" r="25" fill="#3FDFB8" />
          <path d="M398 150L407 159L423 141" stroke="#06382E" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g className={styles.sello}>
          <circle cx="410" cy="287.5" r="25" fill="#fff" />
          <path d="M399 287.5H421" stroke="#06382E" strokeWidth="7.5" strokeLinecap="round" />
        </g>
        <g className={styles.salida}>
          <path d="M460 150H565" stroke="#1F6F21" strokeWidth="15" strokeLinecap="round" />
          <rect x="565" y="83" width="170" height="134" rx="22" fill="#1F6F21" />
          <text className={styles.signo} x="650" y="177" textAnchor="middle" fill="#fff">
            $
          </text>
        </g>
        <g className={styles.salida}>
          <path
            d="M495 247.5H715C720.304 247.5 725.391 249.607 729.142 253.358C732.893 257.109 735 262.196 735 267.5V320C735 325.304 732.893 330.391 729.142 334.142C725.391 337.893 720.304 340 715 340H555L525 365V340H495C489.696 340 484.609 337.893 480.858 334.142C477.107 330.391 475 325.304 475 320V267.5C475 262.196 477.107 257.109 480.858 253.358C484.609 249.607 489.696 247.5 495 247.5Z"
            fill="#fff"
          />
          <path d="M520 281H690M520 310H630" stroke="#7F9D92" strokeWidth="11" strokeLinecap="round" />
        </g>
      </Lamina>
    </div>
  )
}

function Credito() {
  return (
    <div className={styles.idea} aria-hidden="true">
      <span className={`${styles.noventa} ${styles.noventaVacio}`}>90%</span>
      <span className={`${styles.noventa} ${styles.noventaLleno}`}>90%</span>
      <Lamina>
        <path className={styles.tallo} d="M619 150C618 120 618 100 619 75" pathLength={1} stroke="#1F6F21" strokeWidth="10" strokeLinecap="round" />
        <path className={styles.hoja} d="M619 107C595 107 576 93 571 67C600 65 618 80 619 107Z" fill="#3FA53F" />
        <path className={styles.hoja} d="M619 86C642 86 662 72 668 46C637 44 620 61 619 86Z" fill="#5FC65F" />
      </Lamina>
    </div>
  )
}

// El árbol de oportunidades: cada nivel se une en el siguiente hasta un insight.
const AMARILLO = '#FFD978'
const MENTA = '#A5F6DE'
const ROJO = '#F4A8A4'
const AZUL = '#B3C9EC'
const LILA = '#EBB4F6'
const COLORES_EVIDENCIA = [AMARILLO, MENTA, ROJO, AZUL, LILA]

const EVIDENCIAS = Array.from({ length: 12 }, (_, i) => ({ y: 43 + i * 29.5, color: COLORES_EVIDENCIA[i % 5] }))
const APRENDIZAJES = [
  { y: 85, centro: 105.5, color: MENTA },
  { y: 155, centro: 175.5, color: ROJO },
  { y: 235, centro: 255.5, color: AZUL },
  { y: 310, centro: 330.5, color: LILA },
]
const INSIGHTS = [
  { y: 125, centro: 154.5, color: AZUL },
  { y: 270, centro: 299.5, color: LILA },
]

function curva(x1: number, y1: number, x2: number, y2: number) {
  const medio = (x1 + x2) / 2
  return `M${x1} ${y1}C${medio} ${y1} ${medio} ${y2} ${x2} ${y2}`
}

function Discovery() {
  return (
    <div className={styles.idea} aria-hidden="true">
      <Lamina>
        <g className={styles.lineas1} stroke="#2B2A30" strokeWidth="2.5">
          {EVIDENCIAS.map((nota, i) => (
            <path key={nota.y} d={curva(102, nota.y + 11, 200, APRENDIZAJES[Math.floor(i / 3)].centro)} pathLength={1} />
          ))}
        </g>
        <g className={styles.lineas2} stroke="#2B2A30" strokeWidth="2.5">
          {APRENDIZAJES.map((nota, i) => (
            <path key={nota.y} d={curva(241, nota.centro, 345, INSIGHTS[Math.floor(i / 2)].centro)} pathLength={1} />
          ))}
        </g>
        <g className={styles.lineas3} stroke="#2B2A30" strokeWidth="2.5">
          {INSIGHTS.map((nota) => (
            <path key={nota.y} d={curva(404, nota.centro, 500, 202.5)} pathLength={1} />
          ))}
        </g>
        {EVIDENCIAS.map((nota) => (
          <rect key={nota.y} x="80" y={nota.y} width="22" height="22" rx="2.5" fill={nota.color} />
        ))}
        <g className={styles.nivel2}>
          {APRENDIZAJES.map((nota) => (
            <rect key={nota.y} x="200" y={nota.y} width="41" height="41" rx="3.5" fill={nota.color} />
          ))}
        </g>
        <g className={styles.nivel3}>
          {INSIGHTS.map((nota) => (
            <rect key={nota.y} x="345" y={nota.y} width="59" height="59" rx="4.5" fill={nota.color} />
          ))}
        </g>
        <g className={styles.notaFinal}>
          <rect x="500" y="97.5" width="210" height="210" rx="10" fill="#FFCB3D" />
          <path d="M532.5 167.5H677.5M532.5 205H677.5M532.5 242.5H622.5" stroke="#483400" strokeWidth="13" strokeLinecap="round" />
        </g>
      </Lamina>
    </div>
  )
}

function Neo() {
  return (
    <div aria-hidden="true">
      <div className={styles.puntos} />
      <div className={styles.puntosActivos} />
      <span className={styles.abandono} />
    </div>
  )
}

const IDEAS: Record<IdeaPortada, () => JSX.Element> = {
  calipso: Calipso,
  solicitud: Solicitud,
  autogestivo: Autogestivo,
  credito: Credito,
  discovery: Discovery,
  neo: Neo,
}

/**
 * Portada de un caso: se anima la idea del caso una vez, y después llega el
 * teléfono o la tarjeta con la pantalla real.
 *
 * Todo está en su lugar final por defecto y las animaciones solo definen de
 * dónde viene cada cosa. Si no corren, o la persona pidió menos movimiento, se
 * ve el cuadro final completo.
 */
export default function PortadaAnimada({ idea, slug, alt }: { idea: IdeaPortada; slug: string; alt: string }) {
  const Idea = IDEAS[idea]
  const pieza = PIEZAS[idea]
  return (
    <div
      role="img"
      aria-label={alt}
      className={`${styles.portada} ${styles[idea]} ${abierta700.variable} ${abierta800.variable}`}
    >
      <Idea />
      <Image
        src={`/proyectos/${slug}/pieza.png`}
        alt=""
        width={pieza.width}
        height={pieza.height}
        sizes="(min-width: 768px) 45vw, 70vw"
        priority
        className={styles.pieza}
      />
    </div>
  )
}
