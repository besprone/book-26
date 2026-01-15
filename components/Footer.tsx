'use client'

import Logo from './Logo'
import { Mail, Linkedin, Github } from 'lucide-react'
import { getPostHog } from '@/lib/posthog'

export default function Footer() {
  const handleExternalLinkClick = (linkType: string, linkUrl: string) => {
    if (typeof window !== 'undefined') {
      try {
        const posthog = getPostHog()
        if (posthog && (posthog as any).__loaded) {
          posthog.capture('external_link_clicked', {
            link_type: linkType,
            link_url: linkUrl,
          })
        }
      } catch (e) {}
    }
  }

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="text-gray-600 dark:text-gray-400">
              <Logo />
            </div>
          </div>
          
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a
              href={`mailto:besprone@gmail.com?subject=${encodeURIComponent('Consulta desde portafolio')}&body=${encodeURIComponent('Hola Marco,\n\nMe gustaría contactarte para...')}`}
              onClick={() => handleExternalLinkClick('email', 'mailto:besprone@gmail.com')}
              className="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition"
              aria-label="Email"
            >
              <Mail className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/marco-antonio-de-castilla-vicelis-a91863108/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleExternalLinkClick('linkedin', 'https://www.linkedin.com/in/marco-antonio-de-castilla-vicelis-a91863108/')}
              className="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://github.com/besprone"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleExternalLinkClick('github', 'https://github.com/besprone')}
              className="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Copyright © {new Date().getFullYear()} Besprone. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  )
}

