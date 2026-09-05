import { notFound } from 'next/navigation'

/**
 * Comodín para URLs inexistentes.
 *
 * Con dos layouts raíz (uno por idioma) no puede haber un not-found.tsx en la
 * raíz de app/: Next exige que toda página tenga layout, y ahí no hay ninguno.
 * Esta ruta atrapa lo no encontrado dentro de su grupo y delega en el
 * not-found del idioma, que sí tiene layout.
 */
export default function Page() {
  notFound()
}
