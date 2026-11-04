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
      migas: 'Ruta de navegación',
      cliente: 'Cliente/Empresa:',
      anio: 'Año:',
      rol: 'Rol:',
      // Antecede al rol en la cabecera, donde ya no es un par
      // etiqueta/valor en línea sino el subtítulo de la ficha.
      miRol: 'Mi rol',
      tags: 'Tags:',
      reto: 'El reto',
      proceso: 'Proceso',
      investigacion: 'Investigación',
      diseno: 'Diseño',
      desarrollo: 'Desarrollo',
      analisisDatos: 'Análisis de datos',
      rolYHerramientas: 'Rol y herramientas',
      soloRol: 'Rol',
      herramientas: 'Herramientas',
      resultados: 'Resultados',
      aprendizajes: 'Aprendizajes',
      enDesarrollo: 'Proyecto en desarrollo...',
      ctaTitulo: '¿Te gustó este proyecto?',
      videoDe: (t: string) => `Video del proyecto ${t}`,
      verVideo: (t: string) => `Reproducir el video de ${t}`,
    },
    proyectos: {
      titulo: 'Proyectos',
      intro:
        'Casos en los que diseñé, prototipé en código o analicé datos, casi todos en fintech. Filtra por UX, Dev o Data.',
      filtroTodo: 'Todo',
      verMas: 'Ver más proyectos',
      sinResultados: 'No hay proyectos con el filtro seleccionado.',
      vacio: 'No hay proyectos aún. Agrega archivos JSON en la carpeta',
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
    directo: {
      titulo: 'O escríbeme directo',
      linkedin: 'Conectemos en LinkedIn',
      linkedinPie: 'Ver perfil profesional',
      email: 'Enviar un correo',
    },
    pie: {
      derechos: 'Todos los derechos reservados.',
    },
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
      migas: 'Breadcrumb',
      cliente: 'Client:',
      anio: 'Year:',
      rol: 'Role:',
      miRol: 'My role',
      tags: 'Tags:',
      reto: 'The challenge',
      proceso: 'Process',
      investigacion: 'Research',
      diseno: 'Design',
      desarrollo: 'Development',
      analisisDatos: 'Data analysis',
      rolYHerramientas: 'Role and tools',
      soloRol: 'Role',
      herramientas: 'Tools',
      resultados: 'Outcomes',
      aprendizajes: 'What I learned',
      enDesarrollo: 'Project in progress...',
      ctaTitulo: 'Liked this project?',
      videoDe: (t: string) => `${t} project video`,
      verVideo: (t: string) => `Play the video for ${t}`,
    },
    proyectos: {
      titulo: 'Work',
      intro:
        'Cases where I designed, prototyped in code or analyzed data, most of them in fintech. Filter by UX, Dev or Data.',
      filtroTodo: 'All',
      verMas: 'Load more projects',
      sinResultados: 'No projects match the selected filter.',
      vacio: 'No projects yet. Add JSON files to the folder',
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
    directo: {
      titulo: 'Or reach me directly',
      linkedin: "Let's connect on LinkedIn",
      linkedinPie: 'View professional profile',
      email: 'Send an email',
    },
    pie: {
      derechos: 'All rights reserved.',
    },
  },
} as const

export function t(locale: Locale) {
  return textos[locale]
}
