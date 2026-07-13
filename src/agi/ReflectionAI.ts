import { MemoryEvent } from "./SelfMemory";

export interface ReflectionInsight {
  mistakes: number;
  advice: string;
  resilienceRating: number;
}

export class ReflectionAI {
  reflect(memory: MemoryEvent[]): ReflectionInsight {
    let mistakes = 0;

    memory.forEach((m) => {
      if (m.result === "fail" || m.result === "error") {
        mistakes++;
      }
    });

    let advice = "System is operating with high accuracy. Maintain current evolution vector.";
    if (mistakes > 2) {
      advice = "Optimize algorithm strategy: Adjust parameters down, enforce tighter constraint checks, and check connection paths.";
    } else if (mistakes > 0) {
      advice = "Minor deviation noted. Stabilize memory lattice and increase checkpoint frequency.";
    }

    const resilienceRating = memory.length > 0 ? Math.max(0, 100 - (mistakes / memory.length) * 100) : 100;

    return {
      mistakes,
      advice,
      resilienceRating: Math.round(resilienceRating)
    };
  }
}
