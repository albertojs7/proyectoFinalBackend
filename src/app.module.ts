import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/interface/auth.module';
import { ChallengesModule } from './modules/challenges/interface/challenges.module';
import { SubmissionModule } from './modules/submission/interface/submission.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ChallengesModule,
    SubmissionModule
  ],
})
export class AppModule {}