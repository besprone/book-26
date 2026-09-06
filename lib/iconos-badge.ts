import { Code, Database, Palette, type LucideIcon } from 'lucide-react'

/**
 * Icono de cada disciplina, por su nombre en el contenido.
 *
 * El mapa va del *valor* al icono, no de la variante al icono. Si colgara de
 * la variante, cualquier etiqueta nueva de tipo `categoria` heredaría el icono
 * de UX sin que nadie lo decidiera; así, un valor sin entrada aquí se dibuja
 * sin icono, que es el comportamiento correcto por defecto.
 *
 * Son los mismos tres iconos que la sección Stack usa para Diseño, Desarrollo
 * y Datos (ver `stackIcons` en HomePage y AboutPage). Repetirlos es
 * deliberado: la etiqueta de un proyecto y la tarjeta de Stack nombran lo
 * mismo y deben verse como lo mismo.
 *
 * Las claves son las tres disciplinas que hoy existen en `type` dentro de
 * `content/proyectos`, y son iguales en español e inglés.
 */
export const iconosCategoria: Record<string, LucideIcon> = {
  UX: Palette,
  Dev: Code,
  Data: Database,
}

/** Devuelve el icono de una categoría, o `undefined` si no tiene. */
export function iconoDeCategoria(valor: string): LucideIcon | undefined {
  return iconosCategoria[valor]
}
