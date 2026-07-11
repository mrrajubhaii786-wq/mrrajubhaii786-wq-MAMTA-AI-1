import { callLocalLLM } from "./LocalLLMReal";

export async function thinkDeep(input: string): Promise<string> {
  const prompt = `
  Analyze deeply:
  ${input}

  Steps:
  1. Understand
  2. Break into parts
  3. Solve
  `;

  return await callLocalLLM(prompt);
}
