# 🚀 Configuración PostgreSQL + Prisma + Docker

## ✅ Cambios realizados

1. **Prisma Schema** - Modelo User con PostgreSQL
2. **User Entity** - Tipo compatible con Prisma
3. **PrismaService** - Inyección de dependencias NestJS
4. **UserRepositoryPostgres** - Reemplaza el repositorio in-memory
5. **Dockerfile** - Imagen minimalista NestJS con migraciones automáticas
6. **docker-compose.yml** - PostgreSQL + App
7. **Migraciones automáticas** - Prisma genera todo automáticamente

## 🚀 Para usar con Docker

```bash
# 1. Levanta todo
docker-compose up --build

# 2. Espera a que esté listo (verás: "Server running on port 3000")

# 3. Usa la API
curl http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123"}'
```

## 📝 Variables de entorno (.env)

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/desafios_db"
JWT_SECRET="secret-key-change-in-production"
JWT_EXPIRES="24h"
PORT=3000
```

## 🧹 Archivos modificados
- `prisma/schema.prisma` - +Modelo User
- `src/modules/auth/domain/user.entity.ts` - Convertido a type
- `src/shared/infrastructure/prisma.service.ts` - Creado
- `src/modules/auth/infrastructure/db/user.repository.postgres.ts` - Creado
- `src/modules/auth/interface/auth.module.ts` - Usa PostgreSQL
- `Dockerfile` - Compilación + inicio con migraciones automáticas
- `docker-compose.yml` - PostgreSQL + App
- `.dockerignore` - Exclusiones
