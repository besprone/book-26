# 📁 Proyectos del Portafolio

Esta carpeta contiene los archivos JSON de configuración para cada proyecto del portafolio.

## 🚀 Crear un nuevo proyecto

### Opción 1: Script automático (recomendado)

Ejecuta el script interactivo que te guiará paso a paso:

```bash
npm run create-project
```

El script:
- ✅ Genera el slug automáticamente del título
- ✅ Crea la carpeta de imágenes en `public/proyectos/[slug]/`
- ✅ Crea el archivo JSON con toda la estructura
- ✅ Configura todas las rutas de imágenes correctamente

### Opción 2: Manual

1. Crea un nuevo archivo `[slug].json` en esta carpeta
2. Usa la estructura de `EJEMPLO-IMAGENES.json` como referencia
3. Crea la carpeta `public/proyectos/[slug]/` para las imágenes
4. Guarda las imágenes con los nombres: `hero.png`, `after-reto.png`, `investigacion.png`

## 📋 Estructura del JSON

```json
{
  "title": "Título del Proyecto",
  "description": "Descripción breve",
  "date": "2024-01-01",
  "technologies": ["Figma", "React"],
  "image": "/proyectos/[slug]/hero.png",
  "featured": false,
  "type": ["UX", "Dev", "Data"],
  "client": "Nombre del Cliente",
  "year": "2024",
  "role": "Tu rol en el proyecto",
  "videoYoutube": "https://youtu.be/xxx", // Opcional
  "reto": "Descripción del reto...",
  "proceso": {
    "investigacion": "...",
    "investigacionImage": "/proyectos/[slug]/investigacion.jpg",
    "diseno": "...",
    "desarrollo": "...",
    "analisisDatos": "..."
  },
  "rolYHerramientas": {
    "rol": ["Rol 1", "Rol 2"],
    "herramientas": ["Figma", "React"]
  },
  "resultados": ["Resultado 1", "Resultado 2"],
  "aprendizajes": "Texto de aprendizajes...",
  "images": {
    "afterReto": "/proyectos/[slug]/after-reto.jpg"
  }
}
```

## 📸 Imágenes requeridas

Para cada proyecto, guarda estas imágenes en `public/proyectos/[slug]/`:

- **`hero.png`** - Imagen principal (1920x800px, ratio 2.4:1)
- **`after-reto.jpg`** - Imagen después del reto (1200x600px, ratio 2:1)
- **`investigacion.jpg`** - Imagen de investigación (1200x600px, ratio 2:1)

## 🔗 Rutas de imágenes

Todas las rutas deben empezar con `/proyectos/[slug]/` y ser relativas a la carpeta `public/`.

Ejemplo: `/proyectos/calipso-sistema-diseno/hero.png`
