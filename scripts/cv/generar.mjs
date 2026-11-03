#!/usr/bin/env node

/**
 * Genera public/cv.pdf a partir de scripts/cv/contenido.json
 *
 * Uso: npm run cv
 *
 * El PDF se imprime con Chrome desde HTML para que el texto sea real y
 * continuo: los ATS lo leen sin palabras partidas (el export de Figma partía
 * palabras en los pares de kerning de Funnel Display: "F igma", "S Q L").
 * El diseño replica el auto-layout de la página "cv" de Figma.
 *
 * Requiere Google Chrome instalado. Si no está en la ruta de macOS,
 * indica otra con CHROME_PATH=/ruta/a/chrome npm run cv
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer-core'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const cv = JSON.parse(fs.readFileSync(path.join(raiz, 'scripts/cv/contenido.json'), 'utf8'))
const fuente = fs.readFileSync(path.join(raiz, 'app/fonts/FunnelDisplay-latin.woff2')).toString('base64')
const salida = path.join(raiz, 'public/cv.pdf')
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const escapar = texto => texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const lista = items => `<ul>${items.map(item => `<li>${escapar(item)}</li>`).join('')}</ul>`
const seccion = (titulo, contenido) => `<section><h2>${titulo}</h2>${contenido}</section>`

const cuerpo = `
<header>
  <div class="nombre"><h1>${escapar(cv.nombre)}</h1><p class="titulo">${escapar(cv.titulo)}</p></div>
  <div class="contacto">
    <p>Email: ${escapar(cv.contacto.email)}</p>
    <p>Phone: ${escapar(cv.contacto.telefono)}</p>
    <p>Web: <a href="${cv.contacto.web}">${escapar(cv.contacto.web)}</a></p>
    ${cv.contacto.linkedin ? `<p>LinkedIn: <a href="${cv.contacto.linkedin.url}">${escapar(cv.contacto.linkedin.texto)}</a></p>` : ''}
  </div>
</header>
${seccion('Summary', `<p>${escapar(cv.resumen)}</p>`)}
${seccion('Work Experience', `<div class="puestos">${cv.experiencia.map(puesto => `
  <div class="puesto">
    <div class="cabecera"><p class="cargo">${escapar(puesto.cargo)}</p><p class="fecha">${escapar(puesto.fecha)}</p></div>
    ${lista(puesto.logros)}
  </div>`).join('')}${cv.experienciaPrevia ? `<p class="previa"><span class="cargo-previa">Earlier experience:</span> ${escapar(cv.experienciaPrevia)}</p>` : ''}</div>`)}
${seccion('Education', lista(cv.educacion))}
${seccion('Skills', lista(cv.habilidades))}
${seccion('Languages', lista(cv.idiomas))}`

// Medidas en pt, tomadas de Figma: página Letter con padding 32/40 y gap 12;
// secciones con gap 8 entre título y contenido; puestos con gap 8.
// Las viñetas van en línea (no posicionadas) para que el orden de lectura
// del PDF sea el mismo que el visual.
const estilos = `
@font-face{font-family:'Funnel Display';src:url(data:font/woff2;base64,${fuente}) format('woff2');font-weight:300 800}
@page{size:612pt 792pt;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:612pt;height:792pt}
body{background:#fff;font-family:'Funnel Display',sans-serif;color:#58616e;font-size:10pt;line-height:13pt;
  padding:32pt 40pt;display:flex;flex-direction:column;gap:12pt;font-variant-ligatures:none}
header{display:flex;gap:12pt;align-items:center}
.nombre{width:374pt}
h1{font-weight:400;font-size:20pt;line-height:28pt;color:#172130}
.titulo{font-size:16pt;line-height:24pt}
.contacto{width:146pt;display:flex;flex-direction:column;gap:2pt}
a{color:#6244c7;text-decoration:none}
section,.puestos,.puesto{display:flex;flex-direction:column;gap:8pt}
h2{font-weight:400;font-size:14pt;line-height:18pt;color:#172130}
.cabecera{display:flex;flex-direction:column;gap:2pt}
.cargo{font-weight:700;font-size:12pt;line-height:15pt}
.fecha{font-size:12pt;line-height:15pt}
.cargo-previa{font-weight:700}
ul{list-style:none}
li{padding-left:15pt;text-indent:-10pt}
li::before{content:'•';display:inline-block;width:10pt;text-indent:0}
`

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${escapar(cv.nombre)} – CV</title><style>${estilos}</style></head><body>${cuerpo}</body></html>`

const navegador = await puppeteer.launch({ executablePath: chrome, headless: true })
try {
  const pagina = await navegador.newPage()
  await pagina.setContent(html, { waitUntil: 'load' })
  await pagina.evaluate(() => document.fonts.ready)

  // Si el contenido crece más allá de una hoja, mejor fallar que cortar texto
  const sobrante = await pagina.evaluate(() => {
    const fin = Math.max(...[...document.body.children].map(e => e.getBoundingClientRect().bottom))
    const limite = document.body.getBoundingClientRect().bottom - 32 * (4 / 3)
    return (fin - limite) * 0.75 // px → pt
  })
  if (sobrante > 0) {
    throw new Error(`El contenido ya no cabe en una hoja Letter: sobran ${sobrante.toFixed(1)} pt. Recorta texto en contenido.json.`)
  }

  await pagina.pdf({ path: salida, width: '8.5in', height: '11in', printBackground: true, preferCSSPageSize: true })
  console.log(`✓ CV generado en ${path.relative(raiz, salida)}`)
} finally {
  await navegador.close()
}
