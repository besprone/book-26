#!/usr/bin/env node

/**
 * Script para crear un nuevo proyecto automáticamente
 * 
 * Uso: node scripts/create-project.js
 * 
 * El script pedirá la información del proyecto y generará:
 * - La carpeta de imágenes en public/proyectos/[slug]/
 * - El archivo JSON en content/proyectos/[slug].json
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function createProject() {
  console.log('\n📁 Creando nuevo proyecto...\n')

  // Obtener información básica
  const title = await question('Título del proyecto: ')
  if (!title) {
    console.log('❌ El título es requerido')
    rl.close()
    return
  }

  const slug = slugify(title)
  const description = await question('Descripción breve: ')
  const date = await question('Fecha (YYYY-MM-DD) [2024-01-01]: ') || '2024-01-01'
  const client = await question('Cliente/Empresa: ') || ''
  const year = await question('Año: ') || new Date(date).getFullYear().toString()
  const role = await question('Rol: ') || ''
  
  // Tipo del proyecto
  console.log('\nTipos disponibles: UX, Dev, Data')
  const typeInput = await question('Tipo(s) del proyecto (separados por comas): ')
  const type = typeInput ? typeInput.split(',').map(t => t.trim()) : ['UX']
  
  // Featured
  const featuredInput = await question('¿Proyecto destacado? (s/n) [n]: ')
  const featured = featuredInput.toLowerCase() === 's'

  // Reto
  console.log('\n--- El Reto ---')
  const reto = await question('Descripción del reto: ')

  // Video YouTube (opcional)
  const videoYoutube = await question('URL de video de YouTube (opcional): ') || undefined

  // Proceso
  console.log('\n--- Proceso ---')
  const investigacion = await question('Investigación: ') || ''
  const diseno = await question('Diseño: ') || ''
  const desarrollo = await question('Desarrollo: ') || ''
  const analisisDatos = await question('Análisis de datos: ') || ''

  // Rol y herramientas
  console.log('\n--- Rol y Herramientas ---')
  const rolesInput = await question('Roles (separados por comas): ')
  const roles = rolesInput ? rolesInput.split(',').map(r => r.trim()) : []
  const herramientasInput = await question('Herramientas (separadas por comas): ')
  const herramientas = herramientasInput ? herramientasInput.split(',').map(h => h.trim()) : []

  // Resultados
  console.log('\n--- Resultados ---')
  console.log('Ingresa los resultados (uno por línea, línea vacía para terminar):')
  const resultados = []
  let resultado = await question('Resultado 1: ')
  let i = 2
  while (resultado.trim()) {
    resultados.push(resultado.trim())
    resultado = await question(`Resultado ${i}: `)
    i++
  }

  // Aprendizajes
  console.log('\n--- Aprendizajes ---')
  const aprendizajes = await question('Aprendizajes: ')

  // Technologies (de herramientas o preguntar)
  const technologiesInput = await question('Tecnologías principales (separadas por comas): ')
  const technologies = technologiesInput ? technologiesInput.split(',').map(t => t.trim()) : []

  // Crear estructura del proyecto
  const proyecto = {
    title,
    description: description || `${title} - Descripción del proyecto`,
    date,
    technologies,
    image: `/proyectos/${slug}/hero.png`,
    featured,
    type,
    client: client || undefined,
    year,
    role: role || undefined,
    ...(videoYoutube && { videoYoutube }),
    reto: reto || undefined,
    proceso: {
      ...(investigacion && { investigacion }),
      ...(investigacion && { investigacionImage: `/proyectos/${slug}/investigacion.png` }),
      ...(diseno && { diseno }),
      ...(desarrollo && { desarrollo }),
      ...(analisisDatos && { analisisDatos }),
    },
    rolYHerramientas: {
      ...(roles.length > 0 && { rol: roles }),
      ...(herramientas.length > 0 && { herramientas }),
    },
    ...(resultados.length > 0 && { resultados }),
    ...(aprendizajes && { aprendizajes }),
    images: {
      afterReto: `/proyectos/${slug}/after-reto.png`,
    },
  }

  // Eliminar campos undefined
  Object.keys(proyecto).forEach(key => {
    if (proyecto[key] === undefined) {
      delete proyecto[key]
    }
  })
  if (proyecto.proceso) {
    Object.keys(proyecto.proceso).forEach(key => {
      if (proyecto.proceso[key] === undefined || proyecto.proceso[key] === '') {
        delete proyecto.proceso[key]
      }
    })
    if (Object.keys(proyecto.proceso).length === 0) {
      delete proyecto.proceso
    }
  }
  if (proyecto.rolYHerramientas) {
    Object.keys(proyecto.rolYHerramientas).forEach(key => {
      if (!proyecto.rolYHerramientas[key] || proyecto.rolYHerramientas[key].length === 0) {
        delete proyecto.rolYHerramientas[key]
      }
    })
    if (Object.keys(proyecto.rolYHerramientas).length === 0) {
      delete proyecto.rolYHerramientas
    }
  }

  // Crear carpetas
  const imagesDir = path.join(process.cwd(), 'public', 'proyectos', slug)
  const proyectosDir = path.join(process.cwd(), 'content', 'proyectos')
  const jsonPath = path.join(proyectosDir, `${slug}.json`)

  // Verificar si ya existe
  if (fs.existsSync(jsonPath)) {
    const overwrite = await question(`\n⚠️  El proyecto ${slug}.json ya existe. ¿Sobrescribir? (s/n): `)
    if (overwrite.toLowerCase() !== 's') {
      console.log('❌ Operación cancelada')
      rl.close()
      return
    }
  }

  // Crear directorios
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true })
    console.log(`✅ Carpeta creada: public/proyectos/${slug}/`)
  }

  // Guardar JSON
  fs.writeFileSync(jsonPath, JSON.stringify(proyecto, null, 2), 'utf8')
  console.log(`✅ Archivo creado: content/proyectos/${slug}.json`)

  console.log('\n📋 Resumen:')
  console.log(`   Slug: ${slug}`)
  console.log(`   Carpeta imágenes: public/proyectos/${slug}/`)
  console.log(`   Archivo JSON: content/proyectos/${slug}.json`)
  console.log('\n📸 Recuerda agregar las imágenes:')
  console.log(`   - public/proyectos/${slug}/hero.png (1920x800px)`)
  console.log(`   - public/proyectos/${slug}/after-reto.png (1200x600px)`)
  if (investigacion) {
    console.log(`   - public/proyectos/${slug}/investigacion.png (1200x600px)`)
  }

  rl.close()
}

createProject().catch(console.error)
