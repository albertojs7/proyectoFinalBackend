import { Worker, QueueEvents } from "bullmq";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT || 6379),
};

const queueName = "submissions";

async function bootstrap() {
  const worker = new Worker(
    queueName,
    async (job) => {
      const { submissionId } = job.data;
      console.log(`[Worker] Ejecutando submission ${submissionId}...`);
      await new Promise((r) => setTimeout(r, 1000));
      console.log(`[Worker] ✅ Submission ${submissionId} completado`);
      return { status: "ACCEPTED" };
    },
    { connection }
  );

  const events = new QueueEvents(queueName, { connection });
  events.on("completed", ({ jobId }) =>
    console.log(`[Worker] Job completado: ${jobId}`)
  );
  events.on("failed", ({ jobId, failedReason }) =>
    console.error(`[Worker] Job falló: ${jobId}. Motivo: ${failedReason}`)
  );

  console.log(`[Worker] Esperando trabajos en la cola "${queueName}"...`);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
