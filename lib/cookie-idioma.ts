/**
 * Nombre y vida de la cookie que guarda el idioma elegido a mano.
 *
 * Vive aquí y no en `middleware.ts` porque la lee el conmutador de idioma,
 * que es un componente de cliente: importarla del middleware arrastraba
 * `next/server` al bundle del navegador y engordaba las rutas 1 kB. Este
 * módulo no importa nada, así que puede leerlo cualquiera de los dos lados.
 */
export const COOKIE_IDIOMA = 'idioma'

/** Un año: la elección de idioma no caduca en una sesión. */
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365
