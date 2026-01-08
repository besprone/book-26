# Mi Portafolio 2026

Portafolio personal construido con Next.js, Markdown, Tailwind CSS y Resend para el envío de emails.

## 🚀 Características

- ✅ **5 Secciones Completas:**
  - Home con proyectos destacados
  - Sobre Mí (CV desde Markdown)
  - Proyectos (cards con navegación)
  - Detalle de proyecto (páginas dinámicas)
  - Contacto (formulario con envío de emails)

- ✅ **Sin Base de Datos:** Todo se gestiona con archivos Markdown
- ✅ **Fácil de Actualizar:** Solo edita archivos Markdown y recarga
- ✅ **100% Gratuito:** Vercel + Resend (plan gratuito)

## 📋 Prerequisitos

- Node.js 18+ instalado
- Cuenta en [Resend](https://resend.com) (gratis)
- Cuenta en [Vercel](https://vercel.com) (gratis)

## 🛠️ Instalación

1. **Instala las dependencias:**
```bash
npm install
```

2. **Configura las variables de entorno:**
```bash
cp .env.example .env.local
```

Edita `.env.local` y agrega:
- `RESEND_API_KEY`: Tu API key de Resend (obtén una en https://resend.com/api-keys)
- `CONTACT_EMAIL`: Tu email donde recibirás los mensajes

3. **Ejecuta el servidor de desarrollo:**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📝 Cómo Actualizar el Contenido

### Actualizar tu CV

Edita el archivo `content/cv.md`. El formato es:

```markdown
---
nombre: Tu Nombre
email: tu.email@ejemplo.com
titulo: Tu Título Profesional
---

# Contenido en Markdown

Escribe aquí tu biografía, experiencia, educación, etc.
```

### Agregar un Nuevo Proyecto

1. Crea un nuevo archivo en `content/proyectos/` con nombre `nombre-del-proyecto.md`
2. Usa este formato:

```markdown
---
title: Nombre del Proyecto
description: Descripción breve
date: 2024-01-15
technologies:
  - React
  - Node.js
image: https://url-de-imagen.com/imagen.jpg
github: https://github.com/tu-usuario/proyecto
demo: https://proyecto-demo.com
---

## Contenido del Proyecto

Escribe aquí los detalles del proyecto en Markdown.
```

3. Recarga la página y verás tu nuevo proyecto

### Eliminar un Proyecto

Simplemente elimina el archivo `.md` correspondiente de `content/proyectos/`

## 🚢 Despliegue en Vercel

1. **Sube tu código a GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin tu-repositorio-github
git push -u origin main
```

2. **Conecta con Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Agrega las variables de entorno:
     - `RESEND_API_KEY`
     - `CONTACT_EMAIL`
   - Deploy automático

3. **Configura Resend:**
   - En Resend, verifica tu dominio o usa el dominio de prueba `onboarding@resend.dev`
   - Actualiza el `from` en `app/api/contact/route.ts` con tu dominio verificado

## 📁 Estructura del Proyecto

```
book-2026/
├── app/                    # Páginas de Next.js
│   ├── page.tsx           # Home
│   ├── sobre-mi/          # CV
│   ├── proyectos/         # Lista y detalle
│   ├── contacto/          # Formulario
│   └── api/               # API routes
├── components/            # Componentes React
├── content/              # Contenido en Markdown
│   ├── cv.md            # Tu CV
│   └── proyectos/       # Proyectos
├── lib/                  # Utilidades
└── public/               # Archivos estáticos
```

## 🎨 Personalización

### Cambiar Colores

Edita `tailwind.config.ts` para personalizar los colores del tema.

### Cambiar Fuentes

Agrega fuentes en `app/layout.tsx` usando `next/font`.

### Modificar Estilos

Los estilos están en `app/globals.css` y usan Tailwind CSS.

## 📧 Configuración de Email

1. **Crea cuenta en Resend:** https://resend.com
2. **Obtén tu API Key:** Ve a API Keys en tu dashboard
3. **Verifica tu dominio** (opcional pero recomendado):
   - En Resend, ve a Domains
   - Agrega tu dominio y sigue las instrucciones
   - Actualiza el `from` en `app/api/contact/route.ts`

## 🆘 Solución de Problemas

### Los emails no se envían
- Verifica que `RESEND_API_KEY` esté correctamente configurada
- Asegúrate de que el dominio en `from` esté verificado en Resend
- Revisa la consola del servidor para errores

### Los proyectos no aparecen
- Verifica que los archivos estén en `content/proyectos/`
- Asegúrate de que tengan la extensión `.md`
- Verifica el formato del frontmatter (YAML)

### Error al hacer build
- Ejecuta `npm run build` localmente para ver errores
- Verifica que todos los archivos Markdown tengan formato correcto

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🙏 Créditos

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Resend](https://resend.com/)
- [Vercel](https://vercel.com/)



