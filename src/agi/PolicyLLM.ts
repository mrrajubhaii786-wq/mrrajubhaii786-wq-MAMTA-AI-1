export class PolicyLLM {
  generate(context: string) {
    if (context.toLowerCase().includes("risk")) {
      return "STRICT_POLICY";
    }
    return "ADAPTIVE_POLICY";
  }
}
