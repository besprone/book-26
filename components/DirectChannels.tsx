'use client'

import { usePathname } from 'next/navigation'
import { analytics } from '@/lib/analytics'
import { siteConfig } from '@/lib/site'
import { t, type Locale } from '@/lib/i18n'

/**
 * Vías de contacto directo, junto al formulario.
 *
 * Un reclutador suele preferir ver el perfil de LinkedIn o escribir un correo
 * antes que rellenar un formulario. Hasta ahora esos enlaces solo estaban en
 * el pie de página, así que había que buscarlos.
 */
export default function DirectChannels({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const txt = t(locale).directo

  const registrar = (nombre: string, destino: string) =>
    analytics.ctaClicked(nombre, 'footer_social', pathname || 'unknown', destino, 'contacto_directo')

  const canales = [
    {
      etiqueta: txt.linkedin,
      pie: txt.linkedinPie,
      href: siteConfig.linkedin,
      externo: true,
      nombre: 'LinkedIn',
    },
    {
      etiqueta: txt.email,
      pie: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
      externo: false,
      nombre: 'Email',
    },
  ]

  return (
    <div className="mt-7">
      <h2 className="text-xl font-normal leading-snug">{txt.titulo}</h2>
      <ul className="mt-3 space-y-3">
        {canales.map((c) => (
          <li key={c.nombre}>
            <a
              href={c.href}
              {...(c.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              onClick={() => registrar(c.nombre, c.href)}
              className="group block rounded-2xl bg-white px-5 py-4 transition duration-motion-base hover:bg-primary-50
                dark:bg-gray-900 dark:hover:bg-gray-800
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-500"
            >
              <span className="block text-base text-gray-900 dark:text-white">{c.etiqueta}</span>
              {/* truncate: el correo y la URL del perfil son largos en móvil */}
              <span className="mt-1 block truncate text-sm text-gray-600 dark:text-gray-400">{c.pie}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
