import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { RegisterUserUseCase } from '../application/usecases/registerUser.usecase';
import { LoginUserUseCase } from '../application/usecases/loginUser.usecase';
import { UserRepositoryPostgres } from '../infrastructure/db/user.repository.postgres';
import { PrismaService } from '../../../shared/infrastructure/prisma.service';
import { JwtStrategy } from '../../../shared/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({  
        secret: process.env.JWT_SECRET || 'default-secret',
        signOptions: { expiresIn: (process.env.JWT_EXPIRES as any) || '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    JwtStrategy,
    UserRepositoryPostgres,
    {
      provide: RegisterUserUseCase,
      useFactory: (userRepository: UserRepositoryPostgres) => new RegisterUserUseCase(userRepository),
      inject: [UserRepositoryPostgres],
    },
    {
      provide: LoginUserUseCase,
      useFactory: (userRepository: UserRepositoryPostgres, jwtService: JwtService) => 
        new LoginUserUseCase(userRepository, jwtService),
      inject: [UserRepositoryPostgres, JwtService],
    },
  ],
  exports: [JwtStrategy],
})
export class AuthModule {}
