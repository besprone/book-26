import { getContactoConfig } from '@/lib/markdown'
import { type Locale } from '@/lib/i18n'
import Button from '@/components/Button'
import ContactForm from '@/components/ContactForm'
import DirectChannels from '@/components/DirectChannels'
import ScrollDepthTracker from '@/components/ScrollDepthTracker'
import SectionViewTracker from '@/components/SectionViewTracker'

export default function ContactPage({ locale }: { locale: Locale }) {
  const config = getContactoConfig(locale)

  return (
    <div className="bg-white dark:bg-gray-900">
      <ScrollDepthTracker />
      {/* Los paneles van a todo el ancho y el contenido se alinea con el header. */}
      <section className="grid grid-cols-1 lg:grid-cols-2 relative">
        <SectionViewTracker sectionName="contacto" className="absolute top-0 left-0 w-full h-1" />
        <div className="bg-primary-500 text-white lg:flex lg:justify-end">
          <div className="w-full lg:max-w-[640px] px-4 sm:px-6 lg:pl-8 lg:pr-10 xl:pr-[72px] pt-12 pb-12 lg:pt-24 lg:pb-24">
            <h1 className="text-[40px] lg:text-[64px] font-semibold leading-[1.08]">{config.hero.title}</h1>
            <p className="mt-7 text-xl leading-snug">{config.hero.description}</p>
            <DirectChannels locale={locale} />
          </div>
        </div>

        <div className="lg:flex lg:justify-start">
          <div className="w-full lg:max-w-[640px] px-4 sm:px-6 lg:pl-10 xl:pl-[72px] lg:pr-8 pt-12 pb-12 lg:pt-24 lg:pb-24">
            <h2 className="text-[28px] md:text-[40px] font-normal leading-tight mb-5 text-gray-900 dark:text-white">
              {config.form.title}
            </h2>
            <ContactForm config={config} />
          </div>
        </div>
      </section>

      <section className="bg-[#172130] text-white relative">
        <SectionViewTracker sectionName="cta" className="absolute top-0 left-0 w-full h-1" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-[88px] text-center">
          <h2 className="text-[30px] md:text-5xl font-semibold leading-[1.08] text-balance">{config.cta.title}</h2>
          <div className="mt-6">
            <Button
              href={config.cta.button.href}
              variant={config.cta.button.variant}
              size="lg"
              ctaType="cta_section"
              sectionName="cta"
            >
              {config.cta.button.text}
            </Button>
          </div>
          <p className="mt-6 text-xl leading-snug max-w-[47.5rem] mx-auto">{config.final.text}</p>
        </div>
      </section>
    </div>
  )
}


