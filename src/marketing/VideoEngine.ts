export class VideoEngine {
  async generateVideo(topic: string, ai?: any) {
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: `Generate a short viral video script outline for topic: "${topic}". 
          Respond strictly with a JSON object (no markdown, no extra text) with the following schema:
          {
            "title": "A highly clickbaity, uppercase-accented viral title (string)",
            "scenes": ["Scene 1 action hook", "Scene 2 builder show", "Scene 3 payout display", "Scene 4 Call-to-action"],
            "voiceover": "Short energetic 30-word voiceover script (string)"
          }`
        });
        
        const text = response.text || '';
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleaned);
        if (data.title && data.scenes) {
          return {
            title: data.title,
            scenes: data.scenes,
            voiceover: data.voiceover || "auto"
          };
        }
      } catch (err) {
        console.warn("Gemini VideoEngine failed, using fallback:", err);
      }
    }

    // Default high-converting template
    return {
      title: `AI Built ${topic} in 60 Seconds`,
      scenes: [
        "Hook: This AI is insane 🤯",
        `I asked it to build ${topic}`,
        "It created everything automatically",
        "Try it now 🚀"
      ],
      voiceover: `This AI is absolutely insane. I literally asked it to build a ${topic} and it coded the entire database, frontend, and backend in just sixty seconds. Don't believe me? Try it yourself right now.`
    };
  }
}
