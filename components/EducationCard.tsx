import { Award, CircleDot, GraduationCap, type LucideIcon } from 'lucide-react'
import Card from './Card'
import Badge from './Badge'
import CajaIcono from './CajaIcono'

interface EducationCardProps {
  nombre: string
  institucion: string
  año: string
  variant?: 'default' | 'highlighted'
  /** El componente del icono, no un nodo ya pintado. Ver ProfileCard. */
  icon?: LucideIcon
}

export default function EducationCard({
  nombre,
  institucion,
  año,
  variant = 'default',
  icon,
}: EducationCardProps) {
  const isHighlighted = variant === 'highlighted'

  // Casi todos los valores de `año` son un año ("2024"), pero la certificación
  // en curso dice "Cursando.." / "In progress": eso no es un dato de contexto,
  // es lo único vigente de la lista, así que se pinta como estado.
  //
  // Se detecta por la forma del dato y no por su texto: la comprobación
  // anterior buscaba la palabra "cursando", que sólo existe en español, así
  // que en inglés nunca daba positivo.
  const esAño = /^\d{4}$/.test(año.trim())

  const Icono = icon ?? (isHighlighted ? GraduationCap : Award)

  return (
    <Card className={isHighlighted ? 'p-6' : 'p-5'}>
      <div className="flex items-start gap-4">
        <CajaIcono
          icon={Icono}
          tamano={isHighlighted ? 'md' : 'sm'}
          tono={isHighlighted ? 'accent' : 'primary'}
        />

        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-gray-900 dark:text-white mb-1 ${
              isHighlighted ? 'text-lg' : 'text-base'
            }`}
          >
            {nombre}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{institucion}</p>
          <div className="flex items-center gap-2">
            <Badge
              variant={esAño ? 'metadato' : 'estado'}
              icon={esAño ? undefined : CircleDot}
            >
              {año}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  )
}
