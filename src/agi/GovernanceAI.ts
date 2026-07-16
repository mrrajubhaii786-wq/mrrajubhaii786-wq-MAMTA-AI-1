export class GovernanceAI {
  rules: string[] = ["NO_HARM", "OPTIMIZE_SYSTEM", "RESOURCE_EQUALITY", "COGNITIVE_STABILITY"];

  enforce(action: string) {
    const dangerousActions = ["harm", "abuse", "overload", "monopolize", "destroy"];
    if (dangerousActions.includes(action.toLowerCase())) {
      return "BLOCKED";
    }
    return "ALLOWED";
  }

  getRules() {
    return this.rules;
  }

  addRule(rule: string) {
    if (!this.rules.includes(rule)) {
      this.rules.push(rule);
    }
    return this.rules;
  }
}
