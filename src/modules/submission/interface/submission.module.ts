import { Module } from "@nestjs/common";
import { SubmissionController } from "./submission.controller";
import { SubmissionQueue } from "../infrastructure/submission.queue";
import { CreateSubmissionUseCase } from "../application/usecases/createSubmission.UseCase";
import { PrismaSubmissionRepository } from "../infrastructure/submission.repository";

@Module({
  controllers: [SubmissionController],
  providers: [
    PrismaSubmissionRepository,
    SubmissionQueue,
    {
      provide: CreateSubmissionUseCase,
      useFactory: (repo: PrismaSubmissionRepository, queue: SubmissionQueue) => {
        return new CreateSubmissionUseCase(repo, queue);
      },
      inject: [PrismaSubmissionRepository, SubmissionQueue]
    }
  ],
  exports: []  // si otro módulo necesitara el usecase, expórtalo aquí
})
export class SubmissionModule {}