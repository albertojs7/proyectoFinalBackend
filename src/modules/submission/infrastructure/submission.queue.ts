import { Queue } from "bullmq"

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

    async enqueue(submissionId: string, codeUrl: string) {
        await this.queue.add('run-submission', { 
            submissionId,
            codeUrl
        })
    }
}
