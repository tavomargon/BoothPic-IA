# 🏗️ Arquitectura - BoothPic-IA

## 📐 Visión General de la Arquitectura

BoothPic-IA sigue una arquitectura **de microservicios distribuida** con separación clara entre capas, optimizada para manejo de contenido multimedia a gran escala.

```
┌─────────────────────────────────────────────────────────┐
│                    Capa de Presentación                 │
│  (React SPA, Mobile Apps, Web, VR/360° Viewers)        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              API Gateway & Proxy (Nginx)                 │
│        (Rate Limiting, SSL/TLS, Compresión)             │
└────────────────────┬────────────────────────────────────┘
                     │
     ┌───────────────┼───────────────┐
     │               │               │
┌────▼─────┐  ┌─────▼────┐  ┌──────▼───┐
│ Servicio  │  │ Servicio │  │ Servicio │
│ Contenido │  │  Usuarios │  │    IA    │
│  (Node)   │  │  (Node)  │  │ (Python) │
└────┬──────┘  └─────┬────┘  └──────┬───┘
     │               │              │
     └───────────────┼──────────────┘
                     │
          ┌──────────┼──────────┐
          │          │          │
      ┌───▼──┐  ┌────▼─┐  ┌────▼──┐
      │  DB  │  │Cache │  │Storage│
      │ PSQL │  │Redis │  │MinIO  │
      └──────┘  └──────┘  └───────┘

         │          │          │
         └──────────┼──────────┘
                    │
         ┌──────────▼──────────┐
         │  Message Queue      │
         │  (RabbitMQ/Kafka)   │
         └─────────────────────┘
```

## 🏢 Estructura de Directorios

```
BoothPic-IA/
├── backend/                    # Servicios backend
│   ├── src/
│   │   ├── api/               # Rutas y controladores
│   │   │   ├── auth/
│   │   │   ├── content/
│   │   │   ├── videos/
│   │   │   └── panoramic/
│   │   ├── services/          # Lógica de negocio
│   │   │   ├── ContentService.js
│   │   │   ├── VideoService.js
│   │   │   └── AIService.js
│   │   ├── models/            # Modelos de datos
│   │   ├── middleware/        # Middleware personalizado
│   │   ├── utils/             # Funciones utilitarias
│   │   ├── config/            # Configuración
│   │   └── index.js           # Punto de entrada
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # Aplicación React
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   │   ├── Gallery/
│   │   │   ├── VideoPlayer/
│   │   │   └── PanoramicViewer/
│   │   ├── pages/             # Páginas
│   │   ├── services/          # Servicios API
│   │   ├── hooks/             # Custom hooks
│   │   ├── context/           # Context API
│   │   ├── styles/            # CSS/SCSS
│   │   └── App.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── ai-service/                # Servicios de IA (Python)
│   ├── src/
│   │   ├── models/            # Modelos IA
│   │   ├── processors/        # Procesadores de contenido
│   │   ├── handlers/          # Manejadores de tareas
│   │   └── app.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
│
├── nginx/                     # Configuración Nginx
│   ├── nginx.conf
│   └── ssl/
│
├── init-scripts/              # Scripts de inicialización DB
│   ├── schema.sql
│   └── seed.sql
│
├── docker-compose.yml
├── README.md
├── SETUP.md
├── API.md
├── ARCHITECTURE.md
└── .gitignore
```

## 🔄 Flujos de Datos Principales

### 1. Flujo de Carga de Contenido

```
Usuario                Backend                     Storage
  │                       │                           │
  ├─ POST /upload ────────>│                           │
  │                       │ ─ Validar archivo        │
  │                       │ ─ Compresión             │
  │                       │                           │
  │                       ├ S3/MinIO upload ────────> │
  │                       │ <──── URL confirmación ─ │
  │                       │                           │
  │  <─ 201 Created ──────┤                           │
  │                       │ ─ DB: guardar metadata   │
  │                       │                           │
  │                       ├─ Cache invalidate        │
  │                       │                           │
  │                    [Evento a Cola de Procesos]
```

### 2. Flujo de Procesamiento con IA

```
Backend                AI Service             Storage
  │                         │                   │
  ├─ Enviar a Cola ────────>│                   │
  │  [Content procesado]    │                   │
  │                         ├─ Descargar archivo
  │                         │ <─────────────────┤
  │                         │                   │
  │                         ├─ Procesar con IA │
  │                         │  (enhance, tag,  │
  │                         │   etc)           │
  │                         │                   │
  │                         ├─ Subir resultado─────>│
  │                         │                   │
  │  <─ Callback OK ────────┤                   │
  │  [Actualizar estado]    │
  │
  └─ Notificar usuario
```

### 3. Flujo de Visualización de Contenido

```
Usuario              Frontend              Backend          Cache
  │                    │                    │               │
  ├─ Abrir galería    │                    │               │
  │                    ├─ GET /content ─────>                │
  │                    │                    ├─ Buscar ──────>│
  │                    │                    │<─ Hit ────────┤
  │                    │   <─ JSON list ────┤               │
  │                    │                    │               │
  │                    ├─ Cargar miniaturas│               │
  │                    │ (paralelo, múltiples)              │
  │                    │                    │               │
  │ <─ Galería renderizada ─┤                              │
  │                    │ <─ Imágenes cargadas               │
  │                    │
  ├─ Click en imagen  │
  │                    ├─ GET /content/:id ─>               │
  │                    │   <─ Datos completos               │
  │                    │
  │ <─ Visor interactivo (panorámico/video)
```

---

**Última actualización**: Junio 2026