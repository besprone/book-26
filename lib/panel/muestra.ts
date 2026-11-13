import type { DatosPanel, Periodo } from './tipos'

/** Datos de ejemplo para trabajar el panel en local, sin llave de PostHog. */
export function datosDeMuestra(periodo: Periodo): DatosPanel {
  const hace = (min: number) => new Date(Date.now() - min * 60000).toISOString()
  return {
    actualizado: new Date().toISOString(),
    periodo,
    muestra: true,
    ahora: [
      { pagina: 'Caso Calipso', pais: 'Alemania', fuente: 'LinkedIn', segundos: 100 },
      { pagina: 'Contacto', pais: 'México', fuente: 'Postulación · empresa-a', segundos: 25 },
    ],
    ultimaVisita: { cuando: hace(1), pais: 'Alemania', pagina: 'Caso Calipso' },
    cifras: [
      { clave: 'visitantes', etiqueta: 'Visitantes', valor: 23, anterior: 18 },
      { clave: 'casos', etiqueta: 'Vieron un caso', valor: 9, anterior: 7 },
      { clave: 'cv', etiqueta: 'Descargaron el CV', valor: 2, anterior: 0 },
      { clave: 'mensajes', etiqueta: 'Te escribieron', valor: 1, anterior: 1 },
    ],
    enlaces: [
      { etiqueta: 'Postulación · empresa-a', detalle: 'Vio Calipso y Neo Bank · 4 min', ultimo: hace(60 * 20) },
      { etiqueta: 'LinkedIn · profile', detalle: '3 visitas', ultimo: hace(90) },
      { etiqueta: 'CV', detalle: '1 visita · 1 min', ultimo: hace(45) },
    ],
    fuentes: [
      ['LinkedIn', 9],
      ['Directo', 7],
      ['Google', 4],
      ['Instagram', 3],
    ],
    casos: [
      ['Calipso', 6],
      ['Neo Bank', 4],
      ['Discovery', 3],
      ['Ruta de Inglés', 2],
    ],
    actividad: [
      { texto: 'Alguien desde Alemania llegó por LinkedIn y vio Calipso.', cuando: hace(3) },
      { texto: 'Alguien desde México abrió tu CV y vio Sobre mí.', cuando: hace(40) },
      { texto: 'Alguien desde España llegó con el enlace de empresa-a y vio Calipso y Neo Bank.', cuando: hace(60 * 20) },
      { texto: 'Alguien desde México entró directo y te escribió desde Contacto.', cuando: hace(60 * 27) },
    ],
  }
}
