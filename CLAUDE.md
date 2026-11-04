# CLAUDE.md

Portafolio de Marco De Castilla en producción: https://www.besprone.com.mx.
Next.js 14 + TypeScript + Tailwind, desplegado en Vercel desde `main`. El
README explica el stack, la estructura y cómo añadir contenido; esto recoge la
forma de trabajar.

## Flujo de trabajo

- Lo nuevo y visual se diseña primero en Figma y se revisa ahí; después se prueba
  en código. Los ajustes sin cambio visual van directo a código.
- Cada ajuste va en su propia rama y su propio PR contra `main`. Se mergea con
  squash y se borra la rama; Vercel publica solo al llegar a `main`.
- Cuando el CI pasa, se mergea sin pedir confirmación y se confirma en producción.
  Solo se pregunta antes si hay un dato de la carrera por confirmar o algo que no
  se pueda deshacer.
- Commits y PRs en español. Título con el formato `Sección: qué cambia`
  (por ejemplo `CV: inglés más natural`, `Footer: quitar la leyenda …`).
- Antes de abrir el PR se pasa lo mismo que el CI (`.github/workflows/ci.yml`):
  `npm run lint`, `npx tsc --noEmit` y `npm run build`. Si se tocan textos,
  también `npm run check-i18n`.
- Para ver cambios en local: `npm run dev` (la configuración del preview está
  en `.claude/launch.json`).

## Figma

El archivo es `book-2025` (https://www.figma.com/design/uoIuQZVmh0FyQSUOob1Hp0/book-2025),
en la cuenta personal. La página `sitio-actual` tiene cada página del sitio en
escritorio y celular, y `propuesta-motion` guarda las exploraciones y la
documentación.

- Cada cambio visual actualiza su frame de escritorio y de celular en
  `sitio-actual` dentro del mismo PR. Si no se hace, el PR dice por qué.
- Los colores por caso viven en la colección `case` y en el campo `tema` del
  JSON; el movimiento, en la colección `motion` y en `app/globals.css`.
- El archivo solo se puede editar con el conector `plugin:figma:figma` conectado
  a la cuenta personal. Si no abre, hay que iniciar sesión con `/mcp`.

## Contenido

- Todo el texto vive en `content/` (español) y `content/en/` (inglés). Un
  cambio de texto se hace en los dos idiomas.
- El inglés usa ortografía americana y suena natural, no traducido.
- Nada de frases de plantilla o que suenen a IA: pocos dos puntos, sin
  enumeraciones de tres en paralelo, sin muletillas.
- El caso de solicitud de crédito no nombra la marca del producto ni a la
  financiera; se describe de forma genérica («Financiera de crédito vía
  nómina»). Los casos de kubo.financiero sí la nombran.
- El CV (`content/cv.md`) tiene que ser legible para ATS; el PDF se genera
  con `npm run cv`.

## Slugs de proyecto

El slug es el nombre del archivo en `content/proyectos/`, el mismo en ambos
idiomas. Si se renombra, se cambia también el archivo en `content/en/proyectos/`
y la carpeta de `public/proyectos/`, y se añade una redirección permanente en
`next.config.js` para `/proyectos/<viejo>` y `/en/work/<viejo>`.
