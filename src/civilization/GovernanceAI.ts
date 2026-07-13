export class GovernanceAI {
  rules = [
    "NO system destruction",
    "NO unsafe commands",
    "ONLY approved actions",
    "SECURE cryptographic vault access",
    "FAIR decentralized trade routing"
  ];

  validate(action: string): boolean {
    const forbidden = ["delete", "shutdown", "destroy", "kill", "rm -rf", "wipe"];
    const normalized = action.toLowerCase();
    
    for (const term of forbidden) {
      if (normalized.includes(term)) {
        return false;
      }
    }
    return true;
  }

  getRules() {
    return this.rules;
  }
}
