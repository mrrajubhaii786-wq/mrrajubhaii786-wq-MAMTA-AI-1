// src/system/GlobalRetry.ts

export interface RetryOptions {
  attempts?: number;
  delay?: number;
  type?: "exponential" | "fixed";
}

/**
 * Executes a task with highly resilient exponential backoff retry logic.
 * Designed to handle flaky API calls, rate limits, and network glints.
 */
export async function runWithRetry<T>(
  taskFn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const attempts = options.attempts ?? 5;
  const initialDelay = options.delay ?? 1000;
  const backoffType = options.type ?? "exponential";

  let lastError: any;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      if (attempt > 1) {
        console.log(`🔄 [GlobalRetry] Attempting retry ${attempt}/${attempts} in progress...`);
      }
      return await taskFn();
    } catch (err: any) {
      lastError = err;
      console.warn(
        `⚠️ [GlobalRetry] Attempt ${attempt}/${attempts} failed. Error: ${err.message || String(err)}`
      );

      if (attempt === attempts) {
        break;
      }

      // Calculate delay based on backoff strategy
      const currentDelay =
        backoffType === "exponential"
          ? initialDelay * Math.pow(2, attempt - 1)
          : initialDelay;

      console.log(`⏳ [GlobalRetry] Sleeping for ${currentDelay}ms before next attempt.`);
      await new Promise(resolve => setTimeout(resolve, currentDelay));
    }
  }

  throw new Error(`[GlobalRetry] Failed after ${attempts} attempts. Last error: ${lastError?.message || String(lastError)}`);
}

/**
 * A highly resilient task queue that mimics Bull API for global task processing.
 */
export class DistributedTaskQueue<T = any, R = any> {
  private queueName: string;
  private jobs: Array<{ id: string; task: () => Promise<R>; attempts: number; maxAttempts: number }> = [];
  private activeJobsCount = 0;
  private maxConcurrency: number;

  constructor(queueName: string, maxConcurrency = 3) {
    this.queueName = queueName;
    this.maxConcurrency = maxConcurrency;
  }

  public async add(task: () => Promise<R>, options?: { attempts?: number }): Promise<string> {
    const jobId = `${this.queueName}-job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    this.jobs.push({
      id: jobId,
      task,
      attempts: 0,
      maxAttempts: options?.attempts || 5
    });

    console.log(`📥 [GlobalRetryQueue] Task registered to queue [${this.queueName}] with ID: ${jobId}`);
    
    // Trigger queue processing asynchronously
    setTimeout(() => this.processNext(), 0);
    return jobId;
  }

  private async processNext(): Promise<void> {
    if (this.activeJobsCount >= this.maxConcurrency || this.jobs.length === 0) return;

    const nextJobIndex = this.jobs.findIndex(j => j.attempts === 0);
    if (nextJobIndex === -1) return;

    const job = this.jobs[nextJobIndex];
    this.activeJobsCount++;
    job.attempts++;

    try {
      await runWithRetry(job.task, {
        attempts: job.maxAttempts,
        delay: 1000,
        type: "exponential"
      });
      // Successfully completed, remove from queue
      this.jobs = this.jobs.filter(j => j.id !== job.id);
      console.log(`✅ [GlobalRetryQueue] Job [${job.id}] completed successfully.`);
    } catch (err: any) {
      console.error(`❌ [GlobalRetryQueue] Job [${job.id}] failed after all retries:`, err);
      // Remove failed job from queue to prevent blockages
      this.jobs = this.jobs.filter(j => j.id !== job.id);
    } finally {
      this.activeJobsCount--;
      this.processNext();
    }
  }
}

// Global instance matching the bull API pattern for developer convenience
export const globalAIQueue = new DistributedTaskQueue("global-ai");
