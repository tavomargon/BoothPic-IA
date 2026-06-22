# 🎨 Panel de Administrador - BoothPic-IA

## 📑 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Estructura del Panel](#estructura-del-panel)
- [Módulos Principales](#módulos-principales)
- [Especificaciones Técnicas](#especificaciones-técnicas)

## 🎯 Descripción General

El panel de administrador es la interfaz central donde los propietarios de la plataforma pueden:

- ✅ Gestionar usuarios (aprobación, rechazo, suspensión)
- 🎨 Subir y gestionar plantillas de diseño
- 🖼️ Crear y organizar marcos fotográficos
- ✨ Configurar filtros de fotos (estilo Snapchat/Instagram)
- 🎬 Gestionar accesorios para fotografías
- ⚙️ Configurar ajustes generales de la plataforma
- 📊 Visualizar estadísticas y analíticas

## 🏗️ Estructura del Panel

```
┌─────────────────────────────────────────────────────────────┐
│  BoothPic-IA Admin Dashboard                     [🔔][👤]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────┐    ┌──────────────────────────────┐ │
│  │  MENÚ LATERAL      │    │   ÁREA PRINCIPAL             │ │
│  │                    │    │                              │ │
│  │ 📊 Dashboard       │    │   BIENVENIDA ADMIN           │ │
│  │ 👥 Usuarios        │    │   ─────────────────          │ │
│  │ 🎨 Plantillas      │    │   Estadísticas Rápidas       │ │
│  │ 🖼️ Marcos          │    │   Usuarios pendientes        │ │
│  │ ✨ Filtros         │    │   Contenido reciente         │ │
│  │ 🎁 Accesorios      │    │   Alertas                    │ │
│  │ ⚙️ Configuración    │    │                              │ │
│  │ 📈 Reportes        │    │                              │ │
│  │ 🚪 Cerrar sesión    │    │                              │ │
│  │                    │    │                              │ │
│  └────────────────────┘    └──────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Módulos Principales

### 1. 👥 Gestión de Usuarios

**Estados de Usuario:**
- 🟡 **PENDING** - Esperando aprobación
- 🟢 **APPROVED** - Aprobado y activo
- 🔴 **REJECTED** - Solicitud rechazada
- 🟣 **SUSPENDED** - Cuenta suspendida
- ⚫ **BANNED** - Cuenta bloqueada

### 2. 🎨 Gestión de Plantillas

**Especificaciones por Tipo:**

**Fondos:**
- Resolución: 3840x2160px (4K)
- Formatos: PNG, JPEG, WEBP
- Peso máximo: 15 MB

**Marcos:**
- Formatos: PNG (con transparencia), WEBP
- Peso máximo: 10 MB
- Transparencia: Requerida

**Stickers:**
- Resolución: 512x512px mínimo
- Formatos: PNG, WEBP (con transparencia)
- Peso máximo: 5 MB

### 3. ✨ Gestión de Filtros

**Categorías:**
- 📸 **Clásicos**: Blanco y Negro, Sepia, Vintage
- 🌈 **Colores**: Tonos vibrantes, Pastel, Neón
- ✨ **Efectos**: Bokeh, Blur, Luz suave
- 🎬 **Cinematográficos**: Estilo película, Grano
- 🎨 **Artísticos**: Acuarela, Óleo, Cartoon

---

**Última actualización**: Junio 2026