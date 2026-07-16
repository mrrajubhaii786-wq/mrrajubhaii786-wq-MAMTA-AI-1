export class UniversalDecision {
  decide(actions: string[]) {
    return actions[0] || "IDLE";
  }
}
