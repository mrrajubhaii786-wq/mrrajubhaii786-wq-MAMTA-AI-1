// src/brain/AGILimiter.ts

let cycleCount = 0;

/**
 * Checks the current AGI self-improvement cycle count. 
 * Throws an error to abort execution if loop threshold is exceeded.
 */
export function checkLimit(): void {
  cycleCount++;

  if (cycleCount > 20) {
    console.error("🚨 [AGILimiter] AGI threshold cycle limit reached (> 20)! Preventing potential loop recursion.");
    throw new Error("🚨 AGI limit reached");
  }
}

/**
 * Resets the cycle counter if needed.
 */
export function resetLimit(): void {
  cycleCount = 0;
}
