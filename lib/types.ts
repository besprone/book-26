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
      variant: 'ghost' | 'solid' | 'outline'
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
    investigacionImage?: string
    diseno?: string
    disenoImage?: string
    desarrollo?: string
    desarrolloImage?: string
    analisisDatos?: string
    analisisDatosImage?: string
  }
  rolYHerramientas?: {
    rol?: string[]
    herramientas?: string[]
  }
  resultados?: string[]
  resultadosImages?: string[] // Galería de imágenes para resultados
  aprendizajes?: string
  // Imágenes entre secciones (full-width)
  images?: {
    afterReto?: string
    afterProceso?: string
    afterResultados?: string
    afterAprendizajes?: string
  }
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
        variant: 'ghost' | 'solid' | 'outline'
      }
      secondary: {
        text: string
        href: string
        variant: 'ghost' | 'solid' | 'outline'
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
        variant: 'ghost' | 'solid' | 'outline'
      }
      secondary: {
        text: string
        href: string
        variant: 'ghost' | 'solid' | 'outline'
      }
    }
  }
}
export interface SobreMiConfig {
  hero: {
    title: string
    description: string
    image?: string
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
        variant: 'ghost' | 'solid' | 'outline'
      }
      secondary: {
        text: string
        href: string
        variant: 'ghost' | 'solid' | 'outline'
      }
    }
  }
}
