# 📊 Documentación de Eventos de Analytics

Esta documentación describe todos los eventos de analytics implementados en el portafolio, sus parámetros, cuándo se disparan y cómo analizarlos en PostHog.

## 📋 Índice

- [Eventos Principales](#eventos-principales)
- [Eventos de Navegación](#eventos-de-navegación)
- [Eventos de Engagement](#eventos-de-engagement)
- [Eventos de Formulario](#eventos-de-formulario)
- [Guía de Análisis en PostHog](#guía-de-análisis-en-posthog)

---

## 🎯 Eventos Principales

### `cta_clicked`

**Descripción:** Evento unificado para todos los clicks en CTAs (Call-to-Actions) del portafolio. Este es el evento principal para trackear interacciones del usuario.

**Cuándo se dispara:**
- Click en opciones del menú (header)
- Click en logo (header o footer)
- Click en botones del hero (primario y secundario)
- Click en botones de secciones (Sobre mí, Ver proyectos, etc.)
- Click en proyectos (cards)
- Click en redes sociales (footer)
- Click en filtros de proyectos
- Click en botón de formulario (submit)
- Click en botones de CTA sections
- Click en botón de descarga de CV

**Parámetros:**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `cta_name` | string | Nombre del botón/CTA | `"Ver proyectos"`, `"LinkedIn"`, `"UX"` |
| `cta_type` | string | Tipo de CTA (ver tipos abajo) | `"header_menu"`, `"hero_primary"` |
| `cta_location` | string | Página donde está el CTA | `"/"`, `"/proyectos"`, `"/sobre-mi"` |
| `cta_destination` | string | Destino del click (href) | `"/proyectos"`, `"https://linkedin.com/..."` |
| `section_name` | string | Sección donde está el CTA | `"hero"`, `"proyectos"`, `"cta"` |

**Tipos de CTA (`cta_type`):**

- `header_menu`: Opciones del menú (Home, Sobre mí, Proyectos, Contacto)
- `header_logo`: Logo en el header
- `hero_primary`: Botón primario del hero
- `hero_secondary`: Botón secundario del hero
- `section_cta`: Botones en secciones (Sobre mí, Ver proyectos, etc.)
- `footer_social`: Redes sociales en footer (Email, LinkedIn, GitHub)
- `footer_logo`: Logo en el footer
- `filter`: Filtros en la página de proyectos (Todo, UX, Dev, Data)
- `form_submit`: Submit del formulario de contacto
- `cta_section`: Botones en secciones CTA finales
- `cv_download`: Descarga de CV

**Ejemplo de evento:**
```json
{
  "event": "cta_clicked",
  "properties": {
    "cta_name": "Ver proyectos",
    "cta_type": "hero_primary",
    "cta_location": "/",
    "cta_destination": "/proyectos",
    "section_name": "hero"
  }
}
```

**Uso en PostHog:**
- **Funnel:** Crear funnel desde `cta_clicked` con `cta_type: "hero_primary"` hasta `project_viewed`
- **Análisis:** Agrupar por `cta_type` para ver qué CTAs tienen más clicks
- **Segmentación:** Filtrar por `section_name` para ver clicks por sección

---

## 📄 Eventos de Navegación

### `project_viewed`

**Descripción:** Se dispara cuando un usuario visita la página de detalle de un proyecto.

**Cuándo se dispara:**
- Al cargar la página `/proyectos/[slug]`
- Solo se envía una vez por visita

**Parámetros:**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `project_slug` | string | Slug único del proyecto | `"calipso-sistema-diseno"` |
| `project_title` | string | Título del proyecto | `"Calipso - Sistema de Diseño"` |
| `project_type` | string[] | Tipos del proyecto (opcional) | `["UX", "Dev"]` |

**Ejemplo:**
```json
{
  "event": "project_viewed",
  "properties": {
    "project_slug": "calipso-sistema-diseno",
    "project_title": "Calipso - Sistema de Diseño",
    "project_type": ["UX", "Dev"]
  }
}
```

**Uso en PostHog:**
- **Análisis:** Ver qué proyectos son más visitados
- **Segmentación:** Agrupar por `project_type` para ver preferencias

---

### `project_clicked`

**Descripción:** Se dispara cuando un usuario hace click en una card de proyecto (mantenido para compatibilidad, pero se recomienda usar `cta_clicked`).

**Cuándo se dispara:**
- Click en una card de proyecto (ya no se usa, reemplazado por `cta_clicked`)

**Parámetros:**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `project_slug` | string | Slug del proyecto | `"calipso-sistema-diseno"` |
| `project_title` | string | Título del proyecto | `"Calipso - Sistema de Diseño"` |
| `source_page` | string | Página desde donde se hizo click | `"/"`, `"/proyectos"` |

---

### `filter_applied`

**Descripción:** Se dispara cuando un usuario aplica un filtro en la página de proyectos.

**Cuándo se dispara:**
- Click en un filtro (Todo, UX, Dev, Data)
- Se envía cada vez que se cambia el filtro

**Parámetros:**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `filter_type` | string | Tipo de filtro aplicado | `"UX"`, `"Dev"`, `"Data"`, `"Todo"` |
| `projects_count` | number | Número de proyectos mostrados con ese filtro | `5`, `12` |

**Ejemplo:**
```json
{
  "event": "filter_applied",
  "properties": {
    "filter_type": "UX",
    "projects_count": 3
  }
}
```

**Uso en PostHog:**
- **Análisis:** Ver qué filtros son más usados
- **Funnel:** Analizar flujo de filtros aplicados

---

### `load_more_clicked`

**Descripción:** Se dispara cuando un usuario hace click en "Ver más proyectos".

**Cuándo se dispara:**
- Click en el botón "Ver más proyectos"
- Solo aparece cuando hay más proyectos para mostrar

**Parámetros:**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `current_count` | number | Número de proyectos visibles antes del click | `6`, `12` |
| `filter_active` | string | Filtro activo en ese momento | `"Todo"`, `"UX"` |

**Ejemplo:**
```json
{
  "event": "load_more_clicked",
  "properties": {
    "current_count": 6,
    "filter_active": "Todo"
  }
}
```

---

## 📊 Eventos de Engagement

### `section_viewed`

**Descripción:** Se dispara cuando un usuario visualiza una sección de la página (cuando el 10% de la sección entra al viewport).

**Cuándo se dispara:**
- Al hacer scroll y una sección entra al viewport
- Solo se envía una vez por sección por visita

**Parámetros:**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `section_name` | string | Nombre de la sección | `"hero"`, `"proyectos"`, `"reto"` |
| `page` | string | Página donde está la sección | `"/"`, `"/sobre-mi"`, `"/proyectos/[slug]"` |

**Secciones disponibles:**

**Home (`/`):**
- `hero`: Sección hero principal
- `perfil`: Sección de perfil profesional
- `proyectos`: Sección de proyectos destacados
- `stack`: Sección de stack tecnológico
- `cta`: Sección call-to-action final

**Sobre Mí (`/sobre-mi`):**
- `hero`: Sección hero
- `resumen_profesional`: Resumen profesional
- `experiencia`: Sección de experiencia laboral
- `formacion`: Sección general de formación
- `formacion_certificaciones`: Subsección de certificaciones
- `formacion_educacion`: Subsección de formación formal
- `stack`: Sección de stack
- `cta`: Sección call-to-action

**Proyectos (`/proyectos`):**
- `proyectos`: Sección principal de proyectos

**Detalle de Proyecto (`/proyectos/[slug]`):**
- `proyecto_detalle`: Sección principal del proyecto
- `reto`: Sección "El reto"
- `proceso`: Sección "Proceso"
- `rol_herramientas`: Sección "Rol y herramientas"
- `resultados`: Sección "Resultados"
- `aprendizajes`: Sección "Aprendizajes"
- `cta`: Sección "¿Te gustó este proyecto?"

**Contacto (`/contacto`):**
- `contacto`: Sección principal del formulario
- `cta`: Sección call-to-action

**Ejemplo:**
```json
{
  "event": "section_viewed",
  "properties": {
    "section_name": "proyectos",
    "page": "/"
  }
}
```

**Uso en PostHog:**
- **Análisis:** Ver qué secciones son más vistas
- **Funnel:** Analizar flujo de visualización de secciones
- **Segmentación:** Agrupar por `page` para ver engagement por página

---

### `scroll_depth`

**Descripción:** Se dispara cuando un usuario alcanza ciertos porcentajes de scroll en una página.

**Cuándo se dispara:**
- Al alcanzar 25%, 50%, 75% y 100% de scroll
- Se envía una vez por milestone por visita

**Parámetros:**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `page` | string | Página donde se hizo scroll | `"/"`, `"/sobre-mi"` |
| `depth_percentage` | number | Porcentaje de scroll alcanzado | `25`, `50`, `75`, `100` |

**Ejemplo:**
```json
{
  "event": "scroll_depth",
  "properties": {
    "page": "/sobre-mi",
    "depth_percentage": 75
  }
}
```

**Uso en PostHog:**
- **Análisis:** Ver qué porcentaje de usuarios llegan a cada milestone
- **Funnel:** Crear funnel de scroll depth
- **Métricas:** Calcular tasa de abandono por página

---

### `experience_section_scrolled`

**Descripción:** Se dispara cuando un usuario hace scroll horizontal en la sección de experiencia (en Sobre Mí).

**Cuándo se dispara:**
- Al hacer scroll horizontal en la timeline de experiencia
- Se dispara en milestones: 25%, 50%, 75%, 100% del scroll horizontal
- Solo se envía una vez por milestone

**Parámetros:**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `scroll_percentage` | number | Porcentaje de scroll horizontal | `25`, `50`, `75`, `100` |

**Ejemplo:**
```json
{
  "event": "experience_section_scrolled",
  "properties": {
    "scroll_percentage": 50
  }
}
```

**Uso en PostHog:**
- **Análisis:** Ver engagement con la sección de experiencia
- **Métricas:** Calcular qué porcentaje de usuarios exploran toda la experiencia

---

### `video_played`

**Descripción:** Se dispara cuando un usuario reproduce un video de YouTube en un proyecto.

**Cuándo se dispara:**
- Al hacer click en reproducir el video de YouTube
- Solo se envía una vez por video por visita
- Usa la YouTube IFrame API para detectar reproducción real

**Parámetros:**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `project_slug` | string | Slug del proyecto | `"calipso-sistema-diseno"` |
| `video_url` | string | URL del video de YouTube | `"https://youtube.com/..."` |

**Ejemplo:**
```json
{
  "event": "video_played",
  "properties": {
    "project_slug": "calipso-sistema-diseno",
    "video_url": "https://www.youtube.com/watch?v=..."
  }
}
```

**Uso en PostHog:**
- **Análisis:** Ver qué proyectos tienen más reproducciones de video
- **Métricas:** Calcular tasa de reproducción de videos

---

## 📧 Eventos de Formulario

### `contact_form_submitted`

**Descripción:** Se dispara cuando un usuario envía el formulario de contacto (tanto en éxito como en error).

**Cuándo se dispara:**
- Al enviar el formulario de contacto
- Se envía tanto si el envío fue exitoso como si hubo error
- Incluye métricas detalladas del comportamiento del usuario

**Parámetros:**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `form_status` | string | Estado del envío | `"success"`, `"error"` |
| `time_to_submit` | number | Tiempo en segundos desde carga hasta envío | `45`, `120` |
| `message_length` | number | Longitud del mensaje en caracteres | `120`, `500` |
| `submission_attempts` | number | Número de intentos previos (se incrementa en errores) | `1`, `2`, `3` |
| `device_type` | string | Tipo de dispositivo | `"mobile"`, `"desktop"`, `"tablet"` |
| `referrer` | string | Página de origen o "direct" | `"https://..."`, `"direct"` |
| `time_on_page` | number | Tiempo total en la página antes de enviar (segundos) | `120`, `300` |
| `has_name` | boolean | Si el campo nombre tiene valor | `true`, `false` |
| `has_email` | boolean | Si el campo email tiene valor | `true`, `false` |

**Ejemplo (éxito):**
```json
{
  "event": "contact_form_submitted",
  "properties": {
    "form_status": "success",
    "time_to_submit": 45,
    "message_length": 120,
    "submission_attempts": 1,
    "device_type": "desktop",
    "referrer": "https://tudominio.com/",
    "time_on_page": 120,
    "has_name": true,
    "has_email": true
  }
}
```

**Ejemplo (error):**
```json
{
  "event": "contact_form_submitted",
  "properties": {
    "form_status": "error",
    "time_to_submit": 30,
    "message_length": 50,
    "submission_attempts": 2,
    "device_type": "mobile",
    "referrer": "direct",
    "time_on_page": 90,
    "has_name": true,
    "has_email": false
  }
}
```

**Uso en PostHog:**
- **Análisis:** 
  - Tasa de éxito vs error
  - Tiempo promedio de llenado
  - Dispositivos más usados
  - Fuentes de tráfico más efectivas
- **Funnel:** Analizar abandono del formulario
- **Segmentación:** Filtrar por `device_type` para optimizar UX móvil
- **Métricas:**
  - `time_to_submit` < 5 segundos → posible bot
  - `submission_attempts` > 1 → problemas de UX
  - `message_length` muy corto → posible spam

---

### `cv_downloaded`

**Descripción:** Se dispara cuando un usuario descarga o abre el CV en PDF.

**Cuándo se dispara:**
- Al hacer click en un botón que lleva a un PDF (CV)
- Se abre en nueva pestaña

**Parámetros:**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `source_page` | string | Página desde donde se descargó | `"/"`, `"/sobre-mi"` |

**Ejemplo:**
```json
{
  "event": "cv_downloaded",
  "properties": {
    "source_page": "/sobre-mi"
  }
}
```

**Uso en PostHog:**
- **Análisis:** Ver desde qué páginas se descarga más el CV
- **Funnel:** Analizar flujo hacia descarga de CV

---

## 📈 Guía de Análisis en PostHog

### Funnels Recomendados

#### 1. Funnel de Conversión Principal
```
1. section_viewed (section_name: "hero", page: "/")
2. cta_clicked (cta_type: "hero_primary")
3. section_viewed (section_name: "proyectos", page: "/proyectos")
4. cta_clicked (cta_type: "section_cta", section_name: "proyectos")
5. project_viewed
```

#### 2. Funnel de Contacto
```
1. section_viewed (section_name: "contacto", page: "/contacto")
2. scroll_depth (page: "/contacto", depth_percentage: 50)
3. contact_form_submitted (form_status: "success")
```

#### 3. Funnel de Engagement
```
1. section_viewed (section_name: "hero")
2. scroll_depth (depth_percentage: 50)
3. scroll_depth (depth_percentage: 100)
```

### Análisis Recomendados

#### 1. CTAs Más Efectivos
- **Evento:** `cta_clicked`
- **Agrupar por:** `cta_type`
- **Métrica:** Count
- **Insight:** Ver qué tipos de CTAs generan más clicks

#### 2. Secciones Más Vistas
- **Evento:** `section_viewed`
- **Agrupar por:** `section_name`
- **Filtrar por:** `page` (para análisis por página)
- **Insight:** Identificar contenido más interesante

#### 3. Tasa de Abandono por Página
- **Evento:** `scroll_depth`
- **Agrupar por:** `page`
- **Métrica:** Porcentaje que alcanza cada milestone
- **Insight:** Identificar páginas con alto abandono

#### 4. Análisis de Formulario
- **Evento:** `contact_form_submitted`
- **Segmentar por:** `form_status` (success vs error)
- **Métricas:**
  - Tasa de éxito
  - Tiempo promedio de llenado (`time_to_submit`)
  - Dispositivos más usados (`device_type`)
  - Fuentes de tráfico (`referrer`)

#### 5. Proyectos Más Populares
- **Evento:** `project_viewed`
- **Agrupar por:** `project_slug` o `project_title`
- **Métrica:** Count
- **Insight:** Ver qué proyectos generan más interés

### Segmentos Útiles

#### Usuarios Engaged
```
section_viewed (section_name: "cta") AND scroll_depth (depth_percentage: 100)
```

#### Usuarios con Alto Engagement
```
scroll_depth (depth_percentage: 100) AND section_viewed (count > 5)
```

#### Usuarios que Descargaron CV
```
cv_downloaded
```

#### Usuarios que Enviaron Formulario
```
contact_form_submitted (form_status: "success")
```

### Dashboards Recomendados

1. **Dashboard de Engagement**
   - `section_viewed` por sección
   - `scroll_depth` por página
   - `cta_clicked` por tipo

2. **Dashboard de Conversión**
   - Funnel principal
   - Funnel de contacto
   - Tasa de conversión por fuente

3. **Dashboard de Contenido**
   - `project_viewed` por proyecto
   - `video_played` por proyecto
   - `section_viewed` por sección

4. **Dashboard de Formulario**
   - Tasa de éxito/error
   - Métricas de tiempo
   - Análisis por dispositivo

---

## 🔍 Búsqueda Rápida de Eventos

### Por Tipo de Interacción

**Clicks:**
- `cta_clicked` - Todos los clicks
- `filter_applied` - Filtros
- `load_more_clicked` - Ver más proyectos

**Visualizaciones:**
- `section_viewed` - Secciones vistas
- `project_viewed` - Proyectos vistos
- `scroll_depth` - Scroll depth

**Formularios:**
- `contact_form_submitted` - Envío de formulario

**Medios:**
- `video_played` - Reproducción de video
- `cv_downloaded` - Descarga de CV

**Engagement:**
- `experience_section_scrolled` - Scroll en experiencia

---

## 📝 Notas de Implementación

- Todos los eventos se envían a PostHog usando `posthog.capture()`
- Los eventos se trackean solo en el cliente (navegador)
- Los eventos incluyen automáticamente propiedades estándar de PostHog (user_id, session_id, etc.)
- Los eventos se envían de forma asíncrona y no bloquean la UI
- En desarrollo, algunos eventos muestran logs en consola para debugging

---

## 🔄 Actualizaciones

**Última actualización:** 2024
**Versión:** 1.0.0

Para actualizar esta documentación, edita `docs/ANALYTICS.md` y refleja los cambios en el código.
