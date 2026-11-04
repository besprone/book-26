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
2. Usa la estructura de cualquier proyecto existente como referencia, por ejemplo `calipso-sistema-diseno.json`
3. Crea la carpeta `public/proyectos/[slug]/` para la imagen
4. Guarda la imagen de portada como `hero.png`
5. Crea también la versión en inglés en `content/en/proyectos/[slug].json`

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
    "diseno": "...",
    "desarrollo": "...",
    "analisisDatos": "..."
  },
  "rolYHerramientas": {
    "rol": ["Rol 1", "Rol 2"],
    "herramientas": ["Figma", "React"]
  },
  "resultados": ["Resultado 1", "Resultado 2"],
  "aprendizajes": "Texto de aprendizajes..."
}
```

## 🎨 Campos del template del caso

Son opcionales. Un caso sin ellos se ve completo, con los colores del sitio y la imagen `hero.png` como portada.

- `tema`: colores del caso (`bg`, `ink`, `accent`, `band`, `bandValue`, `bandText` y `number` si los números del proceso llevan color). Son los mismos de la colección `case` en Figma.
- `hero`: `{ "tipo": "portada", "alt": "…" }` usa `portada.png` (2160×960) y `portada-celular.png` (780×1120) de `public/proyectos/[slug]/`.
- `cifras`: banda con un título y tres datos (`valor` y `texto`).
- `destacado`: un título, una `intro` y tres tarjetas (`titulo` y `texto`) con lo que hace distinto al caso.
- `aprendizajes`: la primera frase se muestra en grande, así que tiene que funcionar sola.

## 📸 Imagen requerida

Cada proyecto lleva una sola imagen, en `public/proyectos/[slug]/`:

- **`hero.png`** - Imagen principal (1920x800px, ratio 2.4:1)

La ficha no muestra imágenes dentro de las secciones. Antes la plantilla
reservaba huecos para `investigacion` y `after-reto`, pero nunca se
programó la parte que los pinta: el contenido apuntaba a archivos que no
existían y no se veían. Si algún día se quieren imágenes dentro del caso,
hay que añadir a la vez el campo y el código que lo muestra.

## 🔗 Rutas de imágenes

Todas las rutas deben empezar con `/proyectos/[slug]/` y ser relativas a la carpeta `public/`.

Ejemplo: `/proyectos/calipso-sistema-diseno/hero.png`
