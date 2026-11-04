// Tipos compartidos para uso en componentes cliente y servidor
//
// Viven aquí y no en lib/markdown.ts porque ese módulo importa `fs` y `path`:
// un componente cliente que importe un tipo desde allí arrastra el módulo de
// servidor a su grafo de dependencias.

import type { VarianteBoton } from './estilos-boton'

export interface ContactoConfig {
  hero: {
    title: string
    description: string
  }
  form: {
    title: string
    fields: {
      name: {
        label: string
        placeholder: string
      }
      email: {
        label: string
        placeholder: string
      }
      message: {
        label: string
        placeholder: string
      }
    }
    submitButton: {
      text: string
      loadingText: string
    }
    messages: {
      success: string
      error: string
    }
  }
  cta: {
    title: string
    button: {
      text: string
      href: string
      variant: VarianteBoton
    }
  }
  final: {
    text: string
  }
}

export interface Proyecto {
  slug: string
  title: string
  description: string
  image?: string
  technologies: string[]
  date: string
  github?: string
  demo?: string
  featured?: boolean
  type?: string[] // Array de tipos: ["UX", "Dev", "Data"]
  // Campos adicionales para el detalle del proyecto
  client?: string
  year?: string
  role?: string
  reto?: string
  videoYoutube?: string // URL del video de YouTube (ej: https://youtu.be/xxx o https://www.youtube.com/watch?v=xxx)
  proceso?: {
    investigacion?: string
    diseno?: string
    desarrollo?: string
    analisisDatos?: string
  }
  rolYHerramientas?: {
    rol?: string[]
    herramientas?: string[]
  }
  resultados?: string[]
  aprendizajes?: string
  // Colores del caso. Los nombres son los mismos en todos los proyectos y solo
  // cambia el valor, así que un caso nuevo no agrega tokens.
  tema?: {
    bg: string
    ink: string
    accent: string
    /** Fondo, valores y texto de la banda de cifras. */
    band: string
    bandValue: string
    bandText: string
    /** Color de los números del proceso. Sin él, siguen el tema claro u oscuro. */
    number?: string
  }
  hero?:
    | { tipo: 'ruta-ingles'; pantalla: string; alt: string }
    /** Usa portada.png y portada-celular.png de la carpeta del proyecto. */
    | { tipo: 'portada'; alt: string }
  cifras?: {
    titulo: string
    items: { valor: string; texto: string }[]
  }
  /** Tres tarjetas con lo que hace distinto al caso. */
  destacado?: {
    titulo: string
    intro: string
    items: { titulo: string; texto: string }[]
  }
  comparador?: {
    titulo: string
    intro: string
    etiquetaFrase: string
    etiquetaCorreccion: string
    veredicto: string
    items: { frase: string; correccion: string }[]
  }
  // No hay campos de imagen por sección. El generador de proyectos reservaba
  // nueve huecos (investigación, diseño, galería de resultados, imágenes entre
  // secciones…) pero la ficha nunca llegó a pintarlos, así que el contenido
  // apuntaba a archivos que no existían y no se veían. Si algún día se quieren
  // imágenes dentro del caso, hay que añadir a la vez el campo y el código que
  // lo muestra.
}
export interface CV {
  content: string
  data: {
    nombre: string
    email: string
    titulo?: string
    [key: string]: any
  }
}
export interface HomeConfig {
  hero: {
    title: string
    description: string
    /** Describe los teléfonos del hero, que se leen como una sola imagen. */
    alt: string
    buttons: {
      primary: { text: string; href: string; variant: VarianteBoton }
      secondary: { text: string; href: string; variant: VarianteBoton }
    }
  }
  /** Banda de cifras. En `valor`, `{casos}` se cambia por el número de casos publicados. */
  prueba: {
    titulo: string
    items: { valor: string; texto: string }[]
  }
  proyectos: {
    title: string
    actionButton: {
      text: string
      href: string
    }
    featuredCount: number
  }
  comoTrabajo: {
    title: string
    fases: { titulo: string; texto: string }[]
  }
  stack: {
    title: string
    actionButton: {
      text: string
      href: string
    }
    categories: Array<{
      title: string
      items: string[]
    }>
  }
  callToAction: {
    title: string
    buttons: {
      primary: { text: string; href: string; variant: VarianteBoton }
      secondary: { text: string; href: string; variant: VarianteBoton }
    }
  }
}
export interface SobreMiConfig {
  hero: {
    /** Nombre de la sección, arriba del título. */
    title: string
    /** El h1 de la página. */
    statement: string
    description: string
    cvButton: {
      text: string
      href: string
    }
  }
  resumenProfesional: {
    title: string
    cards: Array<{
      title: string
      description: string
    }>
  }
  experiencia: {
    title: string
    items: Array<{
      title: string
      company: string
      period: string
      /** Lo que dice el escalón del hero: el año de inicio, o el rango si sigue vigente. */
      etiqueta: string
      logo?: string
    }>
  }
  formacion: {
    title: string
    certificaciones: {
      title: string
      items: Array<{
        nombre: string
        institucion: string
        año: string
      }>
    }
    educacion: {
      title: string
      items: Array<{
        nombre: string
        institucion: string
        año: string
      }>
    }
  }
  stack: {
    title: string
    categories: Array<{
      title: string
      items: Array<{
        nombre: string
        descripcion: string
      }>
    }>
  }
  callToAction: {
    title: string
    buttons: {
      primary: {
        text: string
        href: string
        variant: 'primary' | 'secondary' | 'tonal' | 'ghost'
      }
      secondary: {
        text: string
        href: string
        variant: 'primary' | 'secondary' | 'tonal' | 'ghost'
      }
    }
  }
}
