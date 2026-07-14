export class PriorityAI {
  assign(state: { health: number; load: number }): "STABILIZE" | "OPTIMIZE" | "EXPAND" {
    if (state.health < 50) {
      return "STABILIZE";
    }

    if (state.load > 0.7) {
      return "OPTIMIZE";
    }

    return "EXPAND";
  }
}
