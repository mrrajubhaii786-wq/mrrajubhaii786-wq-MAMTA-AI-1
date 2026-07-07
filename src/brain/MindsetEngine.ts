export class MindsetEngine {
  detectIntent(input: string): string {
    const text = input.toLowerCase().trim();

    if (
      text.includes("कैसे") ||
      text.includes("क्यों") ||
      text.includes("क्या") ||
      text.includes("how") ||
      text.includes("why") ||
      text.includes("universe") ||
      text.includes("life") ||
      text.includes("science") ||
      text.includes("origin")
    ) {
      return "REASONING"; // 🔥 FIX
    }

    if (
      text.includes("plan") || 
      text.includes("build") || 
      text.includes("create") || 
      text.startsWith("/plan") || 
      text.startsWith("/build")
    ) {
      return "PLAN";
    }

    return "CHAT";
  }

  getMindset(intent: string): string {
    const map: Record<string, string> = {
      DEVELOPER: "DEV",
      developer: "DEV",
      PLAN: "STRATEGIST",
      planning: "STRATEGIST",
      REASONING: "SCIENTIST",
      reasoning: "SCIENTIST",
      CHAT: "CHAT",
      chat: "CHAT"
    };

    return map[intent.toUpperCase()] || map[intent] || "CHAT";
  }
}

