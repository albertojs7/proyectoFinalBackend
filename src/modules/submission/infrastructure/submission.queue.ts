import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";

@Injectable()
export class SubmissionQueue {
  private readonly queue: Queue;

  constructor() {
    this.queue = new Queue("submissions", {
      connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT || 6379),
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    });
  }

  async enqueue(submissionId: string) {
    
    await this.queue.add("run-submission", { submissionId });
  }
}