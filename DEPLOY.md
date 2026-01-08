# 🚀 Guía de Despliegue - GitHub y Vercel

Esta guía te ayudará a subir tu portafolio a GitHub y desplegarlo en Vercel.

## 📋 Pasos Previos

### 1. Configurar Resend (Email)

Antes de desplegar, necesitas configurar Resend para que el formulario de contacto funcione:

1. **Crea una cuenta en Resend:**
   - Ve a https://resend.com
   - Crea una cuenta gratuita (tiene 100 emails/día gratis)

2. **Obtén tu API Key:**
   - En el dashboard de Resend, ve a "API Keys"
   - Crea una nueva API Key
   - Cópiala (solo se muestra una vez)

3. **Verifica tu dominio (Opcional pero recomendado):**
   - En Resend, ve a "Domains"
   - Agrega tu dominio (ej: `besprone.com`)
   - Sigue las instrucciones para verificar DNS
   - **Nota:** Si no tienes dominio, puedes usar `onboarding@resend.dev` temporalmente

4. **Actualiza el email en el código:**
   - Abre `app/api/contact/route.ts`
   - Cambia `from: 'Portafolio <onboarding@resend.dev>'` por tu dominio verificado
   - Ejemplo: `from: 'Portafolio <noreply@besprone.com>'`

---

## 🔵 Paso 1: Subir a GitHub

### 1.1 Crear repositorio en GitHub

1. Ve a https://github.com
2. Clic en "New repository"
3. Nombre: `book-2026` (o el que prefieras)
4. **NO** marques "Initialize with README" (ya tenemos uno)
5. Clic en "Create repository"

### 1.2 Subir el código

Ejecuta estos comandos en la terminal (desde la carpeta del proyecto):

```bash
# Asegúrate de estar en la carpeta del proyecto
cd /Users/Marco_De_Castilla_V/Documents/book-2026

# Agrega todos los archivos
git add .

# Crea el primer commit
git commit -m "Initial commit: Portafolio 2026"

# Cambia a rama main (si estás en master)
git branch -M main

# Agrega el repositorio remoto (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/book-2026.git

# Sube el código
git push -u origin main
```

**Nota:** Si GitHub te pide autenticación, puedes usar:
- Personal Access Token (recomendado)
- O GitHub CLI: `gh auth login`

---

## 🟢 Paso 2: Desplegar en Vercel

### 2.1 Conectar con GitHub

1. Ve a https://vercel.com
2. Inicia sesión con tu cuenta de GitHub
3. Clic en "Add New Project"
4. Selecciona el repositorio `book-2026`
5. Clic en "Import"

### 2.2 Configurar el proyecto

Vercel detectará automáticamente que es un proyecto Next.js. Solo necesitas:

1. **Framework Preset:** Next.js (ya detectado)
2. **Root Directory:** `./` (dejar por defecto)
3. **Build Command:** `npm run build` (ya configurado)
4. **Output Directory:** `.next` (ya configurado)

### 2.3 Agregar Variables de Entorno

**IMPORTANTE:** Antes de hacer deploy, agrega las variables de entorno:

1. En la sección "Environment Variables", agrega:

   ```
   RESEND_API_KEY = re_tu_api_key_aqui
   CONTACT_EMAIL = tu.email@ejemplo.com
   ```

2. Asegúrate de que estén marcadas para:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### 2.4 Deploy

1. Clic en "Deploy"
2. Espera 2-3 minutos mientras Vercel construye tu proyecto
3. ¡Listo! Tu sitio estará en `https://tu-proyecto.vercel.app`

---

## ✅ Verificación Post-Deploy

### 1. Probar el sitio

1. Visita tu URL de Vercel
2. Navega por todas las páginas
3. Verifica que las imágenes se carguen correctamente

### 2. Probar el formulario de contacto

1. Ve a la página de Contacto
2. Llena el formulario
3. Envía un mensaje de prueba
4. Verifica que recibas el email en `CONTACT_EMAIL`

### 3. Verificar logs (si hay problemas)

1. En Vercel, ve a tu proyecto
2. Clic en "Deployments"
3. Clic en el último deployment
4. Ve a "Functions" para ver logs de la API

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios:

```bash
# Hacer cambios en tu código...

# Agregar cambios
git add .

# Commit
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push

# Vercel desplegará automáticamente
```

Vercel detectará automáticamente los cambios en GitHub y hará un nuevo deploy.

---

## 🐛 Solución de Problemas

### Error: "RESEND_API_KEY no está configurada"

- Verifica que agregaste la variable en Vercel
- Asegúrate de que esté marcada para "Production"
- Haz un nuevo deploy después de agregar la variable

### Los emails no se envían

1. Verifica que `RESEND_API_KEY` sea correcta
2. Verifica que el dominio en `from` esté verificado en Resend
3. Revisa los logs en Vercel (Functions → contact)

### Error en build

1. Ejecuta `npm run build` localmente para ver el error
2. Verifica que todos los archivos Markdown tengan formato correcto
3. Revisa la consola de Vercel para más detalles

### El sitio no se actualiza

1. Verifica que hiciste `git push`
2. Revisa que Vercel detectó el cambio (ve a Deployments)
3. Espera 1-2 minutos para que termine el build

---

## 📝 Checklist Final

Antes de considerar el deploy completo:

- [ ] Código subido a GitHub
- [ ] Proyecto conectado en Vercel
- [ ] Variables de entorno configuradas en Vercel
- [ ] Resend configurado con API Key
- [ ] Dominio verificado en Resend (o usando onboarding@resend.dev)
- [ ] Email `from` actualizado en `app/api/contact/route.ts`
- [ ] Sitio desplegado y funcionando
- [ ] Formulario de contacto probado y funcionando
- [ ] Todas las páginas navegables sin errores

---

## 🎉 ¡Listo!

Tu portafolio está en línea. Comparte tu URL de Vercel con el mundo.

**Próximos pasos opcionales:**
- Configurar un dominio personalizado en Vercel
- Agregar Google Analytics
- Configurar SEO mejorado
- Agregar más proyectos
