import { civilizationCore } from "./CivilizationCore";

class CivilizationLoop {
  private interval: NodeJS.Timeout | null = null;

  start() {
    if (this.interval) return;
    this.interval = setInterval(() => {
      try {
        const result = civilizationCore.run();
        console.log("🌐 CIVILIZATION:", result);
      } catch (err) {
        console.error("Error in Civilization Loop:", err);
      }
    }, 30000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export const civilizationLoop = new CivilizationLoop();
