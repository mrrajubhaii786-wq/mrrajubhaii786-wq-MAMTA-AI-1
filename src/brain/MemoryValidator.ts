// src/brain/MemoryValidator.ts

export function validateMemory(entry: any): boolean {
  if (!entry || !entry.input || !entry.result) {
    return false;
  }

  const resultStr = typeof entry.result === "string" ? entry.result : JSON.stringify(entry.result);

  if (resultStr.toLowerCase().includes("error")) {
    return false;
  }

  return true;
}
