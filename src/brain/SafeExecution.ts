// src/brain/SafeExecution.ts

export async function safeRun<T>(fn: () => Promise<T>): Promise<T | { error: true; message: string }> {
  try {
    return await fn();
  } catch (err: any) {
    console.error("🔒 [SafeExecution] Caught system error:", err);
    return { error: true, message: err.message || String(err) };
  }
}
