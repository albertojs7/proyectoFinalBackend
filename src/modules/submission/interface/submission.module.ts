import { Module } from "@nestjs/common";
import { SubmissionController } from "./submission.controller";
import { submissionQueue } from "../infrastructure/submission.queue";
import { CreateSubmissionUseCase } from "../application/usecases/createSubmission.UseCase";
import { PrismaSubmissionRepository } from "../infrastructure/submission.repository";

@Module({
    controllers: [SubmissionController],
    providers: [
        PrismaSubmissionRepository,
        submissionQueue,
        {
            provide: CreateSubmissionUseCase,
            useFactory: (repo: PrismaSubmissionRepository, queue: submissionQueue) => {
                return new CreateSubmissionUseCase(repo, queue)
            },
            inject: [PrismaSubmissionRepository, submissionQueue]
        }
    ]
})
export class SubmissionModule {}