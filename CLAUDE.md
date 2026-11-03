# CLAUDE.md

Portafolio de Marco De Castilla en producción: https://www.besprone.com.mx.
Next.js 14 + TypeScript + Tailwind, desplegado en Vercel desde `main`. El
README explica el stack, la estructura y cómo añadir contenido; esto recoge la
forma de trabajar.

## Flujo de trabajo

- Cada ajuste va en su propia rama y su propio PR contra `main`. Se mergea con
  squash y se borra la rama; Vercel publica solo al llegar a `main`.
- Commits y PRs en español. Título con el formato `Sección: qué cambia`
  (por ejemplo `CV: inglés más natural`, `Footer: quitar la leyenda …`).
- Antes de abrir el PR se pasa lo mismo que el CI (`.github/workflows/ci.yml`):
  `npm run lint`, `npx tsc --noEmit` y `npm run build`. Si se tocan textos,
  también `npm run check-i18n`.
- Para ver cambios en local: `npm run dev` (la configuración del preview está
  en `.claude/launch.json`).

## Contenido

- Todo el texto vive en `content/` (español) y `content/en/` (inglés). Un
  cambio de texto se hace en los dos idiomas.
- El inglés usa ortografía americana y suena natural, no traducido.
- Nada de frases de plantilla o que suenen a IA: pocos dos puntos, sin
  enumeraciones de tres en paralelo, sin muletillas.
- No se nombra a clientes ni marcas de productos de terceros en los casos de
  estudio; se describen de forma genérica (por ejemplo «Financiera de crédito
  vía nómina»).
- El CV (`content/cv.md`) tiene que ser legible para ATS; el PDF se genera
  con `npm run cv`.

## Slugs de proyecto

El slug es el nombre del archivo en `content/proyectos/`, el mismo en ambos
idiomas. Si se renombra, se cambia también el archivo en `content/en/proyectos/`
y la carpeta de `public/proyectos/`, y se añade una redirección permanente en
`next.config.js` para `/proyectos/<viejo>` y `/en/work/<viejo>`.
