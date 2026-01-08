'use client'

import { X } from 'lucide-react'
import Logo from './Logo'
import NavLink from './NavLink'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  menuItems: Array<{ href: string; label: string }>
}

export default function MobileMenu({ isOpen, onClose, menuItems }: MobileMenuProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ease-in-out md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-[60] transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
            <Logo />
            <button
              onClick={onClose}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition p-2"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-4">
              {menuItems.map((item, index) => (
                <li
                  key={item.href}
                  className={`transform transition-all duration-300 ease-out ${
                    isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: isOpen ? `${index * 50}ms` : '0ms' }}
                >
                  <NavLink
                    href={item.href}
                    onClick={onClose}
                    variant="mobile"
                    className="w-full"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
