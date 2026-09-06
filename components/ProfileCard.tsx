import { Lightbulb, type LucideIcon } from 'lucide-react'
import Card from './Card'
import CajaIcono, { type TonoCaja } from './CajaIcono'

interface ProfileCardProps {
  title: string
  description: string
  /**
   * El componente del icono, no un nodo ya pintado. Antes recibía
   * `React.ReactNode` y quien llamaba escribía `<Icon className="w-8 h-8" />`,
   * así que el tamaño lo decidía la página y no había manera de mantenerlo a
   * juego con la caja.
   */
  icon?: LucideIcon
  tono?: TonoCaja
}

export default function ProfileCard({
  title,
  description,
  icon = Lightbulb,
  tono = 'primary',
}: ProfileCardProps) {
  return (
    <Card className="p-6">
      <CajaIcono icon={icon} tamano="lg" tono={tono} className="mb-4" />
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
    </Card>
  )
}
