// src/brain/RetryEngine.ts

export async function retry<T>(fn: () => Promise<T>, retries = 5): Promise<T> {
  let delay = 1000;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      console.warn(`⚠️ [RetryEngine] Attempt ${i + 1} failed. Retrying in ${delay}ms...`, err);
      if (i === retries - 1) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2; // exponential backoff
    }
  }
  throw new Error("Max retries reached");
}
