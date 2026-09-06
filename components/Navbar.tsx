'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import IconButton from './IconButton'
import Logo from './Logo'
import NavLink from './NavLink'
import MobileMenu from './MobileMenu'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'
import { rutas, t, type Locale } from '@/lib/i18n'

export default function Navbar({ locale }: { locale: Locale }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const txt = t(locale)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const menuItems = [
    { href: rutas.home[locale], label: txt.nav.home },
    { href: rutas.sobreMi[locale], label: txt.nav.sobreMi },
    { href: rutas.proyectos[locale], label: txt.nav.proyectos },
    { href: rutas.contacto[locale], label: txt.nav.contacto },
  ]

  return (
    <>
      <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo href={rutas.home[locale]} />

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {menuItems.map((item) => (
                <NavLink key={item.href} href={item.href} variant="desktop">
                  {item.label}
                </NavLink>
              ))}
              <LanguageToggle locale={locale} />
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <IconButton
              onClick={toggleMenu}
              icon={isMenuOpen ? X : Menu}
              label={isMenuOpen ? txt.cerrarMenu : txt.abrirMenu}
              className="md:hidden"
            />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        menuItems={menuItems}
        locale={locale}
      />
    </>
  )
}
