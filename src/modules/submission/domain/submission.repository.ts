import { Submission } from "./submission.entity";

export interface SubmissionRepository {
    create(submission: Submission): Promise<Submission>
    findById(id: string): Promise<Submission | null>
    // findByUser(userId: string): Promise<Submission[]>
    // findByChallenge(challengeId: string): Promise<Submission[]>
    updateStatus(id: string, status: Submission["status"]): Promise<void>
}