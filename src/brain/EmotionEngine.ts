export class EmotionEngine {
  detectEmotion(text: string): "sad" | "happy" | "angry" | "confused" | "neutral" {
    const t = text.toLowerCase().trim();

    if (
      /sad|tired|alone|dukhi|thak|udas|udaas|bura|rona|crying|hurt|pain|low/.test(t)
    ) {
      return "sad";
    }
    if (
      /happy|excited|great|awesome|khush|maza|badhiya|mast|congratulations|wow|love|good|manga|superb/.test(t)
    ) {
      return "happy";
    }
    if (
      /angry|gussa|frustrated|gusse|irritate|hate|pagal|stupid/.test(t)
    ) {
      return "angry";
    }
    if (
      /confused|samajh nahi|confuse|doubt|kya|kaise|kyun|how|why|what|explain|samjhao/.test(t)
    ) {
      return "confused";
    }

    return "neutral";
  }

  emotionStyle(emotion: "sad" | "happy" | "angry" | "confused" | "neutral"): "soft" | "energetic" | "calm" | "explaining" | "normal" {
    switch (emotion) {
      case "sad":
        return "soft";
      case "happy":
        return "energetic";
      case "angry":
        return "calm";
      case "confused":
        return "explaining";
      default:
        return "normal";
    }
  }
}
