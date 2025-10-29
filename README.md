# 🧠 Plataforma de Juez Online – Proyecto Final Backend

Proyecto desarrollado bajo principios de **Clean Architecture**, utilizando:

- ⚙️ **NestJS** como framework backend.
- 🗄️ **PostgreSQL** para persistencia.
- 🚀 **Redis + BullMQ** para colas de procesamiento de submissions.
- 🧵 **Worker** que consume la cola y ejecuta código en contenedores aislados.
- 🐳 **Docker Compose** para orquestar servicios.
- 📘 **Swagger** para documentación interactiva de la API.
- 🔐 **JWT Authentication** con guards compartidos.
- 📦 **AWS S3** para almacenamiento de código fuente.

---

## 🧱 Requisitos previos

- Node.js 20+
- Docker y Docker Compose
- Prisma CLI (`npx prisma`)
- PNPM o NPM

---

## ⚙️ Variables de entorno

### `.env` para desarrollo local

```bash
DATABASE_URL="postgresql://user:pass@localhost:5433/clean_nest"
PORT=3000
QUEUE_SUBMISSIONS="submissions"
JWT_SECRET=supersecret
JWT_EXPIRES=1h

AWS_REGION="us-east-x"
AWS_ACCESS_KEY_ID="something"
AWS_SECRET_ACCESS_KEY="something"
AWS_S3_BUCKET="something"
AWS_S3_PRESIGNED_EXPIRY=900

REDIS_HOST=localhost
REDIS_PORT=6379
```

> ⚠️ **Importante:** Cambia las credenciales de AWS por las tuyas.

---

## 🐳 Opción 1: Ejecución completa con Docker Compose (Recomendado)

### Paso 1: Levantar todos los servicios

```bash
docker compose up --build -d
```

Esto levanta:

- 🗄️ **PostgreSQL** en puerto `5432`
- 🚀 **Redis** en puerto `6379`
- ⚙️ **Backend NestJS** en puerto `3000`
- 🧵 **Worker** para procesar submissions (no aún)

### Paso 2: Verificar que los contenedores estén corriendo

```bash
docker ps
```

Deberías ver:

```bash
CONTAINER ID   IMAGE              STATUS                   PORTS                    NAMES
xxxxx          postgres:16        Up (healthy)             0.0.0.0:5432->5432/tcp   projectBack
xxxxx          redis:7-alpine     Up                       0.0.0.0:6379->6379/tcp   projectRedis
xxxxx          proyect-backend    Up                       0.0.0.0:3000->3000/tcp   appBack
```

### Paso 3: Aplicar migraciones de Prisma (dentro del contenedor)

```bash
docker exec -it appBack npx prisma migrate deploy
```

### Paso 4: (Opcional) Generar el cliente de Prisma

```bash
docker exec -it appBack npx prisma generate
```

### Paso 5: Verificar que funciona

Accede a Swagger:

```bash
http://localhost:3000/docs
```

### Ver logs en tiempo real

```bash
# Backend
docker logs -f appBack

# Worker
docker logs -f workerSubmissions

# Redis
docker logs -f projectRedis

# PostgreSQL
docker logs -f projectBack
```

### Detener todo

```bash
docker compose down
```

### Limpiar volúmenes (resetear base de datos)

```bash
docker compose down -v
```

---

## 💻 Opción 2: Desarrollo local (Backend fuera de Docker)

Útil para desarrollo con hot-reload y debugging.

### Paso 1: Levantar solo PostgreSQL y Redis

```bash
docker compose up -d db redis
```

Verifica que estén corriendo:

```bash
docker ps
```

### Paso 2: Generar el cliente de Prisma

```bash
npx prisma generate
```

### Paso 3: Ejecutar migraciones

```bash
npx prisma migrate dev
```

Si quieres crear una nueva migración:

```bash
npx prisma migrate dev --name <nombre_descriptivo>
```

### Paso 4: Iniciar el backend en modo desarrollo

```bash
npm run start:dev
```

Verás:

```ts
[Nest] 12345  - 29/10/2025, 19:00:00     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 29/10/2025, 19:00:01     LOG [NestApplication] Nest application successfully started
[Nest] 12345  - 29/10/2025, 19:00:01     LOG Application listening on port 3000
```

### Paso 5: (Opcional) Iniciar el worker localmente

En otra terminal:

```bash
npm run start:worker
```

> ⚠️ Asegúrate de compilar primero con `npm run build`

### Paso 6: Verificar conexiones

**PostgreSQL:**

```bash
docker exec -it projectBack psql -U user -d clean_nest -c "SELECT version();"
```

**Redis:**

```bash
docker exec -it projectRedis redis-cli ping
# Respuesta: PONG
```

### Paso 7: Acceder a Prisma Studio (opcional)

Para explorar y editar datos visualmente:

