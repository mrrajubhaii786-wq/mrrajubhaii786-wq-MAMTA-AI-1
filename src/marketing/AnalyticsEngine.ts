export class AnalyticsEngine {
  async analyze(data: any, ai?: any) {
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: `Act as a senior growth hacking AI consultant. Analyze these current dashboard telemetry metrics:
          Views: ${data.views}
          Signups: ${data.signups}
          Upgrades: ${data.upgrades}
          Revenue: INR ${data.revenue}
          
          Respond strictly with a JSON object (no markdown, no extra text) with the schema:
          {
            "bestPlatform": "Suggested high-conversion social platform (string)",
            "bestTime": "Optimal posting window e.g. 5:30 PM (string)",
            "bestContent": "Suggested viral hook style (string)",
            "suggestion": "A robust, customized, action-oriented conversion marketing advice based on current data (string)"
          }`
        });

        const text = response.text || '';
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return {
          bestPlatform: parsed.bestPlatform || "YouTube Shorts",
          bestTime: parsed.bestTime || "6:00 PM",
          bestContent: parsed.bestContent || "Behind the scenes code build",
          suggestion: parsed.suggestion || "Excellent baseline traffic. Double down on showing live payment triggers to raise confidence."
        };
      } catch (err) {
        console.warn("Gemini AnalyticsEngine failed, using fallback:", err);
      }
    }

    return {
      bestPlatform: "YouTube Shorts & TikTok",
      bestTime: "6:00 PM IST",
      bestContent: "AI builds payment structures live",
      suggestion: "Your organic conversion rate is healthy. We suggest focusing heavily on YouTube Shorts showing instant live UPI checkouts to drive upgrades."
    };
  }
}
