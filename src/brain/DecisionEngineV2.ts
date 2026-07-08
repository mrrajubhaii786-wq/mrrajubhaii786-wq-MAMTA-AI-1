export class DecisionEngineV2 {
  decide(intent: string, input: string): { action: string; mode: "AGENT" | "PLAN" | "AI" | "CHAT" | "SMART" } {
    const t = input.toLowerCase().trim();

    if (intent === "CHAT" && !t.includes("plan") && !t.includes("build") && !t.includes("create")) {
      return { action: "RESPOND", mode: "CHAT" };
    }

    if (intent === "REASONING") {
      return { action: "THINK", mode: "AI" };
    }

    if (intent === "PLAN" || t.includes("plan")) {
      return { action: "CREATE_PLAN", mode: "PLAN" };
    }

    if (t.includes("build") || t.includes("execute") || intent === "BUILD") {
      return { action: "EXECUTE_BUILD", mode: "AGENT" };
    }

    return { action: "RESPOND", mode: "CHAT" };
  }
}
