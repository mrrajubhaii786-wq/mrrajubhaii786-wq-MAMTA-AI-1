export class MindsetEngine {
  detectIntent(input: string): string {
    const text = input.toLowerCase().trim();

    if (text.includes("plan") || text.includes("blueprint") || text.includes("roadmap") || text.startsWith("/plan")) {
      return "planning";
    }
    if (text.includes("build") || text.includes("create") || text.includes("code") || text.includes("program") || text.startsWith("/build")) {
      return "developer";
    }
    if (text.includes("error") || text.includes("bug") || text.includes("fix") || text.includes("fail") || text.includes("issue")) {
      return "debug";
    }
    if (text.includes("why") || text.includes("reason") || text.includes("explain") || text.includes("how come")) {
      return "reasoning";
    }
    if (text.includes("how") || text.includes("learn") || text.includes("tutorial")) {
      return "learning";
    }

    return "chat";
  }

  getMindset(intent: string): string {
    const map: Record<string, string> = {
      developer: "DEV",
      debug: "DEBUGGER",
      reasoning: "SCIENTIST",
      planning: "STRATEGIST",
      learning: "TEACHER",
      chat: "CHAT"
    };

    return map[intent] || "CHAT";
  }
}
