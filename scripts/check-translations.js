#!/usr/bin/env node

/**
 * Revisa el estado de las traducciones del contenido.
 *
 * Uso: npm run check-i18n
 *
 * Comprueba dos cosas por cada archivo de content/:
 *   1. Que exista su equivalente en content/en/.
 *   2. Que los textos no sean idénticos al español, que es la señal de que el
 *      archivo se creó como copia y quedó pendiente de traducir.
 *
 * Sale con código 1 si algo falta, para poder usarlo en CI si algún día
 * interesa que un proyecto sin traducir bloquee el despliegue.
 */

const fs = require('fs')
const path = require('path')

const contentDir = path.join(process.cwd(), 'content')
const enDir = path.join(contentDir, 'en')

// Claves cuyo valor es un nombre propio y nunca se traduce.
const CLAVES_NO_TRADUCIBLES = [
  'company', 'institucion', 'client', 'logo', 'image',
  'date', 'year', 'period', 'href', 'variant', 'slug',
]

// Rutas concretas que son nombres propios aunque su clave sí lo sea en otros
// sitios: el "nombre" de una certificación es el título oficial del curso,
// mientras que el "nombre" de un elemento del stack sí se traduce.
const RUTAS_NO_TRADUCIBLES = [
  /^formacion\.certificaciones\.items\.nombre$/,
  /^formacion\.educacion\.items\.institucion$/,
  /^experiencia\.items\.title$/,
]

/** Textos de un objeto, ignorando rutas, fechas y nombres propios. */
function textos(valor, clave = '', ruta = '') {
  if (typeof valor === 'string') {
    const noTraducible =
      valor.startsWith('/') ||
      valor.startsWith('http') ||
      valor.startsWith('mailto') ||
      /^\d{4}(-\d{2})*$/.test(valor) ||
      ['UX', 'Dev', 'Data'].includes(valor) ||
      CLAVES_NO_TRADUCIBLES.includes(clave) ||
      RUTAS_NO_TRADUCIBLES.some((r) => r.test(ruta))
    return noTraducible ? [] : [valor]
  }
  if (Array.isArray(valor)) return valor.flatMap((v) => textos(v, clave, ruta))
  if (valor && typeof valor === 'object') {
    return Object.entries(valor).flatMap(([k, v]) =>
      textos(v, k, ruta ? `${ruta}.${k}` : k)
    )
  }
  return []
}

function comparar(rutaEs, rutaEn, etiqueta) {
  if (!fs.existsSync(rutaEn)) {
    return { etiqueta, estado: 'falta', detalle: 'no existe el archivo en inglés' }
  }
  const es = textos(JSON.parse(fs.readFileSync(rutaEs, 'utf8')))
  const en = textos(JSON.parse(fs.readFileSync(rutaEn, 'utf8')))

  // Solo se marcan textos largos. Los cortos que coinciden suelen ser cargos o
  // términos que ya están en inglés ("Product Design Manager", "Design
  // thinking") y marcarlos generaría ruido en cada ejecución.
  const MIN_PALABRAS = 7
  const iguales = es.filter(
    (t, i) => en[i] === t && t.trim().split(/\s+/).length >= MIN_PALABRAS
  )
  if (iguales.length === 0) return { etiqueta, estado: 'ok' }

  return {
    etiqueta,
    estado: 'pendiente',
    detalle: `${iguales.length} texto(s) siguen en español`,
    ejemplo: iguales[0].slice(0, 62),
  }
}

const archivos = [
  ['config.json', 'Home'],
  ['sobre-mi.json', 'Sobre mí'],
  ['contacto.json', 'Contacto'],
]

const resultados = archivos.map(([f, etiqueta]) =>
  comparar(path.join(contentDir, f), path.join(enDir, f), etiqueta)
)

const dirProyectos = path.join(contentDir, 'proyectos')
if (fs.existsSync(dirProyectos)) {
  fs.readdirSync(dirProyectos)
    .filter((f) => f.endsWith('.json'))
    .forEach((f) => {
      resultados.push(
        comparar(
          path.join(dirProyectos, f),
          path.join(enDir, 'proyectos', f),
          `proyecto: ${f.replace(/\.json$/, '')}`
        )
      )
    })
}

const iconos = { ok: '✅', pendiente: '🌐', falta: '❌' }
console.log('\nEstado de las traducciones al inglés:\n')
resultados.forEach((r) => {
  const linea = `  ${iconos[r.estado]} ${r.etiqueta.padEnd(42)} ${r.detalle || 'traducido'}`
  console.log(linea)
  if (r.ejemplo) console.log(`       ej: "${r.ejemplo}..."`)
})

const problemas = resultados.filter((r) => r.estado !== 'ok')
console.log(
  problemas.length === 0
    ? '\nTodo traducido.\n'
    : `\n${problemas.length} archivo(s) por revisar. Están en content/en/\n`
)

process.exit(problemas.length === 0 ? 0 : 1)
