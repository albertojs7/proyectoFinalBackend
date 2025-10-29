import { Module } from "@nestjs/common";
import { SubmissionController } from "./submission.controller";
import { SubmissionQueue } from "../infrastructure/submission.queue";
import { CreateSubmissionUseCase } from "../application/usecases/createSubmission.UseCase";
import { GetPresignedUrlUseCase } from "../application/usecases/getPresignedUrl.usecase";
import { PrismaSubmissionRepository } from "../infrastructure/submission.repository";
import { S3Service } from "../infrastructure/s3.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtAuthGuard } from "../../../shared/guards/jwt-auth.guard";
import { PrismaService } from "../../../shared/infrastructure/prisma.service";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'default-secret',
        })
    ],
    controllers: [SubmissionController],
    providers: [
        PrismaService,
        PrismaSubmissionRepository,
        S3Service,
        SubmissionQueue,
        JwtAuthGuard,
        {
            provide: CreateSubmissionUseCase,
            useFactory: (repo: PrismaSubmissionRepository, queue: SubmissionQueue) => {
                return new CreateSubmissionUseCase(repo, queue)
            },
            inject: [PrismaSubmissionRepository, SubmissionQueue]
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