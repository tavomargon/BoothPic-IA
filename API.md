# 📚 Documentación de API - BoothPic-IA

Base URL: `http://localhost:3000/api/v1`

## 🔐 Autenticación

Todos los endpoints requieren un token JWT en el header:

```
Authorization: Bearer <tu_token_jwt>
```

### Obtener Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "contraseña"
}
```

**Respuesta (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "email": "usuario@example.com",
    "name": "Juan Pérez"
  }
}
```

## 📸 Endpoints de Contenido

### Listar Contenido

```http
GET /content
```

**Parámetros Query:**
- `type`: Tipo de contenido (photo, video, panoramic)
- `page`: Número de página (default: 1)
- `limit`: Items por página (default: 20)
- `sort`: Campo de ordenamiento (createdAt, name, views)

**Respuesta (200 OK):**
```json
{
  "data": [
    {
      "id": "content_123",
      "title": "Photo Event 001",
      "type": "photo",
      "url": "https://cdn.example.com/photo.jpg",
      "thumbnail": "https://cdn.example.com/photo_thumb.jpg",
      "createdAt": "2026-06-22T10:30:00Z",
      "views": 150,
      "size": 2048576
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

### Obtener Contenido por ID

```http
GET /content/:id
```

**Respuesta (200 OK):**
```json
{
  "id": "content_123",
  "title": "Photo Event 001",
  "type": "photo",
  "description": "Descripción del contenido",
  "url": "https://cdn.example.com/photo.jpg",
  "metadata": {
    "width": 3840,
    "height": 2160,
    "format": "jpg",
    "cameraModel": "Canon EOS R5"
  },
  "createdAt": "2026-06-22T10:30:00Z",
  "updatedAt": "2026-06-22T10:30:00Z",
  "views": 150,
  "likes": 42
}
```

### Subir Contenido

```http
POST /content/upload
Content-Type: multipart/form-data

{
  "file": <archivo>,
  "title": "Mi Foto",
  "type": "photo",
  "description": "Descripción opcional"
}
```

**Respuesta (201 Created):**
```json
{
  "id": "content_123",
  "title": "Mi Foto",
  "url": "https://cdn.example.com/photo.jpg",
  "uploadedAt": "2026-06-22T10:30:00Z"
}
```

### Actualizar Contenido

```http
PUT /content/:id
Content-Type: application/json

{
  "title": "Nuevo Título",
  "description": "Nueva descripción"
}
```

**Respuesta (200 OK):**
```json
{
  "id": "content_123",
  "title": "Nuevo Título",
  "description": "Nueva descripción",
  "updatedAt": "2026-06-22T11:00:00Z"
}
```

### Eliminar Contenido

```http
DELETE /content/:id
```

**Respuesta (204 No Content)**

## 🎬 Endpoints de Vídeos

### Listar Vídeos

```http
GET /videos
```

**Parámetros Query:**
- `quality`: Calidad (360p, 720p, 1080p, 4k)
- `sort`: Ordenamiento (duration, views, date)

**Respuesta (200 OK):**
```json
{
  "data": [
    {
      "id": "video_123",
      "title": "Event Recording",
      "duration": 3600,
      "quality": ["720p", "1080p", "4k"],
      "thumbnail": "https://cdn.example.com/video_thumb.jpg",
      "views": 500,
      "uploadedAt": "2026-06-22T10:30:00Z"
    }
  ]
}
```

### Procesar Vídeo con IA

```http
POST /videos/:id/process
Content-Type: application/json

