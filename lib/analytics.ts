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

// Eventos específicos del portafolio
export const analytics = {
  // Fase 1: Eventos esenciales
  buttonClicked: (buttonText: string, buttonLocation: string, buttonVariant?: string) => {
    trackEvent('button_clicked', {
      button_text: buttonText,
      button_location: buttonLocation,
      button_variant: buttonVariant,
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

  contactFormSubmitted: (status: 'success' | 'error', hasName: boolean, hasEmail: boolean) => {
    trackEvent('contact_form_submitted', {
      form_status: status,
      has_name: hasName,
      has_email: hasEmail,
    })
  },

  cvDownloaded: (sourcePage: string) => {
    trackEvent('cv_downloaded', {
      source_page: sourcePage,
    })
  },

  // Fase 2: Eventos recomendados
  filterApplied: (filterType: string, projectsCount: number) => {
    trackEvent('filter_applied', {
      filter_type: filterType,
      projects_count: projectsCount,
    })
  },

  externalLinkClicked: (linkType: string, linkUrl: string) => {
    trackEvent('external_link_clicked', {
      link_type: linkType,
      link_url: linkUrl,
    })
  },

  loadMoreClicked: (currentCount: number, filterActive: string) => {
    trackEvent('load_more_clicked', {
      current_count: currentCount,
      filter_active: filterActive,
    })
  },

  // Fase 3: Eventos opcionales
  sectionViewed: (sectionName: string) => {
    trackEvent('section_viewed', {
      section_name: sectionName,
    })
  },

  videoPlayed: (projectSlug: string, videoUrl: string) => {
    trackEvent('video_played', {
      project_slug: projectSlug,
      video_url: videoUrl,
    })
  },

  scrollDepth: (page: string, depthPercentage: number) => {
    trackEvent('scroll_depth', {
      page,
      depth_percentage: depthPercentage,
    })
  },
}
