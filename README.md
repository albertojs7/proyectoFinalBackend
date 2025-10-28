# 🧠 Plataforma de Juez Online – Proyecto Final Backend

Proyecto desarrollado bajo principios de **Clean Architecture**, utilizando:

- ⚙️ **NestJS** como framework backend.
- 🗄️ **PostgreSQL** para persistencia.
- 🚀 **Redis + BullMQ** para colas de procesamiento de submissions.
- 🧵 **Worker** que consume la cola y simula ejecución de código.
- 🐳 **Docker Compose** para orquestar servicios.
- 📘 **Swagger** para documentación interactiva.

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
REDIS_HOST=localhost
REDIS_PORT=6379
QUEUE_SUBMISSIONS=submissions
JWT_SECRET=supersecret
JWT_EXPIRES="24h"
PORT=3000
```

> En **Docker**, el backend usa `DATABASE_URL="postgresql://user:pass@db:5432/clean_nest"` (host `db`).

---

## 🐳 Ejecución con Docker

Construir y levantar todos los servicios:

```bash
docker compose up --build -d
```

Ver contenedores activos:

```bash
docker ps
```

Esperado:

- `projectBack` → PostgreSQL (healthy)
- `redisQueue` → Redis
- `appBack` → Backend NestJS
- `workerSubmissions` → Worker BullMQ

Detener:

```bash
docker compose down
```

Ver logs:

```bash
docker logs appBack --tail 50
docker logs workerSubmissions --tail 50
```

---

## 💻 Desarrollo local (API fuera de Docker)

1️⃣ Levanta solo DB y Redis:

```bash
docker compose up -d db redis
```

2️⃣ Instala dependencias y genera Prisma:

```bash
npm install
npx prisma generate
```

3️⃣ Ejecuta migraciones:

```bash
npx prisma migrate dev
```

4️⃣ Inicia NestJS:

```bash
npm run start:dev
```

5️⃣ (Opcional) Inicia el worker local:

```bash
npm run start:worker
```

> ⚠️ Asegúrate que `.env` use `localhost` (no `db`).

---

## 🧰 Prisma

**Dentro del contenedor backend:**

```bash
docker exec -it appBack sh
npx prisma generate
npx prisma migrate dev
```

**Desde local:**

```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

> Local = `localhost`, Docker = `db`.

---

## 📘 Swagger – Documentación de la API

Accede en:

```bash
http://localhost:3000/docs
```

---
