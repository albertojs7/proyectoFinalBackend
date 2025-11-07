import { Queue } from "bullmq"

export interface JobData {
    submissionId: string;
    codeUrl: string;
    language: string;
    challengeId: string;
    userId: string;
}

export class submissionQueue {
    private queue: Queue

    constructor(){
        this.queue = new Queue('submissions', {
            connection: {
                host: process.env.REDIS_HOST || 'localhost',
                port: Number(process.env.REDIS_PORT) || 6379,
            }
        })
    }

    async enqueue(jobData: JobData) {
        await this.queue.add('run-submission', jobData)
    }
}
