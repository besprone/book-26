# 🌐 Guía: Configurar Dominio de HostGator con Vercel

## Paso 1: Agregar Dominio en Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com
2. Clic en **Settings** → **Domains**
3. En el campo "Add Domain", escribe tu dominio:
   - Ejemplo: `besprone.com`
   - También agrega: `www.besprone.com`
4. Clic en **Add**

## Paso 2: Obtener Registros DNS de Vercel

Después de agregar el dominio, Vercel te mostrará los registros DNS que necesitas:

**Para el dominio raíz (besprone.com):**
- **Tipo:** A
- **Nombre:** @ (o deja en blanco)
- **Valor:** Una IP de Vercel (ej: `76.76.21.21`)

**Para www (www.besprone.com):**
- **Tipo:** CNAME
- **Nombre:** www
- **Valor:** `cname.vercel-dns.com`

**Nota:** Vercel puede darte diferentes valores, usa los que te muestre específicamente.

## Paso 3: Configurar DNS en HostGator

### Opción A: DNS Zone Editor (Recomendado)

1. Inicia sesión en **HostGator**
2. Ve a **cPanel** (panel de control)
3. Busca **"DNS Zone Editor"** o **"Zone Editor"**
4. Selecciona tu dominio
5. **Elimina o modifica** los registros existentes:
   - Busca registros A para `@` o el dominio raíz
   - Busca registros CNAME para `www`

6. **Agrega los nuevos registros:**

   **Registro A:**
   - **Name:** @ (o deja en blanco, o tu dominio)
   - **TTL:** 14400 (o el que tenga por defecto)
   - **Type:** A
   - **Address:** [IP que te dio Vercel, ej: 76.76.21.21]
   - Clic en **Add Record**

   **Registro CNAME:**
   - **Name:** www
   - **TTL:** 14400
   - **Type:** CNAME
   - **CNAME:** cname.vercel-dns.com (o el que te dio Vercel)
   - Clic en **Add Record**

### Opción B: Cambiar Nameservers (Alternativa)

Si prefieres que Vercel maneje todo el DNS:

1. En Vercel, después de agregar el dominio, ve a **Settings** → **Domains**
2. Clic en tu dominio
3. Verás los **Nameservers** de Vercel (algo como `ns1.vercel-dns.com`)
4. En HostGator, ve a **"Change Nameservers"** o **"Nameservers"**
5. Cambia los nameservers a los de Vercel
6. Guarda los cambios

**Nota:** Esta opción puede tardar más en propagarse (hasta 48 horas).

## Paso 4: Verificar en Vercel

1. Después de actualizar los DNS, vuelve a Vercel
2. En **Settings** → **Domains**, verás el estado del dominio
3. Puede mostrar:
   - ⏳ **Pending** (pendiente) - Esperando verificación DNS
   - ✅ **Valid Configuration** (configuración válida) - ¡Listo!

## Paso 5: Esperar Propagación DNS

- **Tiempo típico:** 1-2 horas
- **Máximo:** 24-48 horas
- Puedes verificar el progreso en: https://dnschecker.org

## 🔍 Verificar que Funciona

1. Espera 1-2 horas después de cambiar los DNS
2. Visita tu dominio: `https://tu-dominio.com`
3. Deberías ver tu sitio de Vercel
4. También prueba: `https://www.tu-dominio.com`

## ⚠️ Problemas Comunes

### El dominio no funciona después de 24 horas

1. Verifica que los registros DNS estén correctos en HostGator
2. Usa https://dnschecker.org para ver si los DNS se propagaron
3. Verifica en Vercel que el dominio esté configurado correctamente
4. Contacta a HostGator si los cambios no se aplican

### Error "Domain not found" en Vercel

- Asegúrate de haber agregado el dominio en Vercel primero
- Verifica que los registros DNS sean exactamente los que Vercel te dio
- Espera más tiempo para la propagación

### El sitio carga pero muestra error

- Verifica que las variables de entorno estén configuradas en Vercel
- Revisa los logs de Vercel para ver errores
- Asegúrate de que el build esté exitoso

## 📝 Notas Importantes

- **No elimines** otros registros DNS importantes (como MX para emails, si los usas)
- Si usas email con HostGator, mantén los registros MX
- El cambio de DNS puede afectar temporalmente el email (normalmente no)

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:
1. Comparte los registros DNS que te dio Vercel
2. Comparte una captura de pantalla de tu DNS Zone Editor en HostGator
3. Verifica el estado en https://dnschecker.org
