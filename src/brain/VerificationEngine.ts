export class VerificationEngine {
  verify(result: string): boolean {
    if (!result) return false;

    const lower = result.toLowerCase();
    if (lower.includes("error") || lower.includes("failed") || lower.includes("crash")) {
      return false;
    }

    return true;
  }
}
