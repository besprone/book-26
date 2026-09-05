'use client'

import { Linkedin, Mail, ArrowUpRight } from 'lucide-react'
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
      icono: Linkedin,
      etiqueta: txt.linkedin,
      pie: txt.linkedinPie,
      href: siteConfig.linkedin,
      externo: true,
      nombre: 'LinkedIn',
    },
    {
      icono: Mail,
      etiqueta: txt.email,
      pie: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
      externo: false,
      nombre: 'Email',
    },
  ]

  return (
    <div className="mt-10">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {txt.titulo}
      </h2>
      <p className="mt-1 text-gray-600 dark:text-gray-400">{txt.intro}</p>

      <ul className="mt-5 space-y-3">
        {canales.map((c) => {
          const Icono = c.icono
          return (
            <li key={c.nombre}>
              <a
                href={c.href}
                {...(c.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={() => registrar(c.nombre, c.href)}
                className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4
                  transition hover:border-primary-300 hover:shadow-sm
                  dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-800
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-500/15 dark:text-primary-400">
                  <Icono className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-gray-900 dark:text-white">
                    {c.etiqueta}
                  </span>
                  {/* truncate: el correo y la URL del perfil son largos en móvil */}
                  <span className="block truncate text-sm text-gray-600 dark:text-gray-400">
                    {c.pie}
                  </span>
                </span>
                <ArrowUpRight
                  className="h-4 w-4 flex-shrink-0 text-gray-400 transition group-hover:text-primary-500 dark:group-hover:text-primary-400"
                  aria-hidden="true"
                />
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
