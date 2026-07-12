import Queue from "bull";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

console.log("📦 [QueueManager] Initializing Bull Queues with dynamic client creation.");

// Robust shared configuration options for Bull Queues
const queueOptions: Queue.QueueOptions = {
  createClient: (type, clientOpts) => {
    return new Redis(redisUrl, {
      maxRetriesPerRequest: null, // Critical for Bull
      enableReadyCheck: false,
      retryStrategy(times) {
        // Exponential backoff up to 10 seconds to handle connection drops gracefully
        return Math.min(times * 100, 10000);
      },
      ...clientOpts,
    });
  },
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true, // Clean up finished jobs automatically
  }
};

export const aiQueue = new Queue("mamta-ai", queueOptions);

// 🔥 Dead Letter Queue (DLQ) for failed/poisonous jobs
export const deadQueue = new Queue("mamta-dead", queueOptions);

aiQueue.on("completed", (job) => {
  console.log(`✅ [QueueManager] Job Completed successfully! ID: ${job.id}`);
});

aiQueue.on("failed", async (job, err) => {
  console.warn(`❌ [QueueManager] Job Failed! ID: ${job?.id}. Error: ${err.message}`);
  
  if (job && job.attemptsMade >= 5) {
    console.log(`💀 [QueueManager] Job ${job.id} reached maximum retries (${job.attemptsMade}). Moving to Dead Letter Queue (mamta-dead).`);
    try {
      await deadQueue.add({
        originalJobId: job.id,
        data: job.data,
        error: err.message,
        failedAt: Date.now()
      });
      console.log(`💀 [QueueManager] Job ${job.id} successfully logged in DLQ.`);
    } catch (dlqErr: any) {
      console.error("🚨 [QueueManager] Failed to register job in Dead Letter Queue:", dlqErr.message);
    }
  }
});

aiQueue.on("error", (err) => {
  console.warn("⚠️ [QueueManager] Bull Queue connection error:", err.message);
});

