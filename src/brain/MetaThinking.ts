// src/brain/MetaThinking.ts

export function metaThink(state: any): string {
  if (!state) return "continue";

  if (state.errors > 3) {
    return "create-debug-agent";
  }

  if (state.slow) {
    return "create-optimizer-agent";
  }

  return "continue";
}
