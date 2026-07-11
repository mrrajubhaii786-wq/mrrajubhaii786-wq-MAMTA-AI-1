export interface AutonomousState {
  built: boolean;
  deployed: boolean;
  error: string | null;
}

export function decide(state: AutonomousState): "fix" | "build" | "deploy" | "done" {
  if (state.error) return "fix";
  if (!state.built) return "build";
  if (!state.deployed) return "deploy";
  return "done";
}

export class DecisionEngine {
  decide(inputOrIntent: string, optionalIntent?: string): { mode: "AGENT" | "PLAN" | "AI" | "CHAT" } {
    const intent = (optionalIntent || inputOrIntent || "").toUpperCase().trim();

    switch (intent) {
      case "REASONING":
      case "AI":
        return { mode: "AI" };

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

  decideAutonomous(state: AutonomousState): "fix" | "build" | "deploy" | "done" {
    return decide(state);
  }
}
