export class EvolveAI {
  evolve(result: { success: boolean }) {
    if (result.success) {
      return "KEEP_CHANGE";
    }
    return "REVERT";
  }
}
