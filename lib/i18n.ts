export const locales = ['es', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'es'

/**
 * Rutas equivalentes entre idiomas.
 *
 * El español vive en la raíz para no romper las URLs ya publicadas ni la
 * indexación existente. El inglés usa rutas en inglés, no el slug español con
 * prefijo: `/en/projects` en vez de `/en/proyectos`.
 *
 * Los slugs de proyecto NO se traducen: son la identidad del caso y traducirlos
 * obligaría a mantener un mapa aparte y rompería los enlaces si se renombraran.
 */
export const rutas = {
  home: { es: '/', en: '/en' },
  proyectos: { es: '/proyectos', en: '/en/work' },
  sobreMi: { es: '/sobre-mi', en: '/en/about' },
  contacto: { es: '/contacto', en: '/en/contact' },
} as const

export type ClaveRuta = keyof typeof rutas

/** Ruta de un proyecto concreto en el idioma dado. */
export function rutaProyecto(locale: Locale, slug: string): string {
  return `${rutas.proyectos[locale]}/${slug}`
}

/**
 * Dada una ruta actual, devuelve la equivalente en el otro idioma.
 * Se usa en el selector de idioma: sin esto, cambiar de idioma te mandaría
 * siempre al inicio y perderías la página que estabas leyendo.
 */
export function rutaEquivalente(pathname: string, destino: Locale): string {
  const origen: Locale = destino === 'en' ? 'es' : 'en'

  // Detalle de proyecto: se conserva el slug
  const prefijoProyectos = rutas.proyectos[origen]
  if (pathname.startsWith(`${prefijoProyectos}/`)) {
    const slug = pathname.slice(prefijoProyectos.length + 1)
    if (slug) return rutaProyecto(destino, slug)
  }

  const clave = (Object.keys(rutas) as ClaveRuta[]).find(
    (k) => rutas[k][origen] === pathname
  )

  return clave ? rutas[clave][destino] : rutas.home[destino]
}

/** Textos de interfaz. El contenido editorial vive en content/. */
const textos = {
  es: {
    nav: { home: 'Home', sobreMi: 'Sobre mí', proyectos: 'Proyectos', contacto: 'Contacto' },
    saltarContenido: 'Saltar al contenido',
    abrirMenu: 'Abrir menú',
    cerrarMenu: 'Cerrar menú',
    temaOscuro: 'Tema oscuro',
    aTemaClaro: 'Cambiar a tema claro',
    aTemaOscuro: 'Cambiar a tema oscuro',
    cambiarIdioma: 'Ver esta página en inglés',
    proyecto: {
      volver: 'Volver a proyectos',
      cliente: 'Cliente/Empresa:',
      anio: 'Año:',
      rol: 'Rol:',
      tags: 'Tags:',
      reto: 'El reto',
      proceso: 'Proceso',
      investigacion: 'Investigación',
      diseno: 'Diseño',
      desarrollo: 'Desarrollo / Automatización',
      analisisDatos: 'Análisis de datos',
      rolYHerramientas: 'Rol y herramientas',
      soloRol: 'Rol',
      herramientas: 'Herramientas',
      resultados: 'Resultados',
      aprendizajes: 'Aprendizajes',
      enDesarrollo: 'Proyecto en desarrollo...',
      ctaTitulo: '¿Te gustó este proyecto?',
      videoDe: (t: string) => `Video del proyecto ${t}`,
    },
    proyectos: {
      titulo: 'Proyectos',
      intro:
        'Una selección de proyectos donde he combinado diseño, desarrollo y análisis para resolver problemas reales. Puedes filtrar por tipo para explorar casos más específicos.',
      filtroTodo: 'Todo',
      verMas: 'Ver más proyectos',
      sinResultados: 'No hay proyectos con el filtro seleccionado.',
      vacio: 'No hay proyectos aún. Agrega archivos JSON en la carpeta',
      destacado: 'Destacado',
      verCaso: 'Ver caso',
    },
    error: {
      titulo: 'Algo salió mal',
      texto:
        'Hubo un problema al cargar esta página. Puedes intentarlo de nuevo o volver al inicio.',
      reintentar: 'Intentar de nuevo',
      inicio: 'Volver al inicio',
    },
    noEncontrado: {
      titulo: 'Página no encontrada',
      texto: 'La página que buscas no existe o cambió de dirección.',
      verProyectos: 'Ver proyectos',
      inicio: 'Volver al inicio',
    },
    imagen: { error: 'Error al cargar imagen', placeholder: 'Ilustración placeholder' },
  },
  en: {
    nav: { home: 'Home', sobreMi: 'About', proyectos: 'Work', contacto: 'Contact' },
    saltarContenido: 'Skip to content',
    abrirMenu: 'Open menu',
    cerrarMenu: 'Close menu',
    temaOscuro: 'Dark theme',
    aTemaClaro: 'Switch to light theme',
    aTemaOscuro: 'Switch to dark theme',
    cambiarIdioma: 'Ver esta página en español',
    proyecto: {
      volver: 'Back to work',
      cliente: 'Client:',
      anio: 'Year:',
      rol: 'Role:',
      tags: 'Tags:',
      reto: 'The challenge',
      proceso: 'Process',
      investigacion: 'Research',
      diseno: 'Design',
      desarrollo: 'Development / Automation',
      analisisDatos: 'Data analysis',
      rolYHerramientas: 'Role and tools',
      soloRol: 'Role',
      herramientas: 'Tools',
      resultados: 'Outcomes',
      aprendizajes: 'What I learned',
      enDesarrollo: 'Project in progress...',
      ctaTitulo: 'Liked this project?',
      videoDe: (t: string) => `${t} project video`,
    },
    proyectos: {
      titulo: 'Work',
      intro:
        'A selection of projects where I combined design, development and analysis to solve real problems. Filter by type to explore specific cases.',
      filtroTodo: 'All',
      verMas: 'Load more projects',
      sinResultados: 'No projects match the selected filter.',
      vacio: 'No projects yet. Add JSON files to the folder',
      destacado: 'Featured',
      verCaso: 'View case study',
    },
    error: {
      titulo: 'Something went wrong',
      texto: 'There was a problem loading this page. You can try again or go back home.',
      reintentar: 'Try again',
      inicio: 'Back to home',
    },
    noEncontrado: {
      titulo: 'Page not found',
      texto: "The page you're looking for doesn't exist or has moved.",
      verProyectos: 'View work',
      inicio: 'Back to home',
    },
    imagen: { error: 'Failed to load image', placeholder: 'Illustration placeholder' },
  },
} as const

export function t(locale: Locale) {
  return textos[locale]
}
