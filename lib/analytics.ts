import { getPostHog } from './posthog'
import type { Locale } from './i18n'

/**
 * Registra el idioma como propiedad global: a partir de aquí TODOS los eventos
 * la llevan sin tener que pasarla en cada llamada. Es lo que permite segmentar
 * cualquier métrica por idioma sin tocar el resto del código.
 */
export const registrarIdioma = (locale: Locale) => {
  if (typeof window === 'undefined') return
  getPostHog()
    .then((posthog) => posthog?.register({ site_locale: locale }))
    .catch(() => {})
}

// --- Atribución del formulario de contacto -------------------------------
// Guarda en la sesión qué proyectos ha visto la visita, para poder responder
// la pregunta que importa: qué caso de estudio genera contactos.

const CLAVE_ULTIMO = 'ultimo_proyecto_visto'
const CLAVE_CUENTA = 'proyectos_vistos'

export const recordarProyectoVisto = (slug: string, title: string) => {
  if (typeof window === 'undefined') return
  try {
    const vistos: string[] = JSON.parse(sessionStorage.getItem(CLAVE_CUENTA) || '[]')
    if (!vistos.includes(slug)) {
      vistos.push(slug)
      sessionStorage.setItem(CLAVE_CUENTA, JSON.stringify(vistos))
    }
    sessionStorage.setItem(CLAVE_ULTIMO, JSON.stringify({ slug, title }))
  } catch (error) {
    // Modo privado o almacenamiento bloqueado: se pierde la atribución,
    // pero el evento de contacto se sigue enviando igual.
  }
}

export const atribucionProyecto = () => {
  if (typeof window === 'undefined') return {}
  try {
    const ultimo = sessionStorage.getItem(CLAVE_ULTIMO)
    const vistos: string[] = JSON.parse(sessionStorage.getItem(CLAVE_CUENTA) || '[]')
    const u = ultimo ? JSON.parse(ultimo) : null
    return {
      ultimo_proyecto_slug: u?.slug,
      ultimo_proyecto_titulo: u?.title,
      proyectos_vistos: vistos.length,
    }
  } catch (error) {
    return {}
  }
}

// Helper para trackear eventos de forma segura.
// getPostHog() carga posthog-js bajo demanda, así que este módulo no arrastra
// la librería al bundle inicial aunque lo importen componentes como Button.
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window === 'undefined') return

  getPostHog()
    .then((posthog) => posthog?.capture(eventName, properties))
    .catch(() => {
      // Silenciar errores si posthog no está disponible
    })
}

// Tipos para CTA
export type CTAType = 
  | 'header_menu' 
  | 'header_logo' 
  | 'hero_primary' 
  | 'hero_secondary' 
  | 'section_cta' 
  | 'footer_social' 
  | 'footer_logo' 
  | 'filter' 
  | 'form_submit' 
  | 'cta_section'
  | 'cv_download'

// Eventos específicos del portafolio
export const analytics = {
  // Evento principal unificado para todos los CTAs
  ctaClicked: (
    ctaName: string,
    ctaType: CTAType,
    ctaLocation: string,
    ctaDestination?: string,
    sectionName?: string
  ) => {
    trackEvent('cta_clicked', {
      cta_name: ctaName,
      cta_type: ctaType,
      cta_location: ctaLocation,
      cta_destination: ctaDestination || 'unknown',
      section_name: sectionName || 'unknown',
    })
  },

  projectViewed: (projectSlug: string, projectTitle: string, projectType?: string[]) => {
    trackEvent('project_viewed', {
      project_slug: projectSlug,
      project_title: projectTitle,
      project_type: projectType,
    })
  },


  contactFormSubmitted: (
    status: 'success' | 'error',
    params: {
      time_to_submit?: number // segundos desde carga hasta envío
      message_length?: number // longitud del mensaje en caracteres
      submission_attempts?: number // número de intentos previos
      device_type?: 'mobile' | 'desktop' | 'tablet'
      referrer?: string // página de origen
      time_on_page?: number // tiempo total en la página
      has_name?: boolean
      has_email?: boolean
    }
  ) => {
    const eventData = {
      form_status: status,
      // Qué caso de estudio venía leyendo antes de escribir
      ...atribucionProyecto(),
      time_to_submit: params.time_to_submit,
      message_length: params.message_length,
      submission_attempts: params.submission_attempts || 1,
      device_type: params.device_type,
      referrer: params.referrer,
      time_on_page: params.time_on_page,
      has_name: params.has_name,
      has_email: params.has_email,
    }
    
    // Log temporal para debug (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Contact Form Submitted:', eventData)
    }
    
    trackEvent('contact_form_submitted', eventData)
  },

  cvDownloaded: (sourcePage: string) => {
    trackEvent('cv_downloaded', {
      source_page: sourcePage,
    })
  },

  // Eventos de navegación y filtros
  filterApplied: (filterType: string, projectsCount: number) => {
    trackEvent('filter_applied', {
      filter_type: filterType,
      projects_count: projectsCount,
    })
  },


  // Eventos de engagement
  sectionViewed: (sectionName: string, page: string) => {
    trackEvent('section_viewed', {
      section_name: sectionName,
      page,
    })
  },

  scrollDepth: (page: string, depthPercentage: number) => {
    trackEvent('scroll_depth', {
      page,
      depth_percentage: depthPercentage,
    })
  },


  videoPlayed: (projectSlug: string, videoUrl: string) => {
    trackEvent('video_played', {
      project_slug: projectSlug,
      video_url: videoUrl,
    })
  },
}
