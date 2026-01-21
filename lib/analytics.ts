import { getPostHog } from './posthog'

// Helper para trackear eventos de forma segura
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window === 'undefined') return
  
  try {
    const posthog = getPostHog()
    if (posthog && (posthog as any).__loaded) {
      posthog.capture(eventName, properties)
    }
  } catch (error) {
    // Silenciar errores si posthog no está disponible
  }
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

  projectClicked: (projectSlug: string, projectTitle: string, sourcePage: string) => {
    trackEvent('project_clicked', {
      project_slug: projectSlug,
      project_title: projectTitle,
      source_page: sourcePage,
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

  loadMoreClicked: (currentCount: number, filterActive: string) => {
    trackEvent('load_more_clicked', {
      current_count: currentCount,
      filter_active: filterActive,
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

  experienceSectionScrolled: (scrollPercentage: number) => {
    trackEvent('experience_section_scrolled', {
      scroll_percentage: scrollPercentage,
    })
  },

  videoPlayed: (projectSlug: string, videoUrl: string) => {
    trackEvent('video_played', {
      project_slug: projectSlug,
      video_url: videoUrl,
    })
  },
}
