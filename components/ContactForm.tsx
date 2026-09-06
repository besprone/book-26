'use client'

import { useState, useRef, useEffect } from 'react'
import type { ContactoConfig } from '@/lib/types'
import { analytics } from '@/lib/analytics'
import { usePathname } from 'next/navigation'
import TurnstileWidget, { reiniciarTurnstile } from './TurnstileWidget'
import Button from './Button'

interface ContactFormProps {
  config: ContactoConfig
}

// Función para detectar tipo de dispositivo
const getDeviceType = (): 'mobile' | 'desktop' | 'tablet' => {
  if (typeof window === 'undefined') return 'desktop'
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

export default function ContactForm({ config }: ContactFormProps) {
  const pathname = usePathname()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  // El API devuelve motivos concretos (rate limit con minutos restantes,
  // validaciones). Antes se descartaban y siempre se mostraba el texto genérico.
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submissionAttempts, setSubmissionAttempts] = useState(0)
  // Token de Turnstile. Queda null si no hay clave configurada, en cuyo caso
  // el servidor tampoco lo exige y el formulario funciona como siempre.
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const formLoadTime = useRef(Date.now()) // Timestamp cuando se carga el formulario
  const pageLoadTime = useRef(typeof window !== 'undefined' ? Date.now() : Date.now()) // Timestamp cuando se carga la página
  const formRef = useRef<HTMLFormElement>(null)

  // Trackear cuando se carga la página (solo una vez)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      pageLoadTime.current = Date.now()
    }
  }, [])

  // Llevar el foco al mensaje de resultado. Sin esto, quien navega con teclado
  // o lector de pantalla envía el formulario y no recibe ninguna señal.
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      statusRef.current?.focus()
    }
  }, [status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage(null)

    // Incrementar intentos de envío
    const currentAttempts = submissionAttempts + 1
    setSubmissionAttempts(currentAttempts)

    // Calcular métricas antes de enviar
    const submitTime = Date.now()
    const timeToSubmit = Math.round((submitTime - formLoadTime.current) / 1000) // en segundos
    const timeOnPage = Math.round((submitTime - pageLoadTime.current) / 1000) // en segundos
    const messageLength = formData.message.length
    const deviceType = getDeviceType()
    const referrer = typeof document !== 'undefined' ? document.referrer || 'direct' : 'unknown'

    // Obtener el valor del honeypot (debe estar vacío)
    const honeypotInput = formRef.current?.querySelector<HTMLInputElement>('input[name="company_website"]')
    const honeypotValue = honeypotInput?.value || ''

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          company_website: honeypotValue, // Campo honeypot
          form_load_time: formLoadTime.current, // Timestamp para validar tiempo mínimo
          turnstile_token: turnstileToken,
        }),
      })

      // El token es de un solo uso: haya ido bien o mal, hace falta uno nuevo
      reiniciarTurnstile()
      setTurnstileToken(null)

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
        setSubmissionAttempts(0) // Resetear intentos en éxito
        
        // Enviar evento de éxito con todos los parámetros
        analytics.contactFormSubmitted('success', {
          time_to_submit: timeToSubmit,
          message_length: messageLength,
          submission_attempts: currentAttempts,
          device_type: deviceType,
          referrer: referrer,
          time_on_page: timeOnPage,
          has_name: !!formData.name,
          has_email: !!formData.email,
        })
      } else {
        // Mostrar el motivo real que devuelve el API cuando lo hay
        const data = await response.json().catch(() => null)
        setErrorMessage(data?.error || config.form.messages.error)
        setStatus('error')

        // Enviar evento de error con todos los parámetros
        analytics.contactFormSubmitted('error', {
          time_to_submit: timeToSubmit,
          message_length: messageLength,
          submission_attempts: currentAttempts,
          device_type: deviceType,
          referrer: referrer,
          time_on_page: timeOnPage,
          has_name: !!formData.name,
          has_email: !!formData.email,
        })
      }
    } catch (error) {
      reiniciarTurnstile()
      setTurnstileToken(null)
      setErrorMessage(config.form.messages.error)
      setStatus('error')

      // Enviar evento de error con todos los parámetros
      analytics.contactFormSubmitted('error', {
        time_to_submit: timeToSubmit,
        message_length: messageLength,
        submission_attempts: currentAttempts,
        device_type: deviceType,
        referrer: referrer,
        time_on_page: timeOnPage,
        has_name: !!formData.name,
        has_email: !!formData.email,
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {config.form.fields.name.label}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition"
          placeholder={config.form.fields.name.placeholder}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {config.form.fields.email.label}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition"
          placeholder={config.form.fields.email.placeholder}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {config.form.fields.message.label}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition resize-none"
          placeholder={config.form.fields.message.placeholder}
        />
      </div>

      {/* Honeypot field - oculto para usuarios, visible para bots */}
      <div
        style={{
          position: 'absolute',
          left: '-9999px',
          opacity: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <label htmlFor="company_website">Company Website (leave blank)</label>
        <input
          type="text"
          id="company_website"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <TurnstileWidget onToken={setTurnstileToken} />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={status === 'loading'}
        ctaType="form_submit"
        sectionName="contacto"
      >
        {status === 'loading' ? config.form.submitButton.loadingText : config.form.submitButton.text}
      </Button>

      {/*
        El contenedor con aria-live existe siempre, aunque esté vacío: si se
        montara al mismo tiempo que aparece el texto, muchos lectores de
        pantalla no anuncian el cambio. `tabIndex={-1}` permite enfocarlo por
        código sin meterlo en el orden de tabulación.
      */}
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="focus:outline-none"
      >
        {status === 'success' && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-green-800 dark:text-green-200 text-sm">
              {config.form.messages.success}
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 text-sm">
              {errorMessage || config.form.messages.error}
            </p>
          </div>
        )}
      </div>
    </form>
  )
}
