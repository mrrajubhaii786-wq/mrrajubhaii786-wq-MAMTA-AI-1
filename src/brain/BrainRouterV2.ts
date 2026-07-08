export class BrainRouterV2 {
  route(intent: string, input: string): "LLM" | "TOOL" {
    const t = input.toLowerCase().trim();
    
    // Explicit building / execution commands go to TOOL mode
    if (intent === "BUILD" || t.includes("build") || t.includes("execute") || t.includes("run tool")) {
      return "TOOL";
    }

    // Reasoning, general chat, planning go to LLM mode
    return "LLM";
  }
}
