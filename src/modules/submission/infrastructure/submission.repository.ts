import { PrismaClient } from "@prisma/client";
import { SubmissionRepository } from "../domain/submission.repository";
import { Submission, SubmissionStatus } from "../domain/submission.entity";
import { randomUUID } from "crypto";

const prisma = new PrismaClient()

export class PrismaSubmissionRepository implements SubmissionRepository {
    async create(submission: Submission): Promise<Submission> {
        const created = await prisma.submission.create({
            data: {
                userId: submission.userId,
                challengeId: submission.challengeId,
                language: submission.language,
                codeUrl: submission.codeUrl || '',
                status: submission.status,
                score: submission.score ?? 0,
                timeMsTotal: submission.timeMsTotal ?? 0, 
            },
        })
        return new Submission(
            randomUUID(), 
            created.userId, 
            created.challengeId, 
            created.language, 
            SubmissionStatus.QUEUED,
            created.codeUrl,
            created.createdAt, 
            created.score ?? 0, 
            created.timeMsTotal ?? 0
        )
    }

    async findById(id: string): Promise<Submission | null> {
        const found = await prisma.submission.findUnique({
            where: { id },
            include: { cases: true }
        })
        if (!found) {
            return null
        }
        return new Submission(
            randomUUID(),
            found.userId, 
            found.challengeId, 
            found.language, 
            SubmissionStatus.QUEUED,
            found.codeUrl,
            found.createdAt, 
            found.score ?? 0, 
            found.timeMsTotal ?? 0, 
            found.cases
        )
    }

    async updateStatus(id: string, status: Submission["status"]): Promise<void> {
        await prisma.submission.update({
            where: { id },
            data: { status }
        })
    }
}