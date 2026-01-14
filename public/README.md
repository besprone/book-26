# Archivos Estáticos (Public)

Esta carpeta contiene todos los archivos estáticos que se sirven directamente desde la raíz del sitio.

## Estructura

```
public/
├── hero-home.png          # Imagen hero de la página Home
├── hero-sobre-mi.png      # Imagen hero de la página Sobre Mí
├── cv.pdf                 # CV en formato PDF
├── proyectos/             # Imágenes de proyectos
│   └── [slug]/
│       ├── hero.png
│       ├── after-reto.png
│       └── investigacion.png
└── logos/                 # Logos de empresas (si aplica)
    ├── applica2.png
    ├── nuxiba.png
    ├── gentera.png
    └── kubo.png
```

## Imágenes Hero

### Home (`hero-home.png`)
- **Ubicación**: `public/hero-home.png`
- **Configuración**: `content/config.json` → `hero.image`
- **Dimensiones recomendadas**: 
  - **Ancho**: 1200px (2x para pantallas retina)
  - **Alto**: 800px (ratio 3:2) o 900px (ratio 4:3)
  - **Ratio**: 3:2 o 4:3 funcionan bien
- **Formato**: PNG (exportado desde Figma)
- **Tamaño de archivo**: Idealmente < 500KB

### Sobre Mí (`hero-sobre-mi.png`)
- **Ubicación**: `public/hero-sobre-mi.png`
- **Configuración**: `content/sobre-mi.json` → `hero.image`
- **Dimensiones recomendadas**:
  - **Ancho**: 1200px (2x para pantallas retina)
  - **Alto**: 800px (ratio 3:2) o 900px (ratio 4:3)
  - **Ratio**: 3:2 o 4:3 funcionan bien
- **Formato**: PNG (exportado desde Figma)
- **Tamaño de archivo**: Idealmente < 500KB

### Notas importantes:
- Las imágenes se muestran solo en desktop (ocultas en mobile)
- Ocupan aproximadamente 50% del ancho del contenedor en desktop
- Se escalan automáticamente manteniendo el ratio
- Si la imagen es más alta que ancha, puede funcionar también (ej: 800x1200px)

## Cómo agregar imágenes hero

1. Exporta la imagen desde Figma en formato PNG
2. Guárdala en la carpeta `public/` con el nombre:
   - `hero-home.png` para la página Home
   - `hero-sobre-mi.png` para la página Sobre Mí
3. La ruta en el JSON ya está configurada:
   - Home: `"image": "/hero-home.png"`
   - Sobre Mí: `"image": "/hero-sobre-mi.png"`

Las imágenes se mostrarán automáticamente en el hero de cada página.