```bash
npx prisma studio
```

Abre automáticamente: `http://localhost:5555`

---

## 🧰 Comandos útiles de Prisma

### Generar cliente después de cambios en schema.prisma

```bash
npx prisma generate
```

### Crear una nueva migración

```bash
npx prisma migrate dev --name nombre_de_la_migracion
```

### Aplicar migraciones en producción

```bash
npx prisma migrate deploy
```

### Resetear la base de datos (⚠️ BORRA TODO)

```bash
npx prisma migrate reset
```

### Ver estado de migraciones

```bash
npx prisma migrate status
```

### Formatear schema.prisma

```bash
npx prisma format
```

---

## 📘 Swagger – Documentación interactiva

Accede a la documentación de la API:

```bash
http://localhost:3000/docs
```

### Probar endpoints protegidos con JWT

1. **Registra un usuario** en `POST /auth/register`
2. **Haz login** en `POST /auth/login` → Copia el `access_token`
3. **Click en "Authorize" 🔓** (arriba a la derecha)
4. **Pega el token** (sin "Bearer")
5. **Ahora puedes usar rutas protegidas** como `GET /challenges` o `DELETE /challenges/:id`

---

## 🧪 Testing de la aplicación

### Flujo completo de prueba

#### 1. Registrar usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### 2. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Respuesta:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Obtener URL presigned para subir código

```bash
curl -X POST http://localhost:3000/submissions/presignedurl \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "solution.py"
  }'
```

Respuesta:

```json
{
  "url": "https://codes-backend.s3.amazonaws.com/...",
  "key": "submissions/user-id/timestamp-solution.py"
}
```

#### 4. Subir archivo a S3 (usando la URL presigned)

```bash
curl -X PUT "URL_PRESIGNED_AQUI" \
  --upload-file solution.py \
  -H "Content-Type: text/plain"
```

#### 5. Crear submission

```bash
curl -X POST http://localhost:3000/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id",
    "challengeId": "challenge-id",
    "language": "python",
    "codeUrl": "submissions/user-id/timestamp-solution.py"
  }'
```

#### 6. Verificar en logs del worker

```bash
docker logs -f workerSubmissions
```

---

## 🔍 Troubleshooting

### Error: `ENOTFOUND redis`

- ✅ Verifica que Redis esté corriendo: `docker ps | grep redis`
- ✅ En `.env` local usa `REDIS_HOST=localhost`
- ✅ En Docker usa `REDIS_HOST=redis`

### Error: `P1000: Authentication failed against database`

- ✅ Verifica que PostgreSQL esté corriendo: `docker ps | grep postgres`
- ✅ Verifica credenciales en `.env`
- ✅ En local usa `localhost:5432`, en Docker usa `db:5432`

### Error: `Unique constraint failed (challengeId, index)`

- ✅ Ya existe un TestCase con ese `challengeId` e `index`
- ✅ Usa un índice diferente o elimina el TestCase existente

### Error: `404 Not Found` al descargar de S3

- ✅ Verifica que el archivo se subió correctamente a S3
- ✅ Asegúrate de guardar solo la **key** en `codeUrl`, no la URL completa

### El worker no procesa jobs

- ✅ Verifica que Redis esté corriendo
- ✅ Verifica logs: `docker logs workerSubmissions`
- ✅ Verifica que el worker esté conectado al mismo Redis que el backend

---

## 📦 Estructura del proyecto

```bash
src/
├── main.ts                    # Entry point
├── app.module.ts              # Root module
├── currentWorker.ts           # Worker para procesar submissions
├── modules/
│   ├── auth/                  # Módulo de autenticación
│   │   ├── application/       # Use cases y DTOs
│   │   ├── domain/            # Entidades y repositorios (ports)
│   │   ├── infrastructure/    # Implementaciones (adapters)
│   │   └── interface/         # Controllers y módulos
│   ├── challenges/            # Módulo de desafíos
│   └── submission/            # Módulo de submissions
└── shared/                    # Código compartido
    ├── guards/                # JWT y Roles guards
    ├── decorators/            # Custom decorators
    ├── strategies/            # Passport strategies
    └── infrastructure/        # Prisma, servicios compartidos

prisma/
├── schema.prisma             # Schema de base de datos
└── migrations/               # Historial de migraciones
```

---

## 🚀 Deploy en producción

### Variables de entorno en producción

Asegúrate de cambiar:

- ✅ `JWT_SECRET` a un valor seguro aleatorio
- ✅ `DATABASE_URL` a tu base de datos de producción
- ✅ Credenciales de AWS reales
- ✅ `REDIS_HOST` y `REDIS_PORT` según tu servicio Redis

### Ejecutar migraciones

```bash
npx prisma migrate deploy
```

### Build de producción

```bash
npm run build
npm run start
```
