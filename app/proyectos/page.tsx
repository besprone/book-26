import { getAllProyectos } from '@/lib/markdown'
import ProyectosClient from './ProyectosClient'

export default function Proyectos() {
  const proyectos = getAllProyectos()
  
  return <ProyectosClient initialProyectos={proyectos} />
}
