import { ContentEngine } from "./ContentEngine";
import { ViralEngine } from "./ViralEngine";
import { DistributionEngine } from "./DistributionEngine";

export class GrowthAutomation {
  private contentEngine = new ContentEngine();
  private viral = new ViralEngine();
  private dist = new DistributionEngine();

  runOnce(topic: string = "AI Startup Builder") {
    const content = this.contentEngine.generateContent(topic);
    const script = this.viral.generateScript(topic);
    const posts = this.dist.post(content);

    return {
      topic,
      content,
      script,
      posts,
      timestamp: Date.now()
    };
  }

  start() {
    console.log("🚀 [GrowthAutomation] Initialized daily cron loop interval (86400000ms).");
    setInterval(() => {
      this.runOnce("AI Startup Builder");
    }, 86400000); // Daily execution
  }
}
