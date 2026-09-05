# Portafolio 2026 — Marco De Castilla

Portafolio personal en producción: **https://www.besprone.com.mx**

Next.js 14 (App Router) + TypeScript + Tailwind CSS. El contenido vive en
archivos JSON dentro de `content/`, sin base de datos ni CMS: para actualizar
el sitio se edita un JSON y se hace push.

## Requisitos

- Node.js 18 o superior
- Cuenta en [Resend](https://resend.com) para el formulario de contacto
- Cuenta en [PostHog](https://posthog.com) para analítica (opcional)

## Puesta en marcha

```bash
npm install
cp env.example .env.local
npm run dev
```

Abre http://localhost:3000.

Sin `.env.local` el sitio funciona igual: solo el formulario de contacto
devuelve error y no se envía analítica.

### Variables de entorno

| Variable | Obligatoria | Para qué sirve |
|---|---|---|
| `RESEND_API_KEY` | Sí, para el formulario | API key de Resend |
| `CONTACT_EMAIL` | Sí, para el formulario | Dirección que recibe los mensajes |
| `NEXT_PUBLIC_POSTHOG_PROJECT_API_KEY` | No | Sin ella no se envía analítica |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | Por defecto `https://us.posthog.com` |
| `NEXT_PUBLIC_SITE_URL` | No | Sobreescribe la URL canónica. Útil en previews; en producción se usa el valor de `lib/site.ts` |

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build de producción |
| `npm run lint` | ESLint (`next/core-web-vitals`) |
| `npm run create-project` | Asistente interactivo para crear un proyecto |

## Cómo actualizar el contenido

Todo el contenido son archivos **JSON** en `content/`. La única excepción es
`content/cv.md`, que sí es Markdown con frontmatter.

| Archivo | Controla |
|---|---|
| `content/config.json` | Home: hero, perfil, stack, CTA |
| `content/sobre-mi.json` | Sobre mí: experiencia, formación, stack |
| `content/contacto.json` | Textos del formulario de contacto |
| `content/proyectos/<slug>.json` | Un proyecto. El nombre del archivo es la URL |
| `content/cv.md` | CV en Markdown |

### Añadir un proyecto

La forma recomendada es el asistente, que crea el JSON y la carpeta de
imágenes con la estructura correcta:

```bash
npm run create-project
```

Para hacerlo a mano, crea `content/proyectos/mi-proyecto.json` — el nombre del
archivo se convierte en la ruta `/proyectos/mi-proyecto`:

```json
{
  "title": "Nombre del proyecto",
  "description": "Descripción breve, se usa en la card y en el preview al compartir",
  "date": "2025-03-01",
  "technologies": ["Figma", "React"],
  "image": "/proyectos/mi-proyecto/hero.png",
  "featured": false,
  "type": ["UX", "Dev"],
  "client": "Empresa",
  "year": "2025",
  "role": "Product Designer",
  "reto": "Qué problema había que resolver",
  "proceso": {
    "investigacion": "...",
    "diseno": "...",
    "desarrollo": "...",
    "analisisDatos": "..."
  },
  "rolYHerramientas": {
    "rol": ["Product Designer"],
    "herramientas": ["Figma", "Storybook"]
  },
  "resultados": ["Resultado 1", "Resultado 2"],
  "aprendizajes": "Qué se aprendió"
}
```

Notas:

- `type` acepta `"UX"`, `"Dev"` y `"Data"`, y alimenta los filtros de la
  página de proyectos.
- `featured: true` destaca el proyecto en grande. Solo se muestra uno.
- Los proyectos se ordenan por `date`, del más reciente al más antiguo.
- `description` es lo que se ve al compartir el enlace en redes, junto a
  `image`. Conviene cuidarla.
- Todos los campos salvo `title` son opcionales: las secciones sin contenido
  simplemente no se renderizan.

Las imágenes van en `public/proyectos/<slug>/`. Los tamaños recomendados están
en [`public/TAMAÑOS-IMAGENES.md`](public/TAMAÑOS-IMAGENES.md).

Para eliminar un proyecto, borra su `.json`.

## Estructura

```
app/              Rutas (App Router), layout, sitemap, robots, favicon
  api/contact/    Endpoint del formulario (validación, anti-spam, Resend)
components/       Componentes de UI
content/          Contenido editable en JSON
lib/
  markdown.ts     Lectura del contenido (solo servidor: usa fs)
  types.ts        Tipos compartidos entre cliente y servidor
  site.ts         Nombre, descripción y URL canónica del sitio
  analytics.ts    Eventos de PostHog
public/           Imágenes, logos, CV en PDF
docs/             Guías de analítica y despliegue
```

## Imágenes

Se sirven con `next/image`, que genera AVIF y WebP y redimensiona según el
dispositivo. Basta con subir el PNG original a `public/`: no hay que optimizar
nada a mano.

## Tipografía

Funnel Display se auto-hospeda desde `app/fonts/` con `next/font/local`, sin
peticiones a Google Fonts. Su licencia OFL está junto al archivo.

## SEO

Cada página define su propia metadata, y cada proyecto genera título,
descripción e imagen de OpenGraph a partir de su JSON. `app/sitemap.ts` y
`app/robots.ts` se generan solos a partir del contenido.

La URL canónica está en `lib/site.ts`. **Si cambia el dominio, hay que
actualizarla ahí.**

Tras publicar cambios en un proyecto, conviene refrescar la caché de
LinkedIn en su [Post Inspector](https://www.linkedin.com/post-inspector/).

## Despliegue

Vercel despliega automáticamente cada push a `main`. Las ramas generan
deploys de preview.

Las variables de entorno se configuran en el panel de Vercel, no en el repo.

Guías detalladas:

- [`docs/DEPLOY.md`](docs/DEPLOY.md) — despliegue paso a paso
- [`docs/CONFIGURAR-DOMINIO.md`](docs/CONFIGURAR-DOMINIO.md) — dominio propio
- [`docs/DNS-HOSTGATOR.md`](docs/DNS-HOSTGATOR.md) — DNS en HostGator
- [`docs/ANALYTICS.md`](docs/ANALYTICS.md) — eventos de PostHog

## Solución de problemas

**Los emails no se envían.** Revisa que `RESEND_API_KEY` y `CONTACT_EMAIL`
estén configuradas en Vercel. El remitente por defecto es
`onboarding@resend.dev`, que suele acabar en spam: para uso real hay que
verificar un dominio propio en Resend y cambiarlo en
`app/api/contact/route.ts`.

El endpoint también rechaza envíos por diseño: máximo 3 por hora e IP,
mensajes de menos de 10 caracteres, o formularios enviados en menos de 3
segundos (se interpretan como bots).

**Un proyecto no aparece.** Comprueba que el archivo esté en
`content/proyectos/`, termine en `.json` y sea JSON válido. Reinicia el
servidor de desarrollo.

**Falla el build.** `npm run lint` y `npx tsc --noEmit` suelen señalar la
causa antes que el build completo.
