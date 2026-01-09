import Card from './Card'
import Badge from './Badge'
import { GraduationCap, Award } from 'lucide-react'

interface EducationCardProps {
  nombre: string
  institucion: string
  año: string
  variant?: 'default' | 'highlighted'
  icon?: React.ReactNode
}

export default function EducationCard({
  nombre,
  institucion,
  año,
  variant = 'default',
  icon,
}: EducationCardProps) {
  const isHighlighted = variant === 'highlighted'
  const isCursando = año.toLowerCase().includes('cursando')

  // Icono por defecto si no se proporciona uno personalizado
  const defaultIcon = isHighlighted ? (
    <GraduationCap className="w-7 h-7 text-accent-600 dark:text-accent-400" />
  ) : (
    <Award className="w-6 h-6 text-primary-500 dark:text-primary-400" />
  )

  return (
    <Card hover className={isHighlighted ? 'p-6' : 'p-5'}>
      <div className="flex items-start gap-4">
        {/* Icono */}
        <div className={`flex-shrink-0 ${
          isHighlighted 
            ? 'w-14 h-14 bg-accent-50 dark:bg-accent-500/15 rounded-xl flex items-center justify-center'
            : 'w-12 h-12 bg-primary-50 dark:bg-primary-500/15 rounded-lg flex items-center justify-center'
        }`}>
          {icon || defaultIcon}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-gray-900 dark:text-white mb-1 ${
            isHighlighted ? 'text-lg' : 'text-base'
          }`}>
            {nombre}
          </h3>
          <p className={`text-gray-600 dark:text-gray-400 mb-2 ${
            isHighlighted ? 'text-sm' : 'text-sm'
          }`}>
            {institucion}
          </p>
          <div className="flex items-center gap-2">
            <Badge
              variant="status"
              status={isCursando ? 'active' : 'inactive'}
              size="md"
              shape="rounded"
            >
              {año}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  )
}


