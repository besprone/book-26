/**
 * Estilos compartidos por Button e IconButton.
 *
 * Viven aquí y no dentro de un componente para que los dos usen exactamente
 * las mismas variantes, tamaños y estado de foco. Antes cada control clicable
 * del sitio resolvía lo suyo y había cinco tratamientos distintos conviviendo.
 *
 * JERARQUÍA
 *
 *   primary    La acción principal de la vista. Una sola por pantalla.
 *   secondary  Alternativa de peso comparable a la principal.
 *   tonal      Apoyo frecuente que no debe competir con la principal.
 *   ghost      Terciaria: navegación, acciones dentro de tarjetas.
 *
 * RADIOS (regla del sitio)
 *
 *   rounded-lg    controles: botones, chips, campos de formulario
 *   rounded-xl    contenedores: tarjetas, cajas de icono
 *   rounded-full  píldoras y conmutadores
 *   rounded-2xl   media grande: ilustraciones de portada
 */

export type VarianteBoton = 'primary' | 'secondary' | 'tonal' | 'ghost'
export type TamanoBoton = 'sm' | 'md' | 'lg'

export const variantesBoton: Record<VarianteBoton, string> = {
  primary:
    'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 ' +
    'dark:bg-primary-500 dark:hover:bg-primary-600',
  secondary:
    'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 hover:border-primary-700 hover:text-primary-700 ' +
    'dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20 dark:hover:border-primary-300 dark:hover:text-primary-300',
  tonal:
    'bg-primary-50 text-primary-700 hover:bg-primary-100 ' +
    'dark:bg-primary-500/15 dark:text-primary-300 dark:hover:bg-primary-500/25',
  ghost:
    'text-primary-600 hover:bg-primary-50 hover:text-primary-700 ' +
    'dark:text-primary-400 dark:hover:bg-primary-900/20 dark:hover:text-primary-300',
}

/**
 * Alturas fijas en vez de padding vertical: así todos los controles de un
 * mismo tamaño se alinean aunque cambie el contenido. `md` mide 44px, que es
 * el área táctil recomendada para móvil, y es el tamaño por defecto.
 */
export const tamanosBoton: Record<TamanoBoton, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-5 text-base gap-2',
  lg: 'h-12 px-8 text-base gap-2',
}

/** Lado del cuadrado en un botón de solo icono, por tamaño. */
export const tamanosIconButton: Record<TamanoBoton, string> = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-12 w-12',
}

export const tamanosIcono: Record<TamanoBoton, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-5 w-5',
}

/**
 * Anillo de foco del sitio. Lo usa cualquier cosa enfocable, no solo los
 * botones: enlaces de navegación, logo, tarjetas de proyecto y enlaces del pie.
 *
 * Era lo que más faltaba. El Button anterior no tenía ningún estilo de foco y
 * los enlaces tampoco, así que quien navegaba con teclado no veía dónde estaba.
 */
export const anilloFoco =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900'

/** Base común de botones y botones de icono. */
export const baseBoton =
  'inline-flex items-center justify-center rounded-lg font-medium transition ' +
  anilloFoco +
  ' disabled:opacity-50 disabled:cursor-not-allowed'
