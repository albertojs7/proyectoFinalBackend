import { User } from "../../auth/domain/user.entity"
export enum SubmissionStatus {
    QUEUED = 'QUEUED',
    RUNNING = 'RUNNING',
    ACCEPTED = 'ACCEPTED',
    WRONG_ANSWER = 'WA',
    TIME_LIMIT_EXCEEDED = 'TLE',
    RUNTIME_ERROR = 'RE',
    COMPILATION_ERROR = 'CE'
}

export interface SubmissionCaseResult {
    caseId: number;
    status: string;
    timeMs: number;
}

export class Submission {
    public readonly createdAt: Date
    public score: number
    public timeMsTotal: number
    public cases: SubmissionCaseResult[]

    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly challengeId: string,
        public readonly language: string,
        public readonly status: SubmissionStatus.QUEUED,
        public readonly codeUrl?: string,
        createdAt?: Date,
        score : number = 0,
        timeMsTotal : number = 0,
        cases: SubmissionCaseResult[] = []
    ) {
        this.createdAt = createdAt ?? new Date()
        this.score = score
        this.timeMsTotal = timeMsTotal
        this.cases = cases
    }
}