export class StateConsensus {
  validate(states: Array<{ valid: boolean; name?: string }>) {
    if (!states || states.length === 0) return true;
    return states.every(s => s.valid !== false);
  }
}
