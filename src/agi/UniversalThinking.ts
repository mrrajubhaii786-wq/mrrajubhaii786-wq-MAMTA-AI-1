export class UniversalThinking {
  analyze(input: any) {
    if (!input || !input.type) {
      return "EXPLORE";
    }

    const type = String(input.type).toLowerCase();
    if (type === "human") return "ADAPT";
    if (type === "economy") return "INVEST";
    if (type === "system") return "OPTIMIZE";

    return "EXPLORE";
  }
}
