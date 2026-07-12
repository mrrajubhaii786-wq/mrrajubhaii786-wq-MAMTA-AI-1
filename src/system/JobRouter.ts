import { aiQueue } from "./QueueManager";

/**
 * Dispatches a specified AI task into the resilient distributed Bull queue.
 */
export async function dispatchTask(taskType: string, payload: any) {
  console.log(`📥 [JobRouter] Dispatching task "${taskType}" to queue with payload:`, payload);
  try {
    const job = await aiQueue.add(
      { taskType, payload },
      {
        attempts: 5,
        backoff: { type: "exponential", delay: 1000 },
      }
    );
    console.log(`📥 [JobRouter] Task "${taskType}" successfully enqueued with Job ID: ${job.id}`);
    return job;
  } catch (err: any) {
    console.error(`❌ [JobRouter] Failed to enqueue task "${taskType}":`, err.message);
    throw err;
  }
}
