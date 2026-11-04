// Tipos compartidos para uso en componentes cliente y servidor
//
// Viven aquí y no en lib/markdown.ts porque ese módulo importa `fs` y `path`:
// un componente cliente que importe un tipo desde allí arrastra el módulo de
// servidor a su grafo de dependencias.

export interface ContactoConfig {
  hero: {
    title: string
    description: string
  }
  form: {
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
      variant: 'primary' | 'secondary' | 'tonal' | 'ghost'
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
  }
  hero?: {
    tipo: 'ruta-ingles'
    pantalla: string
    alt: string
  }
  cifras?: {
    titulo: string
    items: { valor: string; texto: string }[]
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
    image?: string
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
  perfil: {
    title: string
    actionButton: {
      text: string
      href: string
    }
    cards: Array<{
      title: string
      description: string
    }>
  }
  proyectos: {
    title: string
    actionButton: {
      text: string
      href: string
    }
    featuredCount: number
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
