import { SubmissionRepository } from "../../domain/submission.repository";
import { Submission, SubmissionStatus } from "../../domain/submission.entity";
import { CreateSubmissionDto } from "../dto/createSubmission.dto";
import { submissionQueue } from "../../infrastructure/submission.queue";
import { randomUUID } from "crypto";
export class CreateSubmissionUseCase {
    constructor (
        private submissionRepo: SubmissionRepository,
        private queueService: submissionQueue
    ) {}

    async execute(data: CreateSubmissionDto): Promise<Submission> {
        const submission = new Submission(randomUUID(), data.userId, data.challengeId, data.language,  SubmissionStatus.QUEUED, data.codeUrl)
        const created = await this.submissionRepo.create(submission)
        // Encolar con todos los datos necesarios para el worker
        await this.queueService.enqueue({
            submissionId: created.id,
            codeUrl: data.codeUrl,
            language: data.language,
            challengeId: data.challengeId,
            userId: data.userId
        })
        return created
    }   
}