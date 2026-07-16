import { godCore } from "./GodCore";

// Initialize the autonomous God-Mode simulation loop every 30 seconds
const intervalId = setInterval(() => {
  try {
    const result = godCore.run();
    console.log("🔮 GOD-MODE CONVERGENCE SIMULATOR:", result.finalAction, "@", new Date(result.timestamp).toLocaleTimeString());
  } catch (error: any) {
    console.warn("God-Mode loop failed:", error.message || error);
  }
}, 30000);

export const godLoopControl = {
  stop: () => clearInterval(intervalId)
};
