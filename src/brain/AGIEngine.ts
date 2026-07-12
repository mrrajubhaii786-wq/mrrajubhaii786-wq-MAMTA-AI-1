// src/brain/AGIEngine.ts
import { callLocalLLM } from "./LocalLLMReal";

export interface AGIAction {
  action: "PLAN" | "BUILD" | "TEST" | "FIX" | "DEPLOY";
  reason: string;
}

export async function thinkAndDecide(
  input: string,
  projectState: any,
  memory: any
): Promise<AGIAction> {
  const prompt = `
  You are an autonomous AI developer.

  Current Project State:
  ${JSON.stringify(projectState)}

  Memory:
  ${JSON.stringify(memory)}

  User Goal:
  ${input}

  Decide next action:
  - PLAN
  - BUILD
  - FIX
  - TEST
  - DEPLOY

  Give JSON output ONLY matching this schema:
  { "action": "PLAN" | "BUILD" | "TEST" | "FIX" | "DEPLOY", "reason": "Explanation here" }
  `;

  try {
    const res = await callLocalLLM(prompt);
    // Find JSON substring
    const match = res.match(/\{[\s\S]*?\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    return {
      action: "PLAN",
      reason: "Defaulting to PLAN due to raw completion output: " + res
    };
  } catch (err: any) {
    console.error("Error in AGIEngine thinkAndDecide:", err);
    return {
      action: "PLAN",
      reason: "Inference exception fallback to PLAN phase."
    };
  }
}
