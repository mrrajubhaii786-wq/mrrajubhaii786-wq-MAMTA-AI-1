export interface GeneratedContent {
  reel: string;
  caption: string;
  hashtags: string;
}

export class ContentEngine {
  generateContent(topic: string): GeneratedContent {
    return {
      reel: `🔥 AI just built "${topic}" in seconds 😳`,
      caption: `I used MAMTA AI to build "${topic}" in 1 click 🚀\nTry here 👉 mamta-ai.com`,
      hashtags: "#AI #startup #coding #makemoneyonline #indiehackers #saas"
    };
  }
}
