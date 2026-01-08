import Button from './Button'

interface SectionHeaderProps {
  title: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export default function SectionHeader({
  title,
  actionLabel,
  actionHref,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`flex justify-between items-center mb-12 ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      {actionLabel && actionHref && (
        <Button href={actionHref} variant="ghost" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}



