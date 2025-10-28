# Guía de uso de Guards JWT

## 1. Proteger un controlador completo

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/interface/guards/jwt-auth.guard';

@Controller('challenges')
@UseGuards(JwtAuthGuard) // 🔒 Protege todas las rutas
export class ChallengesController {
  
  @Get()
  findAll() {
    // Solo usuarios autenticados pueden acceder
  }
}
```

## 2. Proteger rutas específicas

```typescript
@Controller('challenges')
export class ChallengesController {
  
  @Get()
  findAll() {
    // Ruta pública
  }
  
  @Post()
  @UseGuards(JwtAuthGuard) // 🔒 Solo esta ruta está protegida
  create() {
    // Solo usuarios autenticados
  }
}
```

## 3. Proteger por roles

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/interface/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/interface/guards/roles.guard';
import { Roles } from '../../auth/interface/decorators/roles.decorator';
import { UserRole } from '../../auth/domain/user.entity';

@Controller('challenges')
@UseGuards(JwtAuthGuard, RolesGuard) // Orden importante: primero JWT, luego Roles
export class ChallengesController {
  
  @Post()
  @Roles(UserRole.ADMIN) // 🔒 Solo administradores
  create() {
    // Solo admins pueden crear
  }
  
  @Get()
  @Roles(UserRole.ADMIN, UserRole.STUDENT) // 🔒 Ambos roles
  findAll() {
    // Admins y estudiantes
  }
}
```

## 4. Obtener usuario actual

```typescript
import { CurrentUser } from '../../auth/interface/decorators/current-user.decorator';

@Controller('challenges')
@UseGuards(JwtAuthGuard)
export class ChallengesController {
  
  @Post()
  create(
    @Body() dto: CreateChallengeDto,
    @CurrentUser() user: any // Usuario del token JWT
  ) {
    console.log('Usuario:', user.email, user.role);
    return this.createChallenge.execute(dto);
  }
}
```

## 5. Probar con cURL

### Registrar usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

Respuesta:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Usar token en peticiones

```bash
curl http://localhost:3000/challenges \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 6. Payload del JWT

El token contiene:

```json
{
  "id": "clxxx...",
  "email": "juan@example.com",
  "role": "STUDENT",
  "iat": 1234567890,
  "exp": 1234654290
}
```

## 7. Errores comunes

- **401 Unauthorized**: No se envió token o es inválido
- **403 Forbidden**: El usuario no tiene el rol requerido
- **Token expired**: El token expiró (revisar JWT_EXPIRES en .env)
