export class BusinessAI {
  run(goal: string) {
    if (goal === "earn_money") {
      return "Launching micro SaaS";
    }

    if (goal === "scale") {
      return "Expanding services";
    }

    return "Idle";
  }
}
