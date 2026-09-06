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
import { defaultLocale, type Locale } from './i18n'

const contentDirectory = path.join(process.cwd(), 'content')

// Re-export para no romper los imports existentes de tipos desde este módulo
export type { CV, HomeConfig, Proyecto, SobreMiConfig }

/**
 * Carpeta de contenido de un idioma. El español vive en la raíz de content/
 * para que el flujo de edición de siempre no cambie; los demás idiomas van en
 * subcarpetas (content/en/).
 */
function dirContenido(locale: Locale): string {
  return locale === defaultLocale ? contentDirectory : path.join(contentDirectory, locale)
}

/**
 * Ruta de un archivo de contenido, con respaldo al español si la traducción
 * todavía no existe. Así, al añadir un proyecto nuevo y olvidar traducirlo, el
 * caso sigue apareciendo (en español) en vez de desaparecer sin aviso.
 */
function rutaContenido(locale: Locale, ...partes: string[]): string {
  const propia = path.join(dirContenido(locale), ...partes)
  if (fs.existsSync(propia)) return propia
  return path.join(contentDirectory, ...partes)
}

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
export function getHomeConfig(locale: Locale = defaultLocale): HomeConfig {
  const configPath = rutaContenido(locale, 'config.json')
  
  if (!fs.existsSync(configPath)) {
    // Configuración por defecto si no existe el archivo
    return {
      hero: {
        title: 'Diseñador de producto con visión técnica y enfoque en datos',
        description: 'Combino UX, desarrollo y análisis para crear experiencias útiles, funcionales y medibles',
        buttons: {
          primary: { text: 'Ver proyectos', href: '/proyectos', variant: 'secondary' },
          secondary: { text: 'Contáctame', href: '/contacto', variant: 'primary' },
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
          primary: { text: 'Ver proyectos', href: '/proyectos', variant: 'secondary' },
          secondary: { text: 'Contáctame', href: '/contacto', variant: 'primary' },
        },
      },
    }
  }

  const fileContents = fs.readFileSync(configPath, 'utf8')
  return JSON.parse(fileContents) as HomeConfig
}

// Obtener la configuración de Sobre Mí
export function getSobreMiConfig(locale: Locale = defaultLocale): SobreMiConfig {
  const configPath = rutaContenido(locale, 'sobre-mi.json')
  
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
          primary: { text: 'Ver proyectos', href: '/proyectos', variant: 'secondary' },
          secondary: { text: 'Contáctame', href: '/contacto', variant: 'primary' },
        },
      },
    }
  }

  const fileContents = fs.readFileSync(configPath, 'utf8')
  return JSON.parse(fileContents) as SobreMiConfig
}

// Obtener todos los proyectos, del más reciente al más antiguo
export function getAllProyectos(locale: Locale = defaultLocale): Proyecto[] {
  // La lista de slugs siempre sale del español: es la fuente de verdad de qué
  // proyectos existen. Cada uno se lee luego en su idioma, con respaldo.
  const indice = path.join(contentDirectory, 'proyectos')
  if (!fs.existsSync(indice)) {
    return []
  }

  return fs
    .readdirSync(indice)
    .filter((name) => name.endsWith('.json'))
    .map((fileName) => {
      const slug = fileName.replace(/\.json$/, '')
      const data = JSON.parse(
        fs.readFileSync(rutaContenido(locale, 'proyectos', fileName), 'utf8')
      )
      return normalizeProyecto(slug, data)
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

// Obtener un proyecto por slug
export async function getProyectoBySlug(
  slug: string,
  locale: Locale = defaultLocale
): Promise<Proyecto | null> {
  const fullPath = rutaContenido(locale, 'proyectos', `${slug}.json`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  return normalizeProyecto(slug, JSON.parse(fs.readFileSync(fullPath, 'utf8')))
}

// Obtener la configuración de Contacto
export function getContactoConfig(locale: Locale = defaultLocale): ContactoConfig {
  const configPath = rutaContenido(locale, 'contacto.json')
  
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
          variant: 'secondary' as const,
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
export async function getCV(locale: Locale = defaultLocale): Promise<CV | null> {
  const cvPath = rutaContenido(locale, 'cv.md')

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

