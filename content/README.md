# 📝 Guía para Editar el Contenido del Portafolio

Esta carpeta contiene todos los archivos de contenido que puedes editar para actualizar tu portafolio sin tocar código.

## 📁 Estructura de Archivos

```
content/
├── config.json          # Configuración del Home (títulos, textos, botones)
├── sobre-mi.json        # Configuración de Sobre Mí (experiencia, formación, stack)
├── contacto.json        # Configuración de Contacto (textos, formulario)
├── cv.md                # Tu CV (Markdown con frontmatter)
└── proyectos/
    ├── proyecto-1.json  # Proyecto 1
    ├── proyecto-2.json   # Proyecto 2
    └── ...              # Más proyectos (todos en JSON)
```

## 🏠 Editar el Home (`config.json`)

El archivo `config.json` contiene toda la configuración de la página principal. Puedes editar:

### Hero Section
- `hero.title`: Título principal
- `hero.description`: Descripción debajo del título
- `hero.alt`: Descripción de los teléfonos para lectores de pantalla
- `hero.buttons`: Botones del hero (texto, enlace, estilo)

### Cifras
- `prueba.titulo`: Título de la banda, solo para lectores de pantalla
- `prueba.items`: Tres datos con `valor` y `texto`. En `valor`, `{casos}` se cambia por el número de casos publicados

### Proyectos
- `proyectos.title`: Título de la sección
- `proyectos.actionButton`: Botón de acción
- `proyectos.featuredCount`: Número de proyectos destacados a mostrar

### Cómo trabajo
- `comoTrabajo.title`: Título de la sección
- `comoTrabajo.fases`: Las fases, con `titulo` y `texto`

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

## 👤 Editar Sobre Mí (`sobre-mi.json`)

El archivo `sobre-mi.json` contiene toda la configuración de la página "Sobre Mí". Puedes editar:
- Hero (nombre de la sección, frase principal, descripción, botón CV)
- Resumen profesional (tarjetas)
- Experiencia (los escalones del hero, en orden cronológico; `etiqueta` es lo que dice cada uno)
- Formación (certificaciones y educación)
- Stack (categorías con tecnologías)
- Call to Action

## 📧 Editar Contacto (`contacto.json`)

El archivo `contacto.json` contiene toda la configuración de la página de contacto. Puedes editar:
- Hero (título y descripción)
- Formulario (labels, placeholders, mensajes)
- CTA (título y botón)
- Texto final motivacional

## 🚀 Editar Proyectos (`proyectos/*.json`)

Cada proyecto es un archivo JSON con toda la información del proyecto.

### Estructura básica:
```json
{
  "title": "Nombre del Proyecto",
  "description": "Descripción corta",
  "date": "2024-01-15",
  "technologies": ["React", "Node.js", "MongoDB"],
  "image": "https://url-de-tu-imagen.com/imagen.jpg",
  "github": "https://github.com/tu-usuario/proyecto",
  "demo": "https://demo-del-proyecto.com",
  "featured": false,
  "type": ["UX", "Dev", "Data"],
  "client": "Nombre del Cliente",
  "year": "2024",
  "role": "Product designer",
  "reto": "Descripción del reto...",
  "proceso": {
    "investigacion": "Descripción...",
    "diseno": "Descripción...",
    "desarrollo": "Descripción...",
    "analisisDatos": "Descripción..."
  },
  "rolYHerramientas": {
    "rol": ["UX Research", "UI Design"],
    "herramientas": ["Figma", "React"]
  },
  "resultados": ["Resultado 1", "Resultado 2"],
  "aprendizajes": "Descripción de aprendizajes..."
}
```

### Agregar un nuevo proyecto:
1. Crea un nuevo archivo `.json` en la carpeta `proyectos/`
2. Usa el formato JSON mostrado arriba
3. El nombre del archivo será el slug (ej: `mi-proyecto.json` → `/proyectos/mi-proyecto`)

## 💡 Tips

1. **Validación JSON**: Si editas cualquier archivo `.json`, asegúrate de que el JSON sea válido (comas, llaves, etc.). Puedes usar un validador JSON online.
2. **Recargar**: Después de editar cualquier archivo, recarga la página para ver los cambios
3. **Markdown**: Solo `cv.md` usa Markdown. El resto del contenido está en JSON.
4. **Imágenes**: Para proyectos, puedes usar URLs de imágenes o subirlas a una carpeta `public/`
5. **Consistencia**: Todos los archivos de configuración (Home, Sobre Mí, Contacto) y proyectos usan JSON para mantener consistencia

## 🔄 Flujo de Trabajo

1. Edita el archivo que necesites (`config.json`, `sobre-mi.json`, `contacto.json`, `cv.md`, o un proyecto `.json`)
2. Guarda el archivo
3. Recarga la página en el navegador
4. ¡Listo! Los cambios deberían aparecer

## ❓ Variantes de Botones

Los botones pueden tener estas variantes:
- `"outline"`: Botón con borde
- `"solid"`: Botón relleno
- `"ghost"`: Botón sin borde ni fondo (solo texto)



