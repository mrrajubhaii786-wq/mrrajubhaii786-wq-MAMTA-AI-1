// src/queue/WorkerQueue.ts

export type JobStatus = "queued" | "processing" | "completed" | "failed";

export interface Job<T = any, R = any> {
  id: string;
  name: string;
  data: T;
  status: JobStatus;
  progress: number;
  result?: R;
  error?: string;
  createdAt: number;
  processedAt?: number;
  completedAt?: number;
}

type JobProcessor<T = any, R = any> = (job: Job<T, R>) => Promise<R>;

export class WorkerQueue<T = any, R = any> {
  private queueName: string;
  private jobs: Map<string, Job<T, R>> = new Map();
  private activeCount = 0;
  private maxConcurrency: number;
  private processor: JobProcessor<T, R> | null = null;
  private jobListeners: Set<(job: Job<T, R>) => void> = new Set();

  constructor(queueName: string, maxConcurrency = 2) {
    this.queueName = queueName;
    this.maxConcurrency = maxConcurrency;
  }

  // Register processor function
  public process(processorFn: JobProcessor<T, R>): void {
    this.processor = processorFn;
    console.log(`👷 [WorkerQueue] Processor registered for queue: "${this.queueName}"`);
    this.next();
  }

  // Add job to queue
  public add(name: string, data: T): Job<T, R> {
    const job: Job<T, R> = {
      id: `${this.queueName}-job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      data,
      status: "queued",
      progress: 0,
      createdAt: Date.now()
    };

    this.jobs.set(job.id, job);
    console.log(`📥 [WorkerQueue] Job added [${job.id}] to queue: "${this.queueName}"`);
    this.notifyListeners(job);
    
    // Trigger loop asynchronously
    setTimeout(() => this.next(), 0);
    return job;
  }

  // Get job by ID
  public getJob(jobId: string): Job<T, R> | undefined {
    return this.jobs.get(jobId);
  }

  // Get all active jobs
  public getJobs(): Job<T, R>[] {
    return Array.from(this.jobs.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  // Register state change listener
  public onJobUpdate(listener: (job: Job<T, R>) => void): () => void {
    this.jobListeners.add(listener);
    return () => {
      this.jobListeners.delete(listener);
    };
  }

  private notifyListeners(job: Job<T, R>): void {
    this.jobListeners.forEach(listener => {
      try {
        listener(job);
      } catch (err) {
        console.error("Error in job updater listener:", err);
      }
    });
  }

  // Main polling queue loop
  private async next(): Promise<void> {
    if (this.activeCount >= this.maxConcurrency || !this.processor) return;

    // Find first queued job
    const nextJob = Array.from(this.jobs.values()).find(j => j.status === "queued");
    if (!nextJob) return;

    // Transition state
    nextJob.status = "processing";
    nextJob.processedAt = Date.now();
    this.activeCount++;
    console.log(`⚙️ [WorkerQueue] Processing Job [${nextJob.id}] on worker thread...`);
    this.notifyListeners(nextJob);

    try {
      // Execute work
      const result = await this.processor(nextJob);
      nextJob.status = "completed";
      nextJob.result = result;
      nextJob.progress = 100;
      nextJob.completedAt = Date.now();
      console.log(`✅ [WorkerQueue] Job [${nextJob.id}] completed successfully.`);
    } catch (err: any) {
      nextJob.status = "failed";
      nextJob.error = err.message || String(err);
      console.error(`❌ [WorkerQueue] Job [${nextJob.id}] failed:`, err);
    } finally {
      this.activeCount--;
      this.notifyListeners(nextJob);
      // Recurse to handle pending jobs in parallel/sequence
      this.next();
    }
  }
}

// Singleton global AI queue instance
export const aiTaskQueue = new WorkerQueue<any, any>("ai-tasks", 2);

// Auto-register dummy processor to demonstrate execution loop
aiTaskQueue.process(async (job) => {
  console.log(`🤖 [WorkerQueue] Running heavy AI generation algorithm for task:`, job.name);
  
  // Simulate heavy model pipeline run (e.g., code synthesis)
  let progress = 0;
  for (let i = 0; i < 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 500));
    progress += 20;
    job.progress = progress;
    console.log(`[Job ${job.id}] Synthesis Progress: ${progress}%`);
  }
  
  return {
    synthesis: "Successfully generated premium SaaS code using Mamta AI swarms.",
    jobId: job.id,
    timestamp: Date.now()
  };
});
