export class RoadmapAI {
  generate(context: { errors: number; growth: number }): string[] {
    if (context.errors > 3) {
      return ["FIX_SYSTEM", "STABILIZE"];
    }

    if (context.growth < 50) {
      return ["OPTIMIZE", "SCALE"];
    }

    return ["EXPLORE", "INNOVATE"];
  }
}
