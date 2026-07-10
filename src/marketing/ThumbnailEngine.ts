export class ThumbnailEngine {
  async generate(title: string, ai?: any) {
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: `Generate a clickbaity visual thumbnail configuration for a video titled: "${title}".
          Respond strictly with a JSON object (no markdown, no extra text) with the schema:
          {
            "text": "Punchy title text for the graphic, max 4 words (string)",
            "style": "Styling description e.g. Neon Cyberpunk, Swiss Clean, or Ultra Bold Red (string)",
            "emoji": "1 highly expressive emoji (string)",
            "bg": "Tailwind-compatible gradient description e.g. from-indigo-950 via-slate-900 to-emerald-900 (string)"
          }`
        });

        const text = response.text || '';
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleaned);
        return {
          text: data.text || title,
          style: data.style || "bold + high contrast",
          emoji: data.emoji || "🔥",
          bg: data.bg || "from-slate-950 to-indigo-955"
        };
      } catch (err) {
        console.warn("Gemini ThumbnailEngine failed, using fallback:", err);
      }
    }

    return {
      text: title,
      style: "bold + high contrast",
      emoji: "🔥",
      bg: "from-slate-950 to-emerald-950"
    };
  }
}
