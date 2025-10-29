import { SubmissionRepository } from "../../domain/submission.repository";
import { Submission, SubmissionStatus } from "../../domain/submission.entity";
import { CreateSubmissionDto } from "../dto/createSubmission.dto";
import { SubmissionQueue } from "../../infrastructure/submission.queue";
import { randomUUID } from "crypto";

export class CreateSubmissionUseCase {
  constructor(
    private submissionRepo: SubmissionRepository,
    private queueService: SubmissionQueue
  ) {}

    async execute(data: CreateSubmissionDto): Promise<Submission> {
        const submission = new Submission(randomUUID(), data.userId, data.challengeId, data.language,  SubmissionStatus.QUEUED, data.codeUrl)
        const created = await this.submissionRepo.create(submission)
        // Encolar con el codeUrl para que el worker lo procese
        await this.queueService.enqueue(created.id, data.codeUrl)
        return created
    }   
}