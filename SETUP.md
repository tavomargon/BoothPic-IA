# 🛠️ Guía de Instalación - BoothPic-IA

Este documento proporciona instrucciones detalladas para configurar el proyecto BoothPic-IA en tu máquina local.

## 📋 Requisitos Previos

### Sistema Operativo
- **macOS**, **Linux**, o **Windows** (WSL2 recomendado)

### Software Requerido
- **Git**: [Descargar](https://git-scm.com/)
- **Docker**: [Descargar](https://www.docker.com/products/docker-desktop)
- **Docker Compose**: Incluido con Docker Desktop

### Requisitos de Hardware
- CPU: Mínimo 2 núcleos
- RAM: Mínimo 4GB (recomendado 8GB)
- Espacio en disco: Mínimo 10GB

## 🚀 Instalación Rápida (Recomendado)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tavomargon/BoothPic-IA.git
cd BoothPic-IA
```

### 2. Configurar Variables de Entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Edita `.env` con tus configuraciones:

```env
# Base de Datos
DB_USER=boothpic
DB_PASSWORD=tu_contraseña_segura
DB_NAME=boothpic_db
DB_PORT=5432

# Redis
REDIS_PORT=6379

# API
API_PORT=3000
NODE_ENV=development
JWT_SECRET=tu_clave_secreta_jwt_muy_segura

# Frontend
FRONTEND_PORT=3001
REACT_APP_API_URL=http://localhost:3000

# Logging
LOG_LEVEL=info

# MinIO (opcional)
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=tu_contraseña_minio
```

### 3. Ejecutar con Docker Compose

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Detener servicios
docker-compose down
```

### 4. Verificar la Instalación

Una vez que los contenedores estén ejecutándose:

```bash
# Backend API
curl http://localhost:3000/health

# Frontend
open http://localhost:3001

# Redis
docker-compose exec redis redis-cli ping

# PostgreSQL
docker-compose exec postgres psql -U boothpic -d boothpic_db -c "SELECT VERSION();"
```

## 📦 Instalación Manual (Sin Docker)

### Backend (Node.js)

```bash
cd backend

# Instalar dependencias
npm install

# Configurar base de datos
npm run migrate

# Iniciar servidor
npm run dev
```

### Frontend (React)

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar desarrollo
npm start
```

### Base de Datos PostgreSQL

```bash
# Instalar PostgreSQL localmente
# Crear base de datos
createdb boothpic_db

# Restaurar schema (si existe)
psql boothpic_db < ./init-scripts/schema.sql
```

## 🔧 Configuración Avanzada

### Variables de Entorno Principales

| Variable | Descripción | Default |
|----------|-------------|----------|
| `NODE_ENV` | Entorno de ejecución | development |
| `DATABASE_URL` | URL conexión PostgreSQL | - |
| `REDIS_URL` | URL conexión Redis | - |
| `JWT_SECRET` | Clave secreta JWT | - |
| `API_PORT` | Puerto del API | 3000 |
| `LOG_LEVEL` | Nivel de logs | info |

### Perfiles de Docker Compose

Ejecutar servicios específicos:

```bash
# Con almacenamiento MinIO
docker-compose --profile with-storage up -d

# Con proxy Nginx (producción)
docker-compose --profile production up -d

# Todos los servicios
docker-compose --profile with-storage --profile production up -d
```

## 🐛 Troubleshooting

### Puerto ya está en uso

```bash
# Cambiar puerto en .env
API_PORT=3002
FRONTEND_PORT=3003

# O liberar puerto
lsof -ti:3000 | xargs kill -9
```

### Contenedores no inician

```bash
# Ver logs de error
docker-compose logs backend

# Reconstruir imagen
docker-compose up -d --build
```

### Error de base de datos

```bash
# Reiniciar PostgreSQL
docker-compose restart postgres

# Limpiar volúmenes (⚠️ borra datos)
docker-compose down -v
docker-compose up -d
```

### Permiso denegado al ejecutar Docker

```bash
# En Linux, añadir usuario al grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

## 🧪 Ejecutar Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test

# Con coverage
npm test -- --coverage
```

## 📚 Próximos Pasos

1. Consulta [API.md](API.md) para entender los endpoints disponibles
2. Revisa [ARCHITECTURE.md](ARCHITECTURE.md) para detalles técnicos
3. Configura tu IDE favorito (VS Code, WebStorm, etc.)
4. Comienza a desarrollar

## 🤝 Soporte

Si encuentras problemas:

1. Verifica que todos los requisitos estén instalados
2. Consulta los logs: `docker-compose logs`
3. Revisa los problemas conocidos en Issues
4. Abre un nuevo Issue con detalles del error

## 📝 Notas

- Asegúrate de cambiar `JWT_SECRET` en producción
- No commits `.env` al repositorio
- Mantén Docker y las imágenes actualizadas
- Realiza backups de datos periódicamente

---

**Última actualización**: Junio 2026