import { Queue } from "bullmq"

export class submissionQueue {
    private queue: Queue

    constructor(){
        this.queue = new Queue('submissions', {
            connection: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT),
            }
        })
    }
    async enqueue(submissionId: string) {
        await this.queue.add('run-submission', { submissionId })
    }
}