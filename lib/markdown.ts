import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import type {
  CV,
  ContactoConfig,
  HomeConfig,
  Proyecto,
  SobreMiConfig,
} from './types'

const contentDirectory = path.join(process.cwd(), 'content')

// Re-export para no romper los imports existentes de tipos desde este módulo
export type { CV, HomeConfig, Proyecto, SobreMiConfig }

const proyectosDirectory = path.join(contentDirectory, 'proyectos')

/**
 * Convierte el JSON crudo de un proyecto en un Proyecto con los valores por
 * defecto aplicados. Lo usan getAllProyectos y getProyectoBySlug, que antes
 * repetían este mismo mapeo de 20 líneas cada una.
 */
function normalizeProyecto(slug: string, data: Record<string, any>): Proyecto {
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
    // Si no hay `year` explícito se deriva de la fecha
    year: data.year || (data.date ? new Date(data.date).getFullYear().toString() : ''),
    role: data.role,
    reto: data.reto,
    videoYoutube: data.videoYoutube,
    proceso: data.proceso,
    rolYHerramientas: data.rolYHerramientas,
    resultados: data.resultados,
    resultadosImages: data.resultadosImages || [],
    aprendizajes: data.aprendizajes,
    images: data.images,
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

// Obtener todos los proyectos, del más reciente al más antiguo
export function getAllProyectos(): Proyecto[] {
  if (!fs.existsSync(proyectosDirectory)) {
    return []
  }

  return fs
    .readdirSync(proyectosDirectory)
    .filter((name) => name.endsWith('.json'))
    .map((fileName) => {
      const slug = fileName.replace(/\.json$/, '')
      const data = JSON.parse(
        fs.readFileSync(path.join(proyectosDirectory, fileName), 'utf8')
      )
      return normalizeProyecto(slug, data)
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

// Obtener un proyecto por slug
export async function getProyectoBySlug(slug: string): Promise<Proyecto | null> {
  const fullPath = path.join(proyectosDirectory, `${slug}.json`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  return normalizeProyecto(slug, JSON.parse(fs.readFileSync(fullPath, 'utf8')))
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

