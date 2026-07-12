// src/system/CircuitBreaker.ts

let failureCount = 0;
let isOpen = false;
let lastFailureTime = 0;
const COOLDOWN_MS = 30000; // 30 seconds cooldown before automatically checking again (half-open)

export function recordFailure() {
  failureCount++;
  lastFailureTime = Date.now();

  if (failureCount > 5) {
    isOpen = true;
    console.warn("🚨 [CircuitBreaker] Circuit OPEN due to repeated failures! System paused.");
  }
}

export function resetCircuit() {
  failureCount = 0;
  isOpen = false;
  console.log("🟢 [CircuitBreaker] Circuit RESET. System functioning normally.");
}

export function canExecute() {
  if (isOpen) {
    // Cooldown support
    if (Date.now() - lastFailureTime > COOLDOWN_MS) {
      console.log("🟠 [CircuitBreaker] Cooldown passed. Attempting recovery (HALF-OPEN state).");
      return true;
    }
    return false;
  }
  return true;
}
