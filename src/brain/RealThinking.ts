// src/brain/RealThinking.ts
import { callLocalLLM } from "./LocalLLMReal";

export async function realThink(input: string, memory: any): Promise<string> {
  const prompt = `
  You are an autonomous AI developer.

  Context:
  ${JSON.stringify(memory)}

  Task:
  ${input}

  Decide next action:
  - PLAN
  - BUILD
  - FIX
  - DEPLOY
  `;

  return await callLocalLLM(prompt);
}
