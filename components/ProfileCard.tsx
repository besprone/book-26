import Card from './Card'
import { Lightbulb } from 'lucide-react'

interface ProfileCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  iconColor?: 'primary' | 'accent' | 'green'
}

export default function ProfileCard({
  title,
  description,
  icon,
  iconColor = 'primary',
}: ProfileCardProps) {
  const colorClasses = {
    primary: 'bg-primary-500/8 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400',
    accent: 'bg-accent-500/8 dark:bg-accent-500/15 text-accent-500 dark:text-accent-400',
    green: 'bg-green-500/8 dark:bg-green-500/15 text-green-600 dark:text-green-400',
  }

  const defaultIcon = (
    <Lightbulb className="w-8 h-8" />
  )

  return (
    <Card hover className="p-6">
      <div className="mb-4">
        <div className={`w-16 h-16 ${colorClasses[iconColor]} rounded-xl flex items-center justify-center mb-4`}>
          {icon || defaultIcon}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </Card>
  )
}


