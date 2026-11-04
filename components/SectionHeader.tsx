import Button from './Button'

interface SectionHeaderProps {
  title: string
  actionLabel?: string
  actionHref?: string
  className?: string
  sectionName?: string
}

export default function SectionHeader({
  title,
  actionLabel,
  actionHref,
  className = '',
  sectionName,
}: SectionHeaderProps) {
  return (
    <div className={`flex justify-between items-center gap-4 mb-7 md:mb-12 ${className}`}>
      <h2 className="text-[28px] md:text-[40px] font-normal leading-tight text-gray-900 dark:text-white">
        {title}
      </h2>
      {actionLabel && actionHref && (
        <Button 
          href={actionHref} 
          variant="ghost" 
          size="md"
          ctaType="section_cta"
          sectionName={sectionName}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}



