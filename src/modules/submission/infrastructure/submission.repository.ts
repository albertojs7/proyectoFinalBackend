import { PrismaClient } from "@prisma/client";
import { SubmissionRepository } from "../domain/submission.repository";
import { Submission, SubmissionStatus } from "../domain/submission.entity";

const prisma = new PrismaClient();

export class PrismaSubmissionRepository implements SubmissionRepository {
  async create(submission: Submission): Promise<Submission> {
    const created = await prisma.submission.create({
      data: {
        userId: submission.userId,
        challengeId: submission.challengeId,
        language: submission.language,
        code: submission.code || '',
        status: submission.status,
        score: submission.score ?? 0,
        timeMsTotal: submission.timeMsTotal ?? 0,
      },
      include: { cases: true },
    });

    return new Submission(
      created.id,
      created.userId,
      created.challengeId,
      created.language,
      created.status as SubmissionStatus,
      created.code,
      created.createdAt,
      created.score ?? 0,
      created.timeMsTotal ?? 0,
      created.cases as any
    );
  }

  async findById(id: string): Promise<Submission | null> {
    const found = await prisma.submission.findUnique({
      where: { id },
      include: { cases: true }
    });
    if (!found) return null;

    return new Submission(
      found.id,
      found.userId,
      found.challengeId,
      found.language,
      found.status as SubmissionStatus,
      found.code,
      found.createdAt,
      found.score ?? 0,
      found.timeMsTotal ?? 0,
      found.cases as any
    );
  }

  async updateStatus(id: string, status: Submission["status"]): Promise<void> {
    await prisma.submission.update({
      where: { id },
      data: { status }
    });
  }
}
