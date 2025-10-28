import { Module } from "@nestjs/common";
import { SubmissionController } from "./submission.controller";
import { submissionQueue } from "../infrastructure/submission.queue";
import { CreateSubmissionUseCase } from "../application/usecases/createSubmission.UseCase";
import { GetPresignedUrlUseCase } from "../application/usecases/getPresignedUrl.usecase";
import { PrismaSubmissionRepository } from "../infrastructure/submission.repository";
import { S3Service } from "../infrastructure/s3.service";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "../../auth/interface/auth.module";

@Module({
    imports: [JwtModule, AuthModule],
    controllers: [SubmissionController],
    providers: [
        PrismaSubmissionRepository,
        S3Service,
        submissionQueue,
        {
            provide: CreateSubmissionUseCase,
            useFactory: (repo: PrismaSubmissionRepository, queue: submissionQueue) => {
                return new CreateSubmissionUseCase(repo, queue)
            },
            inject: [PrismaSubmissionRepository, submissionQueue]
        },
        {
            provide: GetPresignedUrlUseCase,
            useFactory: (s3Service: S3Service) => {
                return new GetPresignedUrlUseCase(s3Service)
            },
            inject: [S3Service]
        }
    ]
})
export class SubmissionModule {}