'use client'

import { useState, useRef } from 'react'
import type { ContactoConfig } from '@/lib/types'
import { getPostHog } from '@/lib/posthog'

interface ContactFormProps {
  config: ContactoConfig
}

export default function ContactForm({ config }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [formLoadTime] = useState(() => Date.now()) // Timestamp cuando se carga el formulario
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

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
          form_load_time: formLoadTime, // Timestamp para validar tiempo mínimo
        }),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
        try {
          const posthog = getPostHog()
          if (posthog && (posthog as any).__loaded) {
            posthog.capture('contact_form_submitted', {
              form_status: 'success',
              has_name: !!formData.name,
              has_email: !!formData.email,
            })
          }
        } catch (e) {}
      } else {
        setStatus('error')
        try {
          const posthog = getPostHog()
          if (posthog && (posthog as any).__loaded) {
            posthog.capture('contact_form_submitted', {
              form_status: 'error',
              has_name: !!formData.name,
              has_email: !!formData.email,
            })
          }
        } catch (e) {}
      }
    } catch (error) {
      setStatus('error')
      try {
        const posthog = getPostHog()
        if (posthog && (posthog as any).__loaded) {
          posthog.capture('contact_form_submitted', {
            form_status: 'error',
            has_name: !!formData.name,
            has_email: !!formData.email,
          })
        }
      } catch (e) {}
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

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base inline-flex items-center justify-center"
      >
        {status === 'loading' ? config.form.submitButton.loadingText : config.form.submitButton.text}
      </button>

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
            {config.form.messages.error}
          </p>
        </div>
      )}
    </form>
  )
}
