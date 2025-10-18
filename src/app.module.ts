import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/interface/auth.module';
import { ChallengesModule } from './modules/challenges/interface/challenges.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ChallengesModule,
  ],
})
export class AppModule {}