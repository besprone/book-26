'use client'

import Button from './Button'
import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
  return (
    <Button
      href="/proyectos"
      variant="ghost"
      size="md"
      ctaType="section_cta"
      sectionName="proyecto_detalle"
      icon={ArrowLeft}
      iconPosition="left"
    >
      Volver a proyectos
    </Button>
  )
}
