// Tipos compartidos para uso en componentes cliente y servidor

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
