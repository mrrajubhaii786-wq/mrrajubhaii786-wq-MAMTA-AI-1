export class DecisionEngine {
  decide(inputOrIntent: string, optionalIntent?: string): { mode: "AGENT" | "PLAN" | "AI" | "CHAT" } {
    const intent = (optionalIntent || inputOrIntent || "").toUpperCase().trim();

    switch (intent) {
      case "REASONING":
      case "AI":
        return { mode: "AI" }; // 🔥 MUST BE AI

      case "PLAN":
      case "PLANNING":
        return { mode: "PLAN" };

      case "DEVELOPER":
      case "AGENT":
        return { mode: "AGENT" };

      default:
        return { mode: "CHAT" };
    }
  }
}

