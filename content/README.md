# 📝 Guía para Editar el Contenido del Portafolio

Esta carpeta contiene todos los archivos de contenido que puedes editar para actualizar tu portafolio sin tocar código.

## 📁 Estructura de Archivos

```
content/
├── config.json          # Configuración del Home (títulos, textos, botones)
├── cv.md                # Tu CV / Sobre Mí
└── proyectos/
    ├── proyecto-1.md    # Proyecto 1
    ├── proyecto-2.md    # Proyecto 2
    └── ...              # Más proyectos
```

## 🏠 Editar el Home (`config.json`)

El archivo `config.json` contiene toda la configuración de la página principal. Puedes editar:

### Hero Section
- `hero.title`: Título principal
- `hero.description`: Descripción debajo del título
- `hero.buttons`: Botones del hero (texto, enlace, estilo)

### Perfil Profesional
- `perfil.title`: Título de la sección
- `perfil.actionButton`: Botón de acción
- `perfil.cards`: Array de tarjetas con título y descripción

### Proyectos
- `proyectos.title`: Título de la sección
- `proyectos.actionButton`: Botón de acción
- `proyectos.featuredCount`: Número de proyectos destacados a mostrar

### Stack
- `stack.title`: Título de la sección
- `stack.actionButton`: Botón de acción
- `stack.categories`: Categorías con sus tecnologías

### Call to Action
- `callToAction.title`: Título de la sección final
- `callToAction.buttons`: Botones de acción

### Ejemplo de edición:

```json
{
  "hero": {
    "title": "Tu nuevo título aquí",
    "description": "Tu nueva descripción aquí",
    "buttons": {
      "primary": {
        "text": "Ver proyectos",
        "href": "/proyectos",
        "variant": "outline"
      }
    }
  }
}
```

**Nota:** Después de editar `config.json`, recarga la página para ver los cambios.

## 📄 Editar el CV (`cv.md`)

El archivo `cv.md` usa formato Markdown con frontmatter YAML.

### Frontmatter (metadatos):
```yaml
---
nombre: Tu Nombre
email: tu.email@ejemplo.com
titulo: Tu Título Profesional
---
```

### Contenido:
Escribe tu CV en Markdown. Puedes usar:
- `#` para títulos principales
- `##` para subtítulos
- `###` para sub-subtítulos
- `-` para listas
- `**texto**` para negrita
- `*texto*` para cursiva

## 🚀 Editar Proyectos (`proyectos/*.md`)

Cada proyecto es un archivo Markdown con frontmatter.

### Frontmatter (metadatos):
```yaml
---
title: Nombre del Proyecto
description: Descripción corta
date: 2024-01-15
technologies:
  - React
  - Node.js
  - MongoDB
image: https://url-de-tu-imagen.com/imagen.jpg
github: https://github.com/tu-usuario/proyecto
demo: https://demo-del-proyecto.com
---
```

### Contenido:
Escribe la descripción detallada del proyecto en Markdown.

### Agregar un nuevo proyecto:
1. Crea un nuevo archivo `.md` en la carpeta `proyectos/`
2. Usa el formato de frontmatter mostrado arriba
3. Escribe el contenido en Markdown
4. El nombre del archivo será el slug (ej: `mi-proyecto.md` → `/proyectos/mi-proyecto`)

## 💡 Tips

1. **Validación JSON**: Si editas `config.json`, asegúrate de que el JSON sea válido (comas, llaves, etc.)
2. **Recargar**: Después de editar cualquier archivo, recarga la página para ver los cambios
3. **Markdown**: Usa un editor con preview de Markdown para ver cómo se verá
4. **Imágenes**: Para proyectos, puedes usar URLs de imágenes o subirlas a una carpeta `public/`

## 🔄 Flujo de Trabajo

1. Edita el archivo que necesites (`config.json`, `cv.md`, o un proyecto)
2. Guarda el archivo
3. Recarga la página en el navegador
4. ¡Listo! Los cambios deberían aparecer

## ❓ Variantes de Botones

Los botones pueden tener estas variantes:
- `"outline"`: Botón con borde
- `"solid"`: Botón relleno
- `"ghost"`: Botón sin borde ni fondo (solo texto)



