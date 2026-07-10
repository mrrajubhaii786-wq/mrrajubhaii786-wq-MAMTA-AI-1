export class ReelEngine {
  async createReel(video: any, ai?: any) {
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: `Create an engaging short video Reel description based on this script draft:
          Title: "${video.title}"
          Voiceover: "${video.voiceover}"
          
          Respond strictly with a JSON object (no markdown, no extra text) with the schema:
          {
            "video": "generated_video.mp4",
            "caption": "A social caption with dramatic hook, high conversion CTA and emojis (string)",
            "duration": "30s",
            "hashtags": "#AI #SaaS #Viral"
          }`
        });

        const text = response.text || '';
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleaned);
        return {
          video: data.video || "generated_video.mp4",
          caption: data.caption || "This AI will replace developers 😳",
          duration: data.duration || "30s",
          hashtags: data.hashtags || "#AI #SaaS #Growth #Coding #Launch"
        };
      } catch (err) {
        console.warn("Gemini ReelEngine failed, using fallback:", err);
      }
    }

    return {
      video: "generated_video.mp4",
      caption: `This AI will replace developers 😳. Watch me build a whole startup in 60 seconds with Mamta AI. Link in bio!`,
      duration: "30s",
      hashtags: "#AI #SaaS #Coding #IndieHackers #Viral"
    };
  }
}
