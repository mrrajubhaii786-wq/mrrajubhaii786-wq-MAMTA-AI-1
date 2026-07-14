export class ConflictAI {
  detect(actions: string[]): boolean {
    // Flag if competing actions are run simultaneously (e.g. DEPLOY + ROLLBACK, STABILIZE + STRESS_TEST)
    const normalized = actions.map(a => a.toUpperCase());
    
    if (normalized.includes("DEPLOY") && normalized.includes("ROLLBACK")) {
      return true;
    }

    if (normalized.includes("OPTIMIZE") && normalized.includes("DEGRADE")) {
      return true;
    }

    if (normalized.includes("LOCK") && normalized.includes("MUTATE")) {
      return true;
    }

    return false;
  }
}
