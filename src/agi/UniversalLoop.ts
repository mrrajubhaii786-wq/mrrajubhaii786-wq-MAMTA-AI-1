import { UniversalCore } from "./UniversalCore";

const core = new UniversalCore();

// Initialize autonomous Universal Intelligence cycle every 30 seconds
const intervalId = setInterval(() => {
  try {
    const result = core.run([
      { type: "human", timestamp: Date.now() },
      { type: "economy", timestamp: Date.now() },
      { type: "system", timestamp: Date.now() }
    ]);
    console.log("🌌 UNIVERSAL:", result);
  } catch (error: any) {
    console.warn("Universal Loop Exception:", error.message);
  }
}, 30000);

// Exporting clean control methods
export const universalLoopControl = {
  stop: () => clearInterval(intervalId)
};
