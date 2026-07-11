// src/brain/SelfThinking.ts

export interface ProjectState {
  built: boolean;
  deployed: boolean;
  error: string | null;
  [key: string]: any;
}

export function think(state: ProjectState): "FIX" | "BUILD" | "DEPLOY" | "DONE" {
  if (state.error) {
    console.log("🧠 [SelfThinking] State has errors. Recommendation: FIX");
    return "FIX";
  }
  if (!state.built) {
    console.log("🧠 [SelfThinking] State is not built. Recommendation: BUILD");
    return "BUILD";
  }
  if (!state.deployed) {
    console.log("🧠 [SelfThinking] State is built but not deployed. Recommendation: DEPLOY");
    return "DEPLOY";
  }

  console.log("🧠 [SelfThinking] All checks passed. Recommendation: DONE");
  return "DONE";
}
