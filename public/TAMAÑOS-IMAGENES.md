# 📐 Guía de Tamaños de Imágenes

## Imágenes Hero (Home y Sobre Mí)

### Dimensiones recomendadas:

**Opción 1 - Ratio 3:2 (Landscape)**
- **Tamaño**: 1200 x 800px
- **Uso**: Ideal para ilustraciones horizontales, mockups de pantallas
- **Peso recomendado**: < 500KB

**Opción 2 - Ratio 4:3 (Más cuadrado)**
- **Tamaño**: 1200 x 900px
- **Uso**: Para ilustraciones más cuadradas, retratos
- **Peso recomendado**: < 500KB

**Opción 3 - Ratio 1:1 (Cuadrado)**
- **Tamaño**: 1200 x 1200px
- **Uso**: Para ilustraciones cuadradas, iconos grandes
- **Peso recomendado**: < 500KB

### Configuración en Figma:

1. **Frame size**: 1200 x 800px (o el ratio que prefieras)
2. **Export settings**:
   - Format: PNG
   - Size: 1x (1200px de ancho es suficiente para 2x en pantallas retina)
   - Quality: 100% (o ajusta si el archivo es muy pesado)

### Optimización (opcional):

Si el archivo PNG es muy pesado (> 500KB):
- Usa TinyPNG o ImageOptim para comprimir
- O reduce la calidad de exportación en Figma al 90-95%

---

## Imágenes de Proyectos

### Hero del proyecto (`hero.png`)
- **Tamaño**: 1920 x 800px (ratio 2.4:1)
- **Ubicación**: `public/proyectos/[slug]/hero.png`
- **Peso recomendado**: < 800KB

La ficha sólo usa `hero.png`. Antes se documentaban también `after-reto.png` e
`investigacion.png`, pero la ficha nunca llegó a mostrarlas, así que no hace
falta exportarlas.

---

## Resumen rápido

| Tipo | Ancho | Alto | Ratio | Peso máx |
|------|-------|------|-------|----------|
| Hero Home/Sobre Mí | 1200px | 800px | 3:2 | 500KB |
| Hero Proyecto | 1920px | 800px | 2.4:1 | 800KB |

---

## Tips de exportación desde Figma

1. **Para imágenes hero**: Usa el frame size exacto (1200x800px)
2. **Para proyectos**: Ajusta el frame al tamaño recomendado
3. **Exporta como PNG**: Format → PNG, Size → 1x
4. **Optimiza después**: Usa TinyPNG si el archivo es muy pesado
5. **Mantén consistencia**: Usa el mismo ratio para todas las imágenes hero