{
  "operation": "enhance",
  "params": {
    "brightness": 1.1,
    "contrast": 1.2,
    "saturation": 1.15
  }
}
```

**Respuesta (202 Accepted):**
```json
{
  "jobId": "job_456",
  "status": "processing",
  "estimatedTime": 300,
  "message": "Vídeo en procesamiento"
}
```

## 🌐 Endpoints Panorámicos (360°)

### Listar Contenido Panorámico

```http
GET /panoramic
```

**Respuesta (200 OK):**
```json
{
  "data": [
    {
      "id": "pano_123",
      "title": "Event 360° View",
      "resolution": "8192x4096",
      "format": "equirectangular",
      "url": "https://cdn.example.com/panorama.jpg",
      "createdAt": "2026-06-22T10:30:00Z"
    }
  ]
}
```

### Obtener Datos Panorámicos

```http
GET /panoramic/:id
```

**Respuesta (200 OK):**
```json
{
  "id": "pano_123",
  "title": "Event 360° View",
  "url": "https://cdn.example.com/panorama.jpg",
  "metadata": {
    "resolution": "8192x4096",
    "format": "equirectangular",
    "hotspots": [
      {
        "id": "hotspot_1",
        "latitude": 45.5,
        "longitude": 120.3,
        "label": "Punto de interés",
        "content": "Información del lugar"
      }
    ]
  }
}
```

## 👥 Endpoints de Usuarios

### Registrar Usuario

```http
POST /auth/register
Content-Type: application/json

{
  "email": "nuevo@example.com",
  "password": "contraseña_segura",
  "name": "Juan Pérez"
}
```

**Respuesta (201 Created):**
```json
{
  "id": "user_123",
  "email": "nuevo@example.com",
  "name": "Juan Pérez",
  "createdAt": "2026-06-22T10:30:00Z"
}
```

### Obtener Perfil

```http
GET /users/profile
Authorization: Bearer <token>
```

**Respuesta (200 OK):**
```json
{
  "id": "user_123",
  "email": "usuario@example.com",
  "name": "Juan Pérez",
  "avatar": "https://cdn.example.com/avatar.jpg",
  "role": "user",
  "createdAt": "2026-06-22T10:30:00Z"
}
```

### Actualizar Perfil

```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Juan Carlos Pérez",
  "avatar": "data:image/jpeg;base64,..."
}
```

**Respuesta (200 OK):**
```json
{
  "id": "user_123",
  "name": "Juan Carlos Pérez",
  "updatedAt": "2026-06-22T11:00:00Z"
}
```

## 📊 Endpoints de Estadísticas

### Obtener Estadísticas

```http
GET /stats
Authorization: Bearer <token>
```

**Parámetros Query:**
- `period`: Rango de tiempo (day, week, month, year)
- `type`: Tipo de estadística (views, uploads, storage)

**Respuesta (200 OK):**
```json
{
  "period": "month",
  "totalViews": 5000,
  "totalUploads": 45,
  "storageUsed": 52428800,
  "storageLimit": 107374182400,
  "dailyStats": [
    {
      "date": "2026-06-22",
      "views": 200,
      "uploads": 5
    }
  ]
}
```

## ⚡ Endpoints de Utilidad

### Health Check

```http
GET /health
```

**Respuesta (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-06-22T10:30:00Z",
  "version": "1.0.0"
}
```

### Obtener Información de Versión

```http
GET /info
```

**Respuesta (200 OK):**
```json
{
  "version": "1.0.0",
  "environment": "development",
  "apiVersion": "v1"
}
```

## 🚨 Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Solicitud inválida |
| 401 | Unauthorized - Token no válido |
| 403 | Forbidden - No autorizado |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto en la solicitud |
| 413 | Payload Too Large - Archivo demasiado grande |
| 429 | Too Many Requests - Demasiadas solicitudes |
| 500 | Internal Server Error - Error del servidor |

### Formato de Error

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "El recurso solicitado no existe",
    "details": "Content with id 'content_123' not found",
    "timestamp": "2026-06-22T10:30:00Z"
  }
}
```

## 🔄 Rate Limiting

- Límite: 1000 requests por hora
- Header de respuesta: `X-RateLimit-Remaining`
- Esperar: `X-RateLimit-Reset` (timestamp Unix)

## 📝 Paginación

Todos los endpoints que retornan listas soportan:

```http
GET /endpoint?page=2&limit=50&sort=-createdAt
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "total": 500,
    "page": 2,
    "limit": 50,
    "pages": 10
  }
}
```

## 🧪 Ejemplos con cURL

```bash
# Obtener lista de contenido
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/content

# Subir archivo
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@photo.jpg" \
  -F "title=Mi Foto" \
  -F "type=photo" \
  http://localhost:3000/api/v1/content/upload

# Obtener estadísticas
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/stats?period=month"
```

---

**Última actualización**: Junio 2026
