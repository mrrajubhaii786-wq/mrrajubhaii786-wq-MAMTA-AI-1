export class DecisionEngine {
  decide(input: string, intent: string): { brain: "LOCAL" | "AI" | "AGENTS"; useAgents: boolean } {
    const text = input.toLowerCase().trim();

    // Short standard greetings and simple words run locally for instant speed
    if (text.length < 20 || text === "hi" || text === "hello" || text === "hey" || text === "namaste") {
      return { brain: "LOCAL", useAgents: false };
    }

    // High level planning and development trigger the Multi-Agent Collaboration system
    if (intent === "planning" || intent === "developer") {
      return { brain: "AGENTS", useAgents: true };
    }

    // Standard conversational queries use the server-side Gemini AI model
    return { brain: "AI", useAgents: false };
  }
}
