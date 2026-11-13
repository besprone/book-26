import { cookies } from 'next/headers'
import Acceso from '@/components/panel/Acceso'
import Panel from '@/components/panel/Panel'
import { COOKIE_SESION, panelConfigurado, sesionValida } from '@/lib/panel/sesion'

export const dynamic = 'force-dynamic'

export default function PaginaPanel({ searchParams }: { searchParams: { error?: string } }) {
  if (!panelConfigurado()) {
    return (
      <main className="mx-auto max-w-md px-6 py-20">
        <h1 className="text-2xl font-semibold">Panel sin configurar</h1>
        <p className="mt-2 text-gray-600">Falta PANEL_SECRET en las variables de entorno de Vercel.</p>
      </main>
    )
  }
  if (!sesionValida(cookies().get(COOKIE_SESION)?.value)) {
    return <Acceso enlaceVencido={searchParams.error === 'enlace'} />
  }
  return <Panel />
}
