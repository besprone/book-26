# 🔧 Configuración DNS en HostGator para besprone.com.mx

## 📋 Registros DNS que necesitas agregar en HostGator

Basado en lo que muestra Vercel, necesitas configurar estos registros:

### Para `besprone.com.mx` (dominio raíz):

**Registro A:**
- **Name:** `@` (o deja en blanco)
- **Type:** `A`
- **TTL:** `14400` (o el que tenga por defecto)
- **Address/Value:** `216.198.79.1`

### Para `www.besprone.com.mx`:

**Registro CNAME:**
- **Name:** `www`
- **Type:** `CNAME`
- **TTL:** `14400` (o el que tenga por defecto)
- **CNAME/Value:** `57fc3dd0be638ab3.vercel-dns-017.com.` (con el punto final)

---

## 📝 Pasos en HostGator

### 1. Accede a DNS Zone Editor

1. Inicia sesión en **HostGator**
2. Ve a **cPanel** (panel de control)
3. Busca y haz clic en **"DNS Zone Editor"** o **"Zone Editor"**
4. Selecciona el dominio: **besprone.com.mx**

### 2. Elimina registros A y CNAME existentes (si los hay)

Busca estos registros y elimínalos si existen:
- Registro A para `@` (dominio raíz)
- Registro CNAME para `www`

**Nota:** Si hay otros registros importantes (como MX para emails), **NO los elimines**.

### 3. Agrega el Registro A (para besprone.com.mx)

1. En DNS Zone Editor, haz clic en **"Add Record"** o **"+ A"**
2. Completa:
   - **Name:** `@` (o deja en blanco, o escribe `besprone.com.mx`)
   - **TTL:** `14400`
   - **Type:** `A`
   - **Address:** `216.198.79.1`
3. Haz clic en **"Add Record"** o **"Save"**

### 4. Agrega el Registro CNAME (para www.besprone.com.mx)

1. Haz clic en **"Add Record"** o **"+ CNAME"**
2. Completa:
   - **Name:** `www`
   - **TTL:** `14400`
   - **Type:** `CNAME`
   - **CNAME:** `57fc3dd0be638ab3.vercel-dns-017.com.` (⚠️ incluye el punto final)
3. Haz clic en **"Add Record"** o **"Save"**

### 5. Verifica los registros

Después de agregar, deberías ver en tu DNS Zone Editor:

```
Type    Name    Value/Address
A       @       216.198.79.1
CNAME   www     57fc3dd0be638ab3.vercel-dns-017.com.
```

---

## ⏱️ Esperar Propagación

- **Tiempo típico:** 1-2 horas
- **Máximo:** 24-48 horas

Después de agregar los registros:
1. Vuelve a Vercel
2. En Settings → Domains, haz clic en **"Refresh"** en cada dominio
3. El estado debería cambiar de "Invalid Configuration" a "Valid Configuration" (puede tardar)

---

## ✅ Verificar que Funciona

1. Espera 1-2 horas después de configurar los DNS
2. Visita: `https://besprone.com.mx`
3. También prueba: `https://www.besprone.com.mx`
4. Deberías ver tu sitio de Vercel

---

## 🔍 Verificar Propagación DNS

Para ver si los DNS se propagaron:
1. Ve a: https://dnschecker.org
2. Busca: `besprone.com.mx`
3. Tipo: `A`
4. Verifica que aparezca: `216.198.79.1`

---

## ⚠️ Si Después de 2 Horas No Funciona

1. Verifica en HostGator que los registros estén exactamente así:
   - A: `@` → `216.198.79.1`
   - CNAME: `www` → `57fc3dd0be638ab3.vercel-dns-017.com.`
2. En Vercel, haz clic en **"Refresh"** en cada dominio
3. Espera un poco más (a veces tarda hasta 24 horas)
4. Verifica en https://dnschecker.org que los DNS se hayan propagado

---

## 📞 Si Necesitas Ayuda

Si después de 24 horas sigue sin funcionar:
- Revisa que los valores estén exactamente como los mostré arriba
- Verifica que no haya espacios extra o errores de tipeo
- Contacta a HostGator si los cambios no se están aplicando
