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

export class AGIEngine {
  async decide(paramsOrInput: any): Promise<{ action: string; reason: string }> {
    let input = "";
    let projectState = {};

    if (typeof paramsOrInput === "string") {
      input = paramsOrInput;
    } else if (paramsOrInput && typeof paramsOrInput === "object") {
      input = paramsOrInput.input || "";
      projectState = paramsOrInput.state || paramsOrInput.context || {};
    }

    // AGI Rule Engine Safety Filters
    if (input.includes("delete system")) {
      return { action: "BLOCKED", reason: "Action blocked: contains critical safety violation 'delete system'." };
    }

    if (input.includes("error")) {
      return { action: "FIX", reason: "Action automatically directed to FIX loop due to 'error' trigger." };
    }

    // Otherwise proceed to dynamic AI decision-making
    try {
      const memory = {};
      const actionObj = await thinkAndDecide(input, projectState, memory);
      return actionObj;
    } catch {
      return { action: "BUILD", reason: "Fallback default action on inference error" };
    }
  }
}

