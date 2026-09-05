'use client'

import Button from './Button'
import { ArrowLeft } from 'lucide-react'
import { rutas, t, type Locale } from '@/lib/i18n'

export default function BackButton({ locale }: { locale: Locale }) {
  return (
    <Button
      href={rutas.proyectos[locale]}
      variant="ghost"
      size="md"
      ctaType="section_cta"
      sectionName="proyecto_detalle"
      icon={ArrowLeft}
      iconPosition="left"
    >
      {t(locale).proyecto.volver}
    </Button>
  )
}
