import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { RegisterUserUseCase } from '../application/usecases/registerUser.usecase';
import { LoginUserUseCase } from '../application/usecases/loginUser.usecase';
import { UserRepositoryPostgres } from '../infrastructure/db/user.repository.postgres';
import { PrismaService } from '../../../shared/infrastructure/prisma.service';

@Module({
  imports: [
    JwtModule.register({
        secret: process.env.JWT_SECRET || 'default-secret',
        signOptions: { expiresIn: (process.env.JWT_EXPIRES as any) || '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    RegisterUserUseCase,
    LoginUserUseCase,
    UserRepositoryPostgres,
    {
      provide: 'UserRepository',
      useClass: UserRepositoryPostgres,
    },
  ],
})
export class AuthModule {}
