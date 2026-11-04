import Button from '@/components/Button'
import SectionViewTracker from '@/components/SectionViewTracker'
import type { VarianteBoton } from '@/lib/estilos-boton'

interface BotonCierre {
  text: string
  href: string
  variant: VarianteBoton
}

interface BandaCierreProps {
  title: string
  buttons: { primary: BotonCierre; secondary: BotonCierre }
}

/** Banda de color que cierra una página, con su invitación y dos botones. */
export default function BandaCierre({ title, buttons }: BandaCierreProps) {
  return (
    <section className="bg-primary-500 text-white py-12 md:py-24 relative">
      <SectionViewTracker sectionName="cta" className="absolute top-0 left-0 w-full h-1" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-[34px] md:text-[56px] font-semibold leading-[1.12] mb-8 text-balance">{title}</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {[buttons.primary, buttons.secondary].map((boton) => (
            <Button
              key={boton.href}
              href={boton.href}
              variant={boton.variant}
              size="lg"
              ctaType="cta_section"
              sectionName="cta"
            >
              {boton.text}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
