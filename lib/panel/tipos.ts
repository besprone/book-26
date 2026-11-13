export type Periodo = 'hoy' | '7d' | '30d'

export const PERIODOS: { valor: Periodo; etiqueta: string; comparacion: string }[] = [
  { valor: 'hoy', etiqueta: 'Hoy', comparacion: 'vs. ayer' },
  { valor: '7d', etiqueta: '7 días', comparacion: 'vs. semana pasada' },
  { valor: '30d', etiqueta: '30 días', comparacion: 'vs. mes pasado' },
]

export interface PersonaAhora {
  pagina: string
  pais: string
  fuente: string
  segundos: number
}

export interface Cifra {
  clave: 'visitantes' | 'casos' | 'cv' | 'mensajes'
  etiqueta: string
  valor: number
  anterior: number
}

export interface Enlace {
  etiqueta: string
  detalle: string
  ultimo: string
}

export interface Actividad {
  texto: string
  cuando: string
}

export interface DatosPanel {
  actualizado: string
  periodo: Periodo
  muestra: boolean
  ahora: PersonaAhora[]
  ultimaVisita: { cuando: string; pais: string; pagina: string } | null
  cifras: Cifra[]
  enlaces: Enlace[]
  fuentes: [string, number][]
  casos: [string, number][]
  actividad: Actividad[]
}
