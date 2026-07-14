export class WillAI {
  decideGoal(context: { errors: number; growth: number; systemLoad?: number }) {
    if (context.errors > 3) {
      return "STABILIZE_SYSTEM";
    }

    if (context.growth < 50) {
      return "INCREASE_GROWTH";
    }

    return "EXPLORE_NEW_STRATEGY";
  }
}
