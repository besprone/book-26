import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const contentDirectory = path.join(process.cwd(), 'content')

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

// Obtener la configuración del home
export function getHomeConfig(): HomeConfig {
  const configPath = path.join(contentDirectory, 'config.json')
  
  if (!fs.existsSync(configPath)) {
    // Configuración por defecto si no existe el archivo
    return {
      hero: {
        title: 'Diseñador de producto con visión técnica y enfoque en datos',
        description: 'Combino UX, desarrollo y análisis para crear experiencias útiles, funcionales y medibles',
        buttons: {
          primary: { text: 'Ver proyectos', href: '/proyectos', variant: 'outline' },
          secondary: { text: 'Contáctame', href: '/contacto', variant: 'solid' },
        },
      },
      perfil: {
        title: 'Perfil profesional',
        actionButton: { text: 'Sobre mí', href: '/sobre-mi' },
        cards: [],
      },
      proyectos: {
        title: 'Proyectos',
        actionButton: { text: 'Ver proyectos', href: '/proyectos' },
        featuredCount: 3,
      },
      stack: {
        title: 'Stack',
        actionButton: { text: 'Sobre mí', href: '/sobre-mi' },
        categories: [],
      },
      callToAction: {
        title: 'Me encantaría ayudarte a dar vida a tu próximo producto',
        buttons: {
          primary: { text: 'Ver proyectos', href: '/proyectos', variant: 'outline' },
          secondary: { text: 'Contáctame', href: '/contacto', variant: 'solid' },
        },
      },
    }
  }

  const fileContents = fs.readFileSync(configPath, 'utf8')
  return JSON.parse(fileContents) as HomeConfig
}

export interface SobreMiConfig {
  hero: {
    title: string
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

// Obtener la configuración de Sobre Mí
export function getSobreMiConfig(): SobreMiConfig {
  const configPath = path.join(contentDirectory, 'sobre-mi.json')
  
  if (!fs.existsSync(configPath)) {
    // Configuración por defecto si no existe el archivo
    return {
      hero: {
        title: 'Sobre mí',
        description: 'Descripción sobre ti...',
        cvButton: { text: 'Descargar CV', href: '/cv.pdf' },
      },
      resumenProfesional: {
        title: 'Resumen profesional',
        cards: [],
      },
      experiencia: {
        title: 'Experiencia',
        items: [],
      },
      formacion: {
        title: 'Formación y certificaciones',
        certificaciones: { title: 'Certificaciones recientes', items: [] },
        educacion: { title: 'Formación formal', items: [] },
      },
      stack: {
        title: 'Stack',
        categories: [],
      },
      callToAction: {
        title: '¿Te interesa saber cómo podría aportar a tu equipo o proyecto?',
        buttons: {
          primary: { text: 'Ver proyectos', href: '/proyectos', variant: 'outline' },
          secondary: { text: 'Contáctame', href: '/contacto', variant: 'solid' },
        },
      },
    }
  }

  const fileContents = fs.readFileSync(configPath, 'utf8')
  return JSON.parse(fileContents) as SobreMiConfig
}

// Obtener todos los proyectos
export function getAllProyectos(): Proyecto[] {
  const proyectosDirectory = path.join(contentDirectory, 'proyectos')
  
  if (!fs.existsSync(proyectosDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(proyectosDirectory)
  const allProyectos = fileNames
    .filter(name => name.endsWith('.json'))
    .map((fileName) => {
      const slug = fileName.replace(/\.json$/, '')
      const fullPath = path.join(proyectosDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const data = JSON.parse(fileContents)

      // Extraer año de la fecha si no está en year
      const year = data.year || (data.date ? new Date(data.date).getFullYear().toString() : '')
      
      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        image: data.image,
        technologies: data.technologies || [],
        date: data.date || '',
        github: data.github,
        demo: data.demo,
        featured: data.featured || false,
        type: data.type || [],
        client: data.client,
        year: year,
        role: data.role,
        reto: data.reto,
        proceso: data.proceso,
        rolYHerramientas: data.rolYHerramientas,
        resultados: data.resultados,
        resultadosImages: data.resultadosImages || [],
        aprendizajes: data.aprendizajes,
        images: data.images,
      }
    })
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1
      } else {
        return -1
      }
    })

  return allProyectos
}

// Obtener un proyecto por slug
export async function getProyectoBySlug(slug: string): Promise<Proyecto | null> {
  const proyectosDirectory = path.join(contentDirectory, 'proyectos')
  const fullPath = path.join(proyectosDirectory, `${slug}.json`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const data = JSON.parse(fileContents)

  // Extraer año de la fecha si no está en year
  const year = data.year || (data.date ? new Date(data.date).getFullYear().toString() : '')
  
  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    image: data.image,
    technologies: data.technologies || [],
    date: data.date || '',
    github: data.github,
    demo: data.demo,
    featured: data.featured || false,
    type: data.type || [],
    client: data.client,
    year: year,
    role: data.role,
    reto: data.reto,
    proceso: data.proceso,
    rolYHerramientas: data.rolYHerramientas,
    resultados: data.resultados,
    resultadosImages: data.resultadosImages || [],
    aprendizajes: data.aprendizajes,
    images: data.images,
  }
}

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

// Obtener la configuración de Contacto
export function getContactoConfig(): ContactoConfig {
  const configPath = path.join(contentDirectory, 'contacto.json')
  
  if (!fs.existsSync(configPath)) {
    // Configuración por defecto si no existe el archivo
    return {
      hero: {
        title: '¿Tienes un proyecto en mente?',
        description: 'Estoy disponible para colaboraciones freelance, consultorías, asesorías UX o simplemente para charlar sobre ideas.',
      },
      form: {
        fields: {
          name: {
            label: 'Nombre',
            placeholder: 'Tu nombre',
          },
          email: {
            label: 'Correo electrónico',
            placeholder: 'tu@email.com',
          },
          message: {
            label: 'Mensaje',
            placeholder: 'Cuéntame sobre tu proyecto...',
          },
        },
        submitButton: {
          text: 'Contáctame',
          loadingText: 'Enviando...',
        },
        messages: {
          success: '¡Mensaje enviado con éxito! Te responderé pronto.',
          error: 'Hubo un error al enviar el mensaje. Por favor intenta de nuevo.',
        },
      },
      cta: {
        title: '¿Te interesa saber cómo podría aportar a tu equipo o proyecto?',
        button: {
          text: 'Agendar una llamada',
          href: 'mailto:besprone@gmail.com?subject=Agendar una llamada&body=Hola Marco,%0D%0A%0D%0AMe gustaría agendar una llamada para hablar sobre...',
          variant: 'outline' as const,
        },
      },
      final: {
        text: 'Me interesa trabajar con personas que valoran el diseño como herramienta de impacto. Si tienes una idea, me encantará escucharla.',
      },
    }
  }

  const fileContents = fs.readFileSync(configPath, 'utf8')
  return JSON.parse(fileContents) as ContactoConfig
}

// Obtener el CV
export async function getCV(): Promise<CV | null> {
  const cvPath = path.join(contentDirectory, 'cv.md')

  if (!fs.existsSync(cvPath)) {
    return null
  }

  const fileContents = fs.readFileSync(cvPath, 'utf8')
  const { data, content } = matter(fileContents)

  const processedContent = await remark()
    .use(html)
    .process(content)
  const contentHtml = processedContent.toString()

  return {
    content: contentHtml,
    data: data as CV['data'],
  }
}

